import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadTree, type LoadedTree } from "../data/loadTree";
import PersonCard from "./PersonCard";

export default function TreeView() {
  const { t } = useTranslation();

  const { id } = useParams<{ id?: string }>();
  const treeId = id ?? "1";

  const [treeInfo, setTreeInfo] = useState<LoadedTree | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    loadTree(treeId)
      .then((treeData) => {
        console.log(treeData);
        setTreeInfo(treeData);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load tree"),
      )
      .finally(() => setIsLoading(false));
  }, [treeId]);

  if (isLoading) return <Spinner />;
  if (error) return <Text>{error ?? t("noPersonSelected")}</Text>;
  if (!treeInfo) return null;

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
            to={`/person/${treeInfo.parents?.husbId}`}
            style={{ textDecoration: "none" }}
          >
            <PersonCard personId={treeInfo.parents?.husbId} isFocused />
          </Link>
        </VStack>
        <VStack gap={2}>
          <Text fontWeight="semibold" fontSize="sm" color="gray.600">
            {t("wife")}
          </Text>
          <Link
            to={`/person/${treeInfo.parents?.wifeId}`}
            style={{ textDecoration: "none" }}
          >
            <PersonCard personId={treeInfo.parents?.wifeId} isFocused />
          </Link>
        </VStack>
      </Box>
      <VStack gap={6} align="center" w="100%">
        {treeInfo.descendants?.map(({ id, spouseId, position }) => (
          <HStack key={id} gap={8} justifyContent="center" w="100%">
            <Box w="300px" flexShrink={0}>
              {position === "left" && (
                <Link
                  to={`/person/${spouseId}`}
                  style={{ textDecoration: "none" }}
                >
                  <PersonCard personId={spouseId} />
                </Link>
              )}
            </Box>
            <Link to={`/person/${id}`} style={{ textDecoration: "none" }}>
              <PersonCard personId={id} isFocused />
            </Link>
            <Box w="300px" flexShrink={0}>
              {position === "right" && (
                <Link
                  to={`/person/${spouseId}`}
                  style={{ textDecoration: "none" }}
                >
                  <PersonCard personId={spouseId} />
                </Link>
              )}
            </Box>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
