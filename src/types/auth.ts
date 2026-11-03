export type UserRole =
  | 'customer'
  | 'dealer_owner'
  | 'dealer_admin'
  | 'dealer_sales'
  | 'dealer_inventory'
  | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  dealerId?: string; // If associated with a dealer
  dealerName?: string;
  avatar?: string;
  city?: string;
}

export interface TeamMember {
  id: string;
  dealerId: string;
  name: string;
  email: string;
  phone: string;
  role: 'Dealer Owner' | 'Dealer Admin' | 'Sales Manager' | 'Sales Executive' | 'Inventory Manager';
  status: 'Active' | 'Invited' | 'Suspended';
  permissions: {
    inventory: 'full' | 'view_edit' | 'view_only' | 'none';
    leads: 'full' | 'assigned_only' | 'none';
    appointments: 'full' | 'assigned_only' | 'none';
    analytics: 'view' | 'none';
    billing: 'manage' | 'none';
    team: 'manage' | 'none';
    storefront: 'manage' | 'none';
  };
  leadsCount: number;
  salesCount: number;
  avatar: string;
  joinedDate: string;
}
