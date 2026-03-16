import { Card, Heading, Text, Image, Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Person } from "../types";
import { loadPerson } from "../data/loadPersons";
import { nameForLocale } from "../utils/transliterate";
import { formatPersonDateYear } from "../utils/formatDate";
import { parseBio } from "../utils/parseBio";

type Props = {
  personId: string;
  orderNumber?: number;
  isFocused?: boolean;
  onClick?: () => void;
};

export default function PersonCard({
  orderNumber,
  personId,
  isFocused,
  onClick,
}: Props) {
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
          <Box
            h="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
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
    [
      person.lastName,
      `${person.maidenName === "notApplicable" ? "" : `(${person.maidenName})`}`,
      person.firstName,
      `${person.patronymic === "undefined" ? "" : person.patronymic}`,
    ],
    i18n.language,
  );

  const birth = formatPersonDateYear(person.birthDate);
  const death = formatPersonDateYear(person.deathDate);

  const dates = [birth, death].join(" – ");

  return (
    <Card.Root
      w={isFocused ? "300px" : "280px"}
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      _hover={onClick ? { shadow: "md" } : undefined}
      position="relative"
    >
      <Card.Body>
        {orderNumber != null && (
          <Box
            position="absolute"
            top="-8px"
            left="-8px"
            minW="28px"
            h="28px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            style={{ background: "linear-gradient(145deg, #e2e8f0 0%, #cbd5e0 100%)" }}
            color="gray.700"
            fontSize="xs"
            fontWeight="bold"
            boxShadow="0 2px 6px rgba(0, 0, 0, 0.08)"
            border="2px solid"
            borderColor="white"
          >
            {orderNumber}
          </Box>
        )}
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
            {parseBio(person.bio)}
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}
