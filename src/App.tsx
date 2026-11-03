import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { MarketplaceLayout } from './components/common/MarketplaceLayout';
import { DealerLayout } from './components/dealer/DealerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Marketplace Pages
import { HomePage } from './pages/marketplace/HomePage';
import { BrowseCarsPage } from './pages/marketplace/BrowseCarsPage';
import { VehicleDetailPage } from './pages/marketplace/VehicleDetailPage';
import { DealersListPage } from './pages/marketplace/DealersListPage';
import { DealerProfilePage } from './pages/marketplace/DealerProfilePage';
import { CustomerRequirementsPage } from './pages/marketplace/CustomerRequirementsPage';
import { CustomerFavoritesPage } from './pages/marketplace/CustomerFavoritesPage';
import { CustomerEnquiriesPage } from './pages/marketplace/CustomerEnquiriesPage';
import { CustomerAppointmentsPage } from './pages/marketplace/CustomerAppointmentsPage';
import { CustomerAuthPage } from './pages/marketplace/CustomerAuthPage';

// Showroom Pages
import { ShowroomHomePage } from './pages/showroom/ShowroomHomePage';
import { ShowroomInventoryPage } from './pages/showroom/ShowroomInventoryPage';
import { ShowroomContactPage } from './pages/showroom/ShowroomContactPage';

// Dealer Dashboard Pages
import { DealerDashboardPage } from './pages/dealer/DealerDashboardPage';
import { DealerInventoryPage } from './pages/dealer/DealerInventoryPage';
import { DealerLeadsPage } from './pages/dealer/DealerLeadsPage';
import { DealerAppointmentsPage } from './pages/dealer/DealerAppointmentsPage';
import { DealerQRCodesPage } from './pages/dealer/DealerQRCodesPage';
import { DealerAnalyticsPage } from './pages/dealer/DealerAnalyticsPage';
import { DealerTeamPage } from './pages/dealer/DealerTeamPage';
import { DealerSubscriptionPage } from './pages/dealer/DealerSubscriptionPage';
import { DealerSettingsPage } from './pages/dealer/DealerSettingsPage';
import { DealerStorefrontPreviewPage } from './pages/dealer/DealerStorefrontPreviewPage';

// Super Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminDealersPage } from './pages/admin/AdminDealersPage';
import { AdminListingsModerationPage } from './pages/admin/AdminListingsModerationPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminMarketplacePage } from './pages/admin/AdminMarketplacePage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* MODULE A: MARKETPLACE PUBLIC ROUTES */}
            <Route element={<MarketplaceLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/cars" element={<BrowseCarsPage />} />
              <Route path="/cars/:id" element={<VehicleDetailPage />} />
              <Route path="/dealers" element={<DealersListPage />} />
              <Route path="/dealers/:slug" element={<DealerProfilePage />} />
              <Route path="/requirements" element={<CustomerRequirementsPage />} />
              <Route path="/favorites" element={<CustomerFavoritesPage />} />
              <Route path="/my-enquiries" element={<CustomerEnquiriesPage />} />
              <Route path="/my-appointments" element={<CustomerAppointmentsPage />} />
            </Route>

            {/* AUTH ROUTES */}
            <Route path="/login" element={<CustomerAuthPage />} />
            <Route path="/register" element={<CustomerAuthPage />} />

            {/* MODULE B: DEALER DIGITAL SHOWROOM ROUTES */}
            <Route path="/showroom/:slug" element={<ShowroomHomePage />} />
            <Route path="/showroom/:slug/cars" element={<ShowroomInventoryPage />} />
            <Route path="/showroom/:slug/cars/:id" element={<VehicleDetailPage />} />
            <Route path="/showroom/:slug/contact" element={<ShowroomContactPage />} />

            {/* MODULE C: DEALER MANAGEMENT DASHBOARD ROUTES */}
            <Route path="/dealer" element={<DealerLayout />}>
              <Route index element={<Navigate to="/dealer/dashboard" replace />} />
              <Route path="dashboard" element={<DealerDashboardPage />} />
              <Route path="inventory" element={<DealerInventoryPage />} />
              <Route path="leads" element={<DealerLeadsPage />} />
              <Route path="appointments" element={<DealerAppointmentsPage />} />
              <Route path="qr-codes" element={<DealerQRCodesPage />} />
              <Route path="analytics" element={<DealerAnalyticsPage />} />
              <Route path="team" element={<DealerTeamPage />} />
              <Route path="subscription" element={<DealerSubscriptionPage />} />
              <Route path="settings" element={<DealerSettingsPage />} />
              <Route path="storefront" element={<DealerStorefrontPreviewPage />} />
            </Route>

            {/* MODULE D: CENTRAL SUPER ADMIN ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="dealers" element={<AdminDealersPage />} />
              <Route path="dealer-verification" element={<AdminDealersPage />} />
              <Route path="listings" element={<AdminListingsModerationPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="subscriptions" element={<AdminPlansPage />} />
              <Route path="marketplace" element={<AdminMarketplacePage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
