import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { fuelEntriesApi } from '../api/fuelEntries';
import { vehiclesApi } from '../api/vehicles';
import { FuelEntry, Vehicle } from '../types';
import { format } from 'date-fns';

interface FuelEntryFormData {
  vehicleId: number | '';
  entryDate: string;
  odometer: number | '';
  stationName: string;
  fuelBrand: string;
  fuelGrade: string;
  quantityLiters: number | '';
  totalAmount: number | '';
  currency: string;
  notes?: string;
}

const emptyForm: FuelEntryFormData = {
  vehicleId: '',
  entryDate: format(new Date(), 'yyyy-MM-dd'),
  odometer: '',
  stationName: '',
  fuelBrand: '',
  fuelGrade: '',
  quantityLiters: '',
  totalAmount: '',
  currency: 'USD',
  notes: '',
};

export const FuelEntries: React.FC = () => {
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FuelEntryFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<number | 'all'>('all');

  const loadEntries = async () => {
    try {
      setLoading(true);
      const vehicleId = selectedVehicleFilter !== 'all' ? selectedVehicleFilter : undefined;
      const data = await fuelEntriesApi.getAll(vehicleId);
      setEntries(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load fuel entries');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await vehiclesApi.getAll();
      setVehicles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      loadEntries();
    }
  }, [selectedVehicleFilter, vehicles.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const submitData = {
        vehicleId: Number(formData.vehicleId),
        entryDate: formData.entryDate,
        odometer: Number(formData.odometer),
        stationName: formData.stationName,
        fuelBrand: formData.fuelBrand,
        fuelGrade: formData.fuelGrade,
        quantityLiters: Number(formData.quantityLiters),
        totalAmount: Number(formData.totalAmount),
        currency: formData.currency,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        await fuelEntriesApi.update(editingId, submitData);
      } else {
        await fuelEntriesApi.create(submitData);
      }
      await loadEntries();
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save fuel entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: FuelEntry) => {
    setFormData({
      vehicleId: entry.vehicleId,
      entryDate: format(new Date(entry.entryDate), 'yyyy-MM-dd'),
      odometer: entry.odometer,
      stationName: entry.stationName || '',
      fuelBrand: entry.fuelBrand || '',
      fuelGrade: entry.fuelGrade || '',
      quantityLiters: entry.quantityLiters,
      totalAmount: entry.totalAmount,
      currency: entry.currency,
      notes: entry.notes || '',
    });
    setEditingId(entry.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this fuel entry?')) {
      return;
    }

    try {
      await fuelEntriesApi.delete(id);
      await loadEntries();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete fuel entry');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
  };

  const getVehicleName = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.makeModel || 'Vehicle'} (${vehicle.licensePlate || 'N/A'})` : 'Unknown Vehicle';
  };

  const calculatePricePerLiter = (entry: FuelEntry) => {
    if (entry.quantityLiters === 0) return '0.00';
    return (entry.totalAmount / entry.quantityLiters).toFixed(2);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Fuel Entries</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              disabled={vehicles.length === 0}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: vehicles.length === 0 ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: vehicles.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              Add Fuel Entry
            </button>
          )}
        </div>

        {vehicles.length === 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}>
            Please add a vehicle first before creating fuel entries.
          </div>
        )}

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {vehicles.length > 0 && !showForm && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Filter by vehicle:</label>
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              style={{
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              <option value="all">All Vehicles</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.makeModel || 'Vehicle'} ({vehicle.licensePlate || 'N/A'})
                </option>
              ))}
            </select>
          </div>
        )}

        {showForm && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}>
            <h2>{editingId ? 'Edit Fuel Entry' : 'Add New Fuel Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Vehicle *
                  </label>
                  <select
                    required
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.makeModel || 'Vehicle'} ({vehicle.licensePlate || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Odometer *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Station Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stationName}
                    onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Fuel Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fuelBrand}
                    onChange={(e) => setFormData({ ...formData, fuelBrand: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Fuel Grade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fuelGrade}
                    onChange={(e) => setFormData({ ...formData, fuelGrade: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Quantity (Liters) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.quantityLiters}
                    onChange={(e) => setFormData({ ...formData, quantityLiters: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Currency *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading fuel entries...</div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            No fuel entries yet. Click "Add Fuel Entry" to create your first entry.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Vehicle</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Odometer</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Station</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Fuel</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Quantity (L)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Price/L</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>
                      {format(new Date(entry.entryDate), 'MMM dd, yyyy')}
                    </td>
                    <td style={{ padding: '1rem' }}>{getVehicleName(entry.vehicleId)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{entry.odometer.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{entry.stationName}</td>
                    <td style={{ padding: '1rem' }}>
                      {entry.fuelBrand} {entry.fuelGrade}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{entry.quantityLiters.toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {entry.currency} {entry.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {entry.currency} {calculatePricePerLiter(entry)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(entry)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};
