// Routes.ts
import { Layout } from './components/layout/Layout';
import { SettingsView } from "./views/SettingsView";
import { NotFound } from "./views/NotFound";
import { Navigate, RouteObject } from "react-router-dom";
import { DashboardView } from "./views/dashboard/DashboardView";

export const appRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
