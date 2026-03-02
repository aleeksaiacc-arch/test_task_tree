import { Box, HStack, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES } from "./routes";

const LOCALES = ["ru", "pl", "by", "lt"] as const;

function App() {
  const { i18n, t } = useTranslation();
  useEffect(() => {
    document.title = t("title");
  }, [i18n.language, t]);

  return (
    <Box minH="100vh" p={4}>
      <HStack mb={4} gap={2} flexWrap="wrap">
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
      <Routes>
        {APP_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Box>
  );
}

export default App;
