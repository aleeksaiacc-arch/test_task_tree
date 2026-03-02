import type { ReactElement } from "react";
import TreeView from "./components/TreeView";
import PersonPage from "./pages/PersonPage";

type AppRoute = {
  path: string;
  element: ReactElement;
};

export const APP_ROUTES: AppRoute[] = [
  { path: "/", element: <TreeView /> },
  { path: "/tree/:id", element: <TreeView /> },
  { path: "/person/:id", element: <PersonPage /> },
];
