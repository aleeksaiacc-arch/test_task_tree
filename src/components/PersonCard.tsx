import { Card, Heading, Text, Image, Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Person } from "../types";
import { loadPerson } from "../data/loadPersons";
import { formatDate } from "../utils/formatDate";
import { nameForLocale } from "../utils/transliterate";

type Props = {
  personId: string;
  isFocused?: boolean;
  onClick?: () => void;
};

export default function PersonCard({ personId, isFocused, onClick }: Props) {
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
      <Card.Root w={isFocused ? "300px" : "280px"}>
        <Card.Body>
          <Box h="120px" display="flex" alignItems="center" justifyContent="center">
            <Spinner size="sm" />
          </Box>
        </Card.Body>
      </Card.Root>
    );
  }

  if (!person) {
    return (
      <Card.Root w={isFocused ? "300px" : "280px"}>
        <Card.Body>
          <Text fontSize="sm" color="gray.500">
            {t("noPersonSelected")}
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  const displayName = nameForLocale(
    [person.lastName, person.firstName, person.patronymic, person.maidenName],
    i18n.language
  );
  const birth = formatDate(i18n.language, person.birthDate);
  const death = formatDate(i18n.language, person.deathDate);
  const dates =
    birth || death ? [birth, death].filter(Boolean).join(" – ") : null;

  return (
    <Card.Root
      w={isFocused ? "300px" : "280px"}
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      _hover={onClick ? { shadow: "md" } : undefined}
    >
      <Card.Body>
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt=""
            borderRadius="md"
            loading="lazy"
            maxH="200px"
            objectFit="cover"
          />
        ) : (
          <Box
            h="120px"
            bg="gray.100"
            borderRadius="md"
            aria-label={t("noPhoto")}
            background="#969daf"
          />
        )}
        <Heading size={isFocused ? "md" : "sm"} mt={2} lineClamp={3}>
          {displayName}
        </Heading>
        {dates && (
          <Text fontSize="sm" color="gray.600" mt={1}>
            {dates}
          </Text>
        )}
        {isFocused && person.bio && (
          <Text fontSize="sm" mt={2} lineClamp={4}>
            {person.bio}
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}
