import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { statisticsApi } from '../api/statistics';
import { vehiclesApi } from '../api/vehicles';
import { VehicleStatistics, Vehicle, PeriodType } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<VehicleStatistics | null>(null);
  const [brandStats, setBrandStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('last_30_days');

  const loadVehicles = async () => {
    try {
      const data = await vehiclesApi.getAll();
      setVehicles(data);
      if (data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    }
  };

  const loadStatistics = async () => {
    if (!selectedVehicleId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await statisticsApi.getVehicleStatistics(selectedVehicleId, { period });
      setStatistics(data);

      const brandData = await statisticsApi.getBrandGradeStatistics(selectedVehicleId, { period });
      setBrandStats(brandData);

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      loadStatistics();
    }
  }, [selectedVehicleId, period]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  const consumptionChartData = statistics?.calculations.map(item => ({
    date: format(new Date(item.entryDate), 'MMM dd'),
    consumption: parseFloat(item.consumptionPer100km.toFixed(2)),
  })) || [];

  const priceChartData = statistics?.calculations.map(item => ({
    date: format(new Date(item.entryDate), 'MMM dd'),
    price: parseFloat(item.costPerLiter.toFixed(2)),
  })) || [];

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1>Dashboard</h1>

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

        {vehicles.length === 0 ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <h2>Welcome to Fuel Tracker!</h2>
            <p>Get started by adding your first vehicle.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Select Vehicle:
                </label>
                <select
                  value={selectedVehicleId || ''}
                  onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                >
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.makeModel || 'Unnamed Vehicle'} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Time Period:
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodType)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                >
                  <option value="last_30_days">Last 30 days</option>
                  <option value="last_90_days">Last 90 days</option>
                  <option value="year_to_date">Year to date</option>
                  <option value="all_time">All time</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading statistics...</div>
            ) : statistics && statistics.summary ? (
              <>
                {selectedVehicle && (
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}>
                    <h2 style={{ marginTop: 0 }}>
                      {selectedVehicle.makeModel || 'Unnamed Vehicle'} {selectedVehicle.year ? `(${selectedVehicle.year})` : ''}
                    </h2>
                    <div style={{ color: '#6c757d' }}>
                      License Plate: {selectedVehicle.licensePlate} | Fuel Type: {selectedVehicle.fuelType}
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Total Entries
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {statistics.totalEntries}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Total Fuel
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {statistics.summary?.totalFuel.toFixed(1)} L
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Total Spent
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      ${statistics.summary?.totalCost.toFixed(2)}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Avg. Consumption
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {statistics.summary?.averageConsumption.toFixed(2)} L/100km
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Avg. Price/Liter
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      ${statistics.summary?.averageCostPerLiter.toFixed(2)}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      Distance Traveled
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {Math.abs(statistics.summary?.totalDistance || 0).toLocaleString()} km
                    </div>
                  </div>
                </div>

                {consumptionChartData.length > 0 && (
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}>
                    <h3 style={{ marginTop: 0 }}>Fuel Consumption Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={consumptionChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'L/100km', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="consumption"
                          stroke="#007bff"
                          strokeWidth={2}
                          name="Consumption (L/100km)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {priceChartData.length > 0 && (
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                  }}>
                    <h3 style={{ marginTop: 0 }}>Fuel Price Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Price/L', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="price"
                          fill="#28a745"
                          name="Price per Liter"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {brandStats.length > 0 && (
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}>
                    <h3 style={{ marginTop: 0 }}>Fuel Brand Statistics</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Brand</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Grade</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Fill-ups</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total Liters</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Avg Price/L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brandStats.map((stat, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '0.75rem' }}>{stat.brand}</td>
                            <td style={{ padding: '0.75rem' }}>{stat.grade}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.fillUpCount}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.totalLiters.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>${stat.avgCostPerLiter.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : statistics && statistics.message ? (
              <div style={{
                padding: '2rem',
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeeba',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <h3>Not enough data</h3>
                <p>{statistics.message}</p>
                <p>Add at least 2 fuel entries to start seeing statistics.</p>
              </div>
            ) : (
              <div style={{
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <p>No fuel entries found for this vehicle and time period.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
