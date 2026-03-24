import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import { RequireAuth, RequireAdmin } from "./RouteGuards";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/auth/pages/ProfilePage";

import LandingPage from "../features/landing/LandingPage";
import BrowsePage from "../features/items/pages/BrowsePage";
import NotFound from "../components/NotFound";

// Admin pages
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminItemsPage from "../features/admin/pages/AdminItemsPage";
import AdminClaimsPage from "../features/admin/pages/AdminClaimsPage";
import AdminManageDataPage from "../features/admin/pages/AdminManageDataPage";


// Items pages
import ItemsDashboardPage from "../features/items/pages/ItemsDashboardPage";
import ItemDetailsPage from "../features/items/pages/ItemDetailsPage";
import EditItemPage from "../features/items/pages/EditItemPage";
import ReportItemPage from "../features/items/pages/ReportItemPage";

// Item claims
import MyClaimsPage from "../features/claims/pages/MyClaimsPage";
import ClaimDetailsPage from "../features/claims/pages/ClaimDetailsPage";
import ClaimWithdrawnSuccessPage from "../features/claims/pages/ClaimWithdrawnSuccessPage";
import ClaimSubmitPage from "../features/claims/pages/ClaimSubmitPage";
import ClaimInboxPage from "../features/claims/pages/ClaimInboxPage";




export const router = createBrowserRouter(
  [
    //Public routes
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/", element: <LandingPage /> },

    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "browse",
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
          path: "admin/manage-data",
          element: (
          <RequireAdmin>
            <AdminManageDataPage />
          </RequireAdmin>
          ),
        },
        { //Items
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
              <ReportItemPage type="lost" />
            </RequireAuth>
          ),
        },
        {
          path: "items/report-found",
          element: (
            <RequireAuth>
              <ReportItemPage type="found" />
            </RequireAuth>
          ),
        },
        {
          path: "items/:itemId/claim",
          element: (
            <RequireAuth>
              <ClaimSubmitPage />
            </RequireAuth>
          ),
        },
        {
          path: "claims/inbox",
          element: (
            <RequireAuth>
              <ClaimInboxPage />
            </RequireAuth>
          ),
        },
        { //Claims
          path: "claims",
          element: (
            <RequireAuth>
              <MyClaimsPage />
            </RequireAuth>
            ),
        },
        {
          path: "claims/:claimId",
          element: (
            <RequireAuth>
              <ClaimDetailsPage />
            </RequireAuth>
            ),
        },
        {
          path: "claims/:claimId/withdrawn-success",
          element: (
          <RequireAuth>
            <ClaimWithdrawnSuccessPage />
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