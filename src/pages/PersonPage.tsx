import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  Image,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nameForLocale } from "../utils/transliterate";
import { format, parse } from "date-fns";
import { loadPerson } from "../data/loadPersons";

import { Person } from "@/types";

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!person) return <Text>{t("noPersonSelected")}</Text>;

  const displayName = nameForLocale(
    [person.firstName, person.patronymic, person.maidenName],
    i18n.language,
  );

  const birth =
    person.birthDate === "undefined"
      ? "????"
      : format(parse(person.birthDate, "dd-MM-yyyy", new Date()), "yyyy");

  const death =
    person.deathDate === "undefined"
      ? "????"
      : format(parse(person.deathDate, "dd-MM-yyyy", new Date()), "yyyy");

  const dates = [birth, death].join(" – ");
  useEffect(() => {
    if (!id) {
      setPerson(null);
      return;
    }
    setIsLoading(true);
    loadPerson(id)
      .then((p) => setPerson(p))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner />;

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <Button asChild variant="plain" mb={4} size="sm">
        <Link to="/">{t("backToTree")}</Link>
      </Button>
      <VStack align="stretch" gap={6}>
        <Card.Root>
          <Card.Body>
            {person.photoUrl ? (
              <Image
                src={person.photoUrl}
                alt=""
                borderRadius="md"
                maxH="300px"
                objectFit="cover"
              />
            ) : (
              <Box
                h="200px"
                bg="gray.100"
                borderRadius="md"
                aria-label={t("noPhoto")}
              />
            )}
            <Heading size="lg" mt={4}>
              {displayName}
            </Heading>
            {dates && (
              <Text fontSize="md" color="gray.600" mt={2}>
                {dates}
              </Text>
            )}
            {person.bio && <Text mt={4}>{person.bio}</Text>}
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
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
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
