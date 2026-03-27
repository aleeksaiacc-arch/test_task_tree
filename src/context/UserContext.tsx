import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Dialog, Input, Portal } from "@chakra-ui/react";
import { notifyVisit } from "../utils/notifyVisit";

type UserContextValue = {
  name: string;
};

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "userName";

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const stored = localStorage.getItem(STORAGE_KEY) ?? "";
  const [name, setName] = useState<string | null>(null);
  const [draft, setDraft] = useState(stored);

  const open = name === null;

  const confirm = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setName(trimmed);
    notifyVisit(trimmed, window.location.pathname);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") confirm();
  };

  return (
    <UserContext.Provider value={name ? { name } : { name: "" }}>
      <Dialog.Root
        open={open}
        placement="center"
        closeOnInteractOutside={false}
        closeOnEscape={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("enterYourName")}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("enterYourName")}
                  autoFocus
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  colorPalette="blue"
                  onClick={confirm}
                  disabled={!draft.trim()}
                >
                  {t("confirm")}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {open ? (
        <Box filter="blur(4px)" pointerEvents="none" minH="100vh">
          {children}
        </Box>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}
