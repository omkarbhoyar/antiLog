import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { TeamMember } from '@/types/auth';
import {
  UserCheck,
  UserPlus,
  Shield,
  Trash2,
  Edit,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Lock,
} from 'lucide-react';

export const DealerTeamPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [team, setTeam] = useState(() => StorageService.getTeam(dealer.id));
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Sales Executive');

  useEffect(() => {
    return subscribeToStore(() => {
      setTeam(StorageService.getTeam(dealer.id));
    });
  }, [dealer.id]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      id: 'team-' + Date.now(),
      dealerId: dealer.id,
      name,
      email,
      phone: phone || '+91 98XXX XXXXX',
      role,
      status: 'Active',
      permissions: {
        inventory: role === 'Inventory Manager' || role === 'Dealer Owner' ? 'full' : 'view_only',
        leads: role === 'Dealer Owner' || role === 'Sales Manager' ? 'full' : 'assigned_only',
        appointments: 'full',
        analytics: role === 'Dealer Owner' ? 'view' : 'none',
        billing: role === 'Dealer Owner' ? 'manage' : 'none',
        team: role === 'Dealer Owner' ? 'manage' : 'none',
        storefront: role === 'Dealer Owner' ? 'manage' : 'none',
      },
      leadsCount: 0,
      salesCount: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    StorageService.saveTeamMember(newMember);
    setIsInviteOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    success('Staff Member Invited', `Invitation credentials dispatched to ${email}.`);
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (member.role === 'Dealer Owner') {
      alert('The Dealer Owner account cannot be removed.');
      return;
    }
    if (window.confirm(`Deactivate and remove ${member.name}?`)) {
      StorageService.deleteTeamMember(member.id);
      success('Staff Removed', `${member.name} has been removed.`);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Team & Employee Permissions"
        subtitle={`Manage staff roles, access levels, and sales commissions for ${dealer.name}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Invite New Team Member</h3>
              <button onClick={() => setIsInviteOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Batra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="e.g. vikram@dealership.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dealership Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Dealer Admin">Dealer Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all"
              >
                Send Invite & Assign Role
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Staff Directory ({team.length} Members)
            </h3>
            <p className="text-xs text-slate-500">
              Configure role-based access to CRM leads, inventory costing, and customer phone numbers
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#C6F36B]" />
            <span>Invite Staff Member</span>
          </button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{member.name}</h4>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 mt-0.5 border border-blue-200">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {member.role !== 'Dealer Owner' && (
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Deactivate staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </p>
                </div>

                {/* Permissions Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Access Permissions
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <span className="p-1.5 bg-slate-50 rounded text-slate-700 flex items-center justify-between">
                      <span>Inventory</span>
                      <strong className="text-slate-900">{member.permissions.inventory}</strong>
                    </span>
                    <span className="p-1.5 bg-slate-50 rounded text-slate-700 flex items-center justify-between">
                      <span>Leads CRM</span>
                      <strong className="text-slate-900">{member.permissions.leads}</strong>
                    </span>
                    <span className="p-1.5 bg-slate-50 rounded text-slate-700 flex items-center justify-between">
                      <span>Analytics</span>
                      <strong className="text-slate-900">{member.permissions.analytics}</strong>
                    </span>
                    <span className="p-1.5 bg-slate-50 rounded text-slate-700 flex items-center justify-between">
                      <span>Billing</span>
                      <strong className="text-slate-900">{member.permissions.billing}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Joined {member.joinedDate}</span>
                <span className="font-bold text-emerald-600">{member.salesCount} Deals Closed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
