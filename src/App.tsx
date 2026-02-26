import { Box, HStack, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import TreeView from "./components/TreeView";
import PersonPage from "./pages/PersonPage";

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
        <Route path="/" element={<TreeView />} />
        <Route path="/person/:id" element={<PersonPage />} />
      </Routes>
    </Box>
  );
}

export default App;
