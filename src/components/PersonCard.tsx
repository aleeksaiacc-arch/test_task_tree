import { Card, Heading, Text, Image, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Person } from "../types";
import { formatDate } from "../utils/formatDate";
import { nameForLocale } from "../utils/transliterate";

type Props = {
  person: Person;
  isFocused?: boolean;
  onClick?: () => void;
};

export default function PersonCard({ person, isFocused, onClick }: Props) {
  const { t, i18n } = useTranslation();
  const displayName = nameForLocale(
    [person.name, person.patronymic, person.maidenName],
    i18n.language
  );
  const birth = formatDate(i18n.language, person.birthDate);
  const death = formatDate(i18n.language, person.deathDate);
  const dates =
    birth || death ? [birth, death].filter(Boolean).join(" – ") : null;

  return (
    <Card.Root
      maxW={isFocused ? "400px" : "280px"}
      w="100%"
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
          <Box h="120px" bg="gray.100" borderRadius="md" aria-label={t("noPhoto")} />
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
