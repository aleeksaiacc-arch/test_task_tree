import { Box, Button, Card, CardBody, Heading, Text, Image, VStack, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadTree } from "../data/loadTree";
import type { Person, Tree } from "../types";
import { formatDate } from "../utils/formatDate";
import { nameForLocale } from "../utils/transliterate";

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [tree, setTree] = useState<Tree | null>(null);

  useEffect(() => {
    loadTree().then(setTree);
  }, []);

  if (!tree) return <Spinner />;
  const person = id ? tree.people.find((p) => p.id === id) : null;
  if (!person) return <Text>{t("noPersonSelected")}</Text>;

  const displayName = nameForLocale(
    [person.name, person.patronymic, person.maidenName],
    i18n.language
  );
  const birth = formatDate(i18n.language, person.birthDate);
  const death = formatDate(i18n.language, person.deathDate);
  const dates = birth || death ? [birth, death].filter(Boolean).join(" – ") : null;

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <Button as={Link} to="/" variant="link" mb={4} size="sm">
        {t("backToTree")}
      </Button>
      <VStack align="stretch" spacing={6}>
        <Card>
          <CardBody>
            {person.photoUrl ? (
              <Image
                src={person.photoUrl}
                alt=""
                borderRadius="md"
                maxH="300px"
                objectFit="cover"
              />
            ) : (
              <Box h="200px" bg="gray.100" borderRadius="md" aria-label={t("noPhoto")} />
            )}
            <Heading size="lg" mt={4}>
              {displayName}
            </Heading>
            {dates && (
              <Text fontSize="md" color="gray.600" mt={2}>
                {dates}
              </Text>
            )}
            {person.bio && (
              <Text mt={4}>{person.bio}</Text>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Heading size="sm" mb={3}>
              {t("personInfo")}
            </Heading>
            <Box
              minH="120px"
              p={4}
              bg="gray.50"
              borderRadius="md"
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="gray.300"
            >
              <Text fontSize="sm" color="gray.500">
                {t("personInfoPlaceholder")}
              </Text>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
