import { Box, Flex, HStack, Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES } from "./routes";
import { useUser } from "./context/UserContext";

const LOCALES = ["ru", "pl", "by", "lt"] as const;

function App() {
  const { i18n, t } = useTranslation();
  const { name } = useUser();

  useEffect(() => {
    document.title = t("title");
  }, [i18n.language, t]);

  return (
    <Box minH="100vh" p={4}>
      <Flex mb={4} justify="space-between" align="center" flexWrap="wrap" gap={2}>
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
      <Routes>
        {APP_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Box>
  );
}

export default App;
