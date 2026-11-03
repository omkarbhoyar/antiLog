import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { MultiStepAddVehicleModal } from '@/components/dealer/MultiStepAddVehicleModal';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { formatPriceINR, formatKilometers } from '@/utils/formatters';
import {
  Car,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Edit,
  ExternalLink,
  ShieldCheck,
  Eye,
  MessageSquare,
  QrCode,
  Tag,
} from 'lucide-react';

export const DealerInventoryPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [vehicles, setVehicles] = useState(() =>
    StorageService.getVehicles().filter((v) => v.dealerId === dealer.id)
  );

  useEffect(() => {
    return subscribeToStore(() => {
      setVehicles(StorageService.getVehicles().filter((v) => v.dealerId === dealer.id));
    });
  }, [dealer.id]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      return true;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredVehicles.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleStatusChange = (vehicleId: string, newStatus: VehicleStatus) => {
    StorageService.updateVehicleStatus(vehicleId, newStatus);
    success('Vehicle Updated', `Status changed to ${newStatus}.`);
  };

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
      StorageService.deleteVehicle(vehicle.id);
      success('Vehicle Deleted', `${vehicle.make} ${vehicle.model} removed from lot.`);
    }
  };

  const handleDuplicate = (vehicle: Vehicle) => {
    const dup: Vehicle = {
      ...vehicle,
      id: 'veh-' + Date.now(),
      model: `${vehicle.model} (Copy)`,
      status: 'available',
      viewsCount: 0,
      enquiriesCount: 0,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveVehicle(dup);
    success('Vehicle Duplicated', `Created a copy of ${vehicle.model}.`);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Make,Model,Variant,Year,KM,Fuel,AskingPrice,Status\n';
    const rows = filteredVehicles
      .map(
        (v) =>
          `"${v.id}","${v.make}","${v.model}","${v.variant}",${v.manufacturingYear},${v.specs.kilometers},"${v.specs.fuelType}",${v.pricing.askingPrice},"${v.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dealer.slug}-inventory.csv`;
    a.click();
    success('CSV Exported', 'Inventory downloaded successfully.');
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Vehicle Inventory Management"
        subtitle={`Total ${vehicles.length} listings registered in ${dealer.name}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <MultiStepAddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        editVehicle={editingVehicle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search inventory by model, variant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Status pills */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses ({vehicles.length})</option>
              <option value="available">Available ({vehicles.filter((v) => v.status === 'available').length})</option>
              <option value="reserved">Reserved ({vehicles.filter((v) => v.status === 'reserved').length})</option>
              <option value="sold">Sold ({vehicles.filter((v) => v.status === 'sold').length})</option>
              <option value="inactive">Draft / Inactive ({vehicles.filter((v) => v.status === 'inactive').length})</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setEditingVehicle(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C6F36B]" />
              <span>Add Vehicle Listing</span>
            </button>
          </div>
        </div>

        {/* Selected Items Bulk Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-[#10151F] text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs animate-fade-in">
            <span className="font-bold text-[#C6F36B]">
              {selectedIds.length} vehicle(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedIds.forEach((id) => StorageService.updateVehicleStatus(id, 'reserved'));
                  setSelectedIds([]);
                  success('Bulk Status Updated', 'Selected vehicles marked as Reserved.');
                }}
                className="px-3 py-1 bg-[#182231] rounded-lg text-slate-200 hover:text-white"
              >
                Mark Reserved
              </button>
              <button
                onClick={() => {
                  selectedIds.forEach((id) => StorageService.updateVehicleStatus(id, 'sold'));
                  setSelectedIds([]);
                  success('Bulk Status Updated', 'Selected vehicles marked as Sold.');
                }}
                className="px-3 py-1 bg-red-600 rounded-lg text-white font-bold"
              >
                Mark Sold
              </button>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 pl-4 pr-2 w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredVehicles.length
                      }
                      onChange={handleSelectAll}
                      className="accent-[#10151F]"
                    />
                  </th>
                  <th className="py-3.5 px-3">Vehicle Details</th>
                  <th className="py-3.5 px-3">Specs</th>
                  <th className="py-3.5 px-3">Asking Price</th>
                  <th className="py-3.5 px-3">Cost / Margin</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Engagement</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((car) => {
                  const isSelected = selectedIds.includes(car.id);
                  const margin = car.pricing.acquisitionPrice
                    ? car.pricing.askingPrice - car.pricing.acquisitionPrice
                    : 0;

                  return (
                    <tr
                      key={car.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(car.id)}
                          className="accent-[#10151F]"
                        />
                      </td>

                      {/* Vehicle Image & Name */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.primaryImage}
                            alt={car.model}
                            className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-slate-900 text-xs">
                                {car.manufacturingYear} {car.make} {car.model}
                              </h4>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                                {car.condition.grade}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">{car.variant}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              RTO: {car.specs.rtoLocation}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="py-4 px-3">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">
                            {formatKilometers(car.specs.kilometers)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {car.specs.fuelType} • {car.specs.transmission}
                          </p>
                          <p className="text-[10px] text-slate-400">{car.specs.ownership}</p>
                        </div>
                      </td>

                      {/* Asking Price */}
                      <td className="py-4 px-3">
                        <span className="font-extrabold text-sm text-[#10151F]">
                          {formatPriceINR(car.pricing.askingPrice)}
                        </span>
                        {car.pricing.negotiable && (
                          <p className="text-[10px] text-emerald-600 font-semibold">Negotiable</p>
                        )}
                      </td>

                      {/* Confidential Dealer Margin */}
                      <td className="py-4 px-3">
                        {car.pricing.acquisitionPrice ? (
                          <div>
                            <span className="text-slate-500 text-[11px]">
                              Cost: {formatPriceINR(car.pricing.acquisitionPrice)}
                            </span>
                            <p className="text-xs font-bold text-emerald-700">
                              +{formatPriceINR(margin)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <select
                          value={car.status}
                          onChange={(e) => handleStatusChange(car.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                            car.status === 'available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : car.status === 'reserved'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : car.status === 'sold'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>

                      {/* Engagement Metrics */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                            {car.viewsCount}
                          </span>
                          <span className="flex items-center gap-1" title="Enquiries">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            {car.enquiriesCount}
                          </span>
                          <span className="flex items-center gap-1" title="QR Scans">
                            <QrCode className="w-3.5 h-3.5 text-purple-500" />
                            {car.qrScansCount}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/cars/${car.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            title="View Public Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => {
                              setEditingVehicle(car);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit Vehicle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(car)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(car)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
