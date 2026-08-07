import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="gray.200"
      bg="gray.50"
      px={4}
      py={4}
      mt={8}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={2}
        fontSize="sm"
        color="gray.600"
      >
        <Text>
          &copy; {year} {t("familyArchive")}. {t("allRightsReserved")}.
        </Text>

        <Link to="/all-photos" style={{ textDecoration: "none" }}>
          <Text
            fontWeight="medium"
            _hover={{ color: "gray.900" }}
            transition="color 0.2s"
          >
            {t("allPhotos")}
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}
