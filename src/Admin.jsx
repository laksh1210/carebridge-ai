import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";
        const res = await fetch(`${API_URL}/api/appointments`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError("Could not load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner"
      style={{ minHeight: '80vh', padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '2.5rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>View all incoming consultation bookings.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading appointments...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)' }}>No bookings found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((apt) => (
            <div key={apt.id} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', boxShadow: '0 4px 12px rgba(139,94,60,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Booking ID</div>
                <div style={{ fontWeight: 'bold', color: 'var(--brand-dk)' }}>{apt.booking_id}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Patient</div>
                <div style={{ fontWeight: '500', color: 'var(--text)' }}>{apt.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{apt.phone}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{apt.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Consultation</div>
                <div style={{ fontWeight: '500', color: 'var(--text)' }}>{apt.consultation_type}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{apt.date} at {apt.time}</div>
                <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px', background: apt.status === 'pending' ? 'var(--brand-lt)' : 'var(--surface)', color: 'var(--brand-dk)' }}>{apt.status}</div>
              </div>
              {apt.notes && (
                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', background: 'var(--bg)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Notes / Symptoms</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.95rem', fontStyle: 'italic' }}>"{apt.notes}"</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
