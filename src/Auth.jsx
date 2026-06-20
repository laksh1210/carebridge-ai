import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Auth({ setAuthStatus, setTab }) {
  const [mode, setMode] = useState("select-role"); 
  
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', phone: '', name: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAuthStatus({ loggedIn: true, user: data.user, role: data.user.role });
        if (data.user.role === 'doctor') {
          setTab('admin');
        } else {
          setTab('booking');
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [suggestion, setSuggestion] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuggestion(null);

    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.name) {
      setError("All fields are required.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAuthStatus({ loggedIn: true, user: data.user, role: data.user.role });
        setTab('booking');
      } else {
        setError(data.error || "Registration failed");
        if (data.suggestion) {
          setSuggestion(data.suggestion);
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = () => {
    
    setAuthStatus({ 
      loggedIn: true, 
      user: { id: 999, username: 'google_user', name: 'Google User', email: 'user@gmail.com', role: 'patient' }, 
      role: 'patient' 
    });
    setTab('booking');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner auth-page"
    >
      <div className="auth-container">
        <AnimatePresence mode="wait">
          
          {mode === "select-role" && (
            <motion.div key="select" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="auth-card">
              <div className="auth-header">
                <h2>Welcome to CareBridge</h2>
                <p>Please select how you would like to proceed.</p>
              </div>
              <div className="role-options">
                <button className="role-btn patient" onClick={() => setMode("patient-login")}>
                  <span className="icon">👤</span>
                  <span className="text">I am a Patient</span>
                </button>
                <button className="role-btn doctor" onClick={() => setMode("doctor-login")}>
                  <span className="icon">🩺</span>
                  <span className="text">I am a Doctor</span>
                </button>
              </div>
            </motion.div>
          )}

          {mode === "doctor-login" && (
            <motion.div key="doc-login" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="auth-card">
              <div className="auth-header">
                <h2>Doctor Portal</h2>
                <p>Please sign in with your credentials.</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Doctor ID / Username</label>
                  <input type="text" placeholder="e.g. admin" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                  {loading ? "Authenticating..." : "Sign In"}
                </button>
              </form>
              <button className="back-link" onClick={() => { setMode("select-role"); setError(null); }}>← Back to Selection</button>
            </motion.div>
          )}

          {mode === "patient-login" && (
            <motion.div key="pat-login" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="auth-card">
              <div className="auth-header">
                <h2>Patient Login</h2>
                <p>Welcome back! Sign in to book a consultation.</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
              <div className="auth-footer">
                Don't have an account? <button onClick={() => { setMode("patient-signup"); setError(null); }} className="text-link">Sign Up</button>
              </div>
              <button className="back-link" onClick={() => { setMode("select-role"); setError(null); }}>← Back</button>
            </motion.div>
          )}

          {mode === "patient-signup" && (
            <motion.div key="pat-signup" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="auth-card large">
              <div className="auth-header">
                <h2>Create an Account</h2>
                <p>Join CareBridge to schedule your first consultation.</p>
              </div>
              <form onSubmit={handleSignup} className="auth-form two-cols">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Unique Username</label>
                  <input type="text" placeholder="janedoe99" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="jane@gmail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="form-group full-col">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                {error && (
                  <div className="error-message full-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span>{error}</span>
                    {suggestion && (
                      <button 
                        type="button" 
                        onClick={() => { setFormData({...formData, username: suggestion}); setError(null); setSuggestion(null); }}
                        style={{ padding: '0.5rem', background: 'var(--brand-lt)', border: '1px solid var(--brand)', borderRadius: '8px', color: 'var(--brand-dk)', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Try this username: {suggestion}
                      </button>
                    )}
                  </div>
                )}
                <div className="full-col">
                  <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
              <div className="auth-footer">
                Already have an account? <button onClick={() => { setMode("patient-login"); setError(null); }} className="text-link">Sign In</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
