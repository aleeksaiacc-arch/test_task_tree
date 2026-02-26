import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadTree } from "../data/loadTree";
import type { Person, Tree } from "../types";
import PersonCard from "./PersonCard";
import ParentsRow from "./ParentsRow";
import ChildrenRow from "./ChildrenRow";

export default function TreeView() {
  const [tree, setTree] = useState<Tree | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    loadTree().then((t) => {
      setTree(t);
      if (t.people.length > 0) setFocusedId((prev) => prev ?? t.people[0].id);
    });
  }, []);

  const { t } = useTranslation();
  if (!tree) return <Spinner />;

  const spouseRel = tree.relations.find((r) => r.type === "spouse");
  const isCoupleOnly =
    tree.people.length === 2 &&
    spouseRel?.personId &&
    spouseRel?.spouseId;

  if (isCoupleOnly && spouseRel) {
    const husband = tree.people.find((p) => p.id === spouseRel.personId);
    const wife = tree.people.find((p) => p.id === spouseRel.spouseId);
    if (husband && wife) {
      return (
        <Box display="flex" flexDirection="row" gap={8} justifyContent="center" flexWrap="wrap" alignItems="flex-start">
          <VStack spacing={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.600">
              {t("husband")}
            </Text>
            <Link to={`/person/${husband.id}`} style={{ textDecoration: "none" }}>
              <PersonCard person={husband} isFocused />
            </Link>
          </VStack>
          <VStack spacing={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.600">
              {t("wife")}
            </Text>
            <Link to={`/person/${wife.id}`} style={{ textDecoration: "none" }}>
              <PersonCard person={wife} isFocused />
            </Link>
          </VStack>
        </Box>
      );
    }
  }

  const focused = focusedId ? tree.people.find((p) => p.id === focusedId) : null;
  if (!focused) return <Text>{t("noPersonSelected")}</Text>;

  const parentIds = tree.relations
    .filter((r) => r.type === "parent-child" && r.childId === focusedId)
    .map((r) => r.parentId);
  const childIds = tree.relations
    .filter((r) => r.type === "parent-child" && r.parentId === focusedId)
    .map((r) => r.childId);

  const parents = parentIds
    .map((id) => tree.people.find((p) => p.id === id))
    .filter(Boolean) as Person[];
  const children = childIds
    .map((id) => tree.people.find((p) => p.id === id))
    .filter(Boolean) as Person[];

  return (
    <Box display="flex" flexDirection="column" gap={6} alignItems="center">
      <ChildrenRow people={children} />
      <Link to={`/person/${focused.id}`} style={{ textDecoration: "none" }}>
        <PersonCard person={focused} isFocused />
      </Link>
      <ParentsRow people={parents} />
    </Box>
  );
}
