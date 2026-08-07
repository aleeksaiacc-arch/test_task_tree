import { Box, Flex, HStack, Button, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";

const LOCALES = ["ru", "pl", "by", "lt"] as const;

export default function Header() {
  const { i18n } = useTranslation();
  const { name } = useUser();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg="white"
      borderBottom="2px solid"
      borderColor="gray.200"
      px={4}
      py={3}
    >
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <HStack gap={2} flexWrap="wrap">
          {LOCALES.map((lng) => (
            <Button
              key={lng}
              size="sm"
              variant={i18n.language === lng ? "solid" : "outline"}
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lng.toUpperCase()}
            </Button>
          ))}
        </HStack>
        {name && (
          <Text fontWeight="bold" fontSize="md">
            {name}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
