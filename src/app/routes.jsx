import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import { RequireAuth, RequireAdmin } from "./RouteGuards";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/auth/pages/ProfilePage";

import BrowsePage from "../features/items/pages/BrowsePage";
import NotFound from "../components/NotFound";

// Admin pages
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminItemsPage from "../features/admin/pages/AdminItemsPage";
import AdminClaimsPage from "../features/admin/pages/AdminClaimsPage";

// Items pages
import ItemsDashboardPage from "../features/items/pages/ItemsDashboardPage";
import ItemDetailsPage from "../features/items/pages/ItemDetailsPage";
import EditItemPage from "../features/items/pages/EditItemPage";
import CreateLostItemPage from "../features/items/pages/CreateLostItemPage";
import CreateFoundItemPage from "../features/items/pages/CreateFoundItemPage";

export const router = createBrowserRouter(
  [
    //Public routes
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },


    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <BrowsePage />
            </RequireAuth>
          ),
        },
        {
          path: "profile",
          element: (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          ),
        },

        //Admin-only routes
        {
          path: "admin",
          element: (
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          ),
        },
        {
          path: "admin/items",
          element: (
            <RequireAdmin>
              <AdminItemsPage />
            </RequireAdmin>
          ),
        },
        {
          path: "admin/claims",
          element: (
            <RequireAdmin>
              <AdminClaimsPage />
            </RequireAdmin>
          ),
        },
        {
          path: "items",
          element: (
          <RequireAuth>
            <ItemsDashboardPage />
            </RequireAuth>
            ),
        },
        {
          path: "items/:itemId",
          element: (
          <RequireAuth>
            <ItemDetailsPage />
          </RequireAuth>
            ),
        },
        {
          path: "items/:itemId/edit",
          element: (
          <RequireAuth>
            <EditItemPage />
          </RequireAuth>
            ),
        },
        {
          path: "items/report-lost",
          element: (
            <RequireAuth>
              <CreateLostItemPage />
            </RequireAuth>
          ),
        },
        {
          path: "items/report-found",
          element: (
            <RequireAuth>
              <CreateFoundItemPage />
            </RequireAuth>
          ),
        },
      ],
          },
          //Global catch-all
          { path: "*", element: <NotFound /> },
        ],
        { basename: import.meta.env.BASE_URL }
      );