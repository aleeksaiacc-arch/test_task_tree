import { Text, Image, Box, Spinner, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Person } from "../types";
import { loadPerson } from "../data/loadPersons";
import { nameForLocale } from "../utils/transliterate";
import { format, parse } from "date-fns";

type Props = {
  personId: string;
  label?: string;
};

export default function MiniPersonCard({ personId, label }: Props) {
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!personId) {
      setPerson(null);
      return;
    }
    setIsLoading(true);
    loadPerson(personId)
      .then((p) => setPerson(p))
      .finally(() => setIsLoading(false));
  }, [personId]);

  if (isLoading) {
    return (
      <Box
        w="180px"
        h="60px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xs" />
      </Box>
    );
  }

  if (!person) return null;

  const displayName = nameForLocale(
    [
      person.lastName,
      `${person.maidenName === "notApplicable" ? "" : `(${person.maidenName})`}`,
      person.firstName,
      `${person.patronymic === "undefined" ? "" : person.patronymic}`,
    ],
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

  return (
    <Link to={`/person/${person.id}`}>
      <Box
        p={2}
        borderRadius="lg"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        transition="background 0.2s"
      >
        {label && (
          <Text fontSize="xs" color="gray.500" mb={1}>
            {label}
          </Text>
        )}
        <HStack gap={2}>
          {person.photoUrl ? (
            <Image
              src={person.photoUrl}
              alt=""
              borderRadius="md"
              boxSize="48px"
              objectFit="cover"
              flexShrink={0}
            />
          ) : (
            <Box
              boxSize="48px"
              bg="#969daf"
              borderRadius="md"
              flexShrink={0}
              aria-label={t("noPhoto")}
            />
          )}
          <Box overflow="hidden">
            <Text fontSize="sm" fontWeight="medium" lineClamp={2}>
              {displayName}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {birth} – {death}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Link>
  );
}
