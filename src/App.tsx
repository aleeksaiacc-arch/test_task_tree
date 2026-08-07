import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES } from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [i18n.language, t]);

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box p={4} flex="1">
        <Routes>
          {APP_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
