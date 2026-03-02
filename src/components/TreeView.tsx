import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadTree } from "../data/loadTree";
import type { Person, Tree } from "../types";
import type { RootBlock } from "./BlockCard";
import BlockCard from "./BlockCard";
import PersonCard from "./PersonCard";
import ParentsRow from "./ParentsRow";
import ChildrenRow from "./ChildrenRow";

const ROOT_BLOCKS: RootBlock[] = [
  { id: "block-1", addition: "right", firstName: "Ян", lastName: "Комар" },
  { id: "block-2", addition: "right", firstName: "Вацлав", lastName: "Комар" },
  { id: "block-3", addition: "right", firstName: "Ричард", lastName: "Комар" },
  { id: "block-4", addition: "none", firstName: "Нина", lastName: "Комар" },
  { id: "block-5", addition: "left", firstName: "", lastName: "" },
  { id: "block-6", addition: "right", firstName: "", lastName: "" },
  { id: "block-7", addition: "none", firstName: "", lastName: "" },
  { id: "block-8", addition: "none", firstName: "", lastName: "" },
  { id: "block-9", addition: "none", firstName: "", lastName: "" },
  { id: "block-10", addition: "none", firstName: "", lastName: "" },
  { id: "block-11", addition: "none", firstName: "", lastName: "" },
  { id: "block-12", addition: "none", firstName: "", lastName: "" },
  { id: "block-13", addition: "none", firstName: "", lastName: "" },
  { id: "block-14", addition: "none", firstName: "", lastName: "" },
  { id: "block-15", addition: "none", firstName: "", lastName: "" },
  { id: "block-16", addition: "none", firstName: "", lastName: "" },
];

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
        <VStack gap={8} align="center" w="100%">
          <Box
            display="flex"
            flexDirection="row"
            gap={8}
            justifyContent="center"
            flexWrap="wrap"
            alignItems="flex-start"
          >
            <VStack gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                {t("husband")}
              </Text>
              <Link
                to={`/person/${husband.id}`}
                style={{ textDecoration: "none" }}
              >
                <PersonCard person={husband} isFocused />
              </Link>
            </VStack>
            <VStack gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                {t("wife")}
              </Text>
              <Link
                to={`/person/${wife.id}`}
                style={{ textDecoration: "none" }}
              >
                <PersonCard person={wife} isFocused />
              </Link>
            </VStack>
          </Box>
          <VStack gap={6} align="center" w="100%">
            {ROOT_BLOCKS.map((block, i) => (
              <BlockCard key={block.id} {...block} number={i + 1} />
            ))}
          </VStack>
        </VStack>
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
    <VStack gap={8} align="center" w="100%">
      <Box display="flex" flexDirection="column" gap={6} alignItems="center">
        <ChildrenRow people={children} />
        <Link to={`/person/${focused.id}`} style={{ textDecoration: "none" }}>
          <PersonCard person={focused} isFocused />
        </Link>
        <ParentsRow people={parents} />
      </Box>
      <VStack gap={6} align="center" w="100%">
        {ROOT_BLOCKS.map((block, i) => (
          <BlockCard key={block.id} {...block} number={i + 1} />
        ))}
      </VStack>
    </VStack>
  );
}
