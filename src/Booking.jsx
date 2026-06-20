import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const TYPES = ["General Physician", "Mental Health", "Women's Health", "Pediatrics", "Dermatology", "Nutrition & Wellness", "Other"];
const TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

function Calendar({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };
  
  const nextMonth = () => {
    const nxt = new Date(year, month + 1, 1);
    if (nxt <= maxDate) {
      setCurrentMonth(nxt);
    }
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="custom-calendar">
      <div className="cal-header">
        <button onClick={prevMonth} className="cal-nav">&lt;</button>
        <div className="cal-title">{monthNames[month]} {year}</div>
        <button onClick={nextMonth} className="cal-nav">&gt;</button>
      </div>
      <div className="cal-weekdays">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="cal-empty" />;
          
          d.setHours(0,0,0,0);
          const isDisabled = d < today || d > maxDate;
          const isSelected = selectedDate && d.getTime() === selectedDate.getTime();

          return (
            <button 
              key={i} 
              disabled={isDisabled}
              onClick={() => onSelect(d)}
              className={`cal-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking({ setTab }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    consultation_type: '', date: null, time: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!formData.email.includes('@')) {
        setError("Please enter a valid email address.");
        return;
      }
    } else if (step === 2) {
      if (!formData.consultation_type || !formData.date || !formData.time) {
        setError("Please select consultation type, date, and time.");
        return;
      }
    }
    setError(null);
    setStep(s => s + 1);
  };

  const submitBooking = async () => {
    if (!formData.consultation_type || !formData.date || !formData.time) {
      setError("Please select consultation type, date, and time.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        date: formData.date.toISOString().split('T')[0]
      };
      
      const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setBookingId(data.booking_id);
        setStep(3);
      } else {
        setError(data.error || "Failed to book appointment.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner booking-page"
    >
      <div className="booking-container">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="booking-card">
              <div className="booking-header">
                <h2>Your Details</h2>
                <p>Let's start with some basic information.</p>
              </div>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="booking-actions">
                <button className="btn btn-primary" onClick={handleNext}>Continue →</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="booking-card large">
              <div className="booking-header">
                <h2>Consultation Details</h2>
                <p>Choose your preferred service, date, and time.</p>
              </div>
              
              <div className="form-section">
                <label>Consultation Type *</label>
                <div className="type-grid">
                  {TYPES.map(t => (
                    <button 
                      key={t} 
                      className={`type-card ${formData.consultation_type === t ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, consultation_type: t})}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="datetime-split">
                <div className="form-section flex-1">
                  <label>Select Date *</label>
                  <Calendar selectedDate={formData.date} onSelect={d => setFormData({...formData, date: d})} />
                </div>
                
                <div className="form-section flex-1">
                  <label>Select Time *</label>
                  <div className="time-grid">
                    {TIMES.map(t => (
                      <button 
                        key={t}
                        className={`time-pill ${formData.time === t ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, time: t})}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section mt-4">
                <label>Notes / Symptoms (Optional)</label>
                <textarea 
                  rows="3" 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Briefly describe why you are seeking a consultation..."
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="booking-actions split mt-4">
                <button className="btn btn-outline" onClick={() => { setStep(1); setError(null); }}>← Back</button>
                <button className="btn btn-primary" onClick={submitBooking} disabled={loading}>
                  {loading ? 'Confirming...' : 'Confirm Booking ✓'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className="booking-card success">
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Your appointment has been successfully scheduled. We look forward to seeing you.</p>
              
              <div className="booking-id-box">
                <span className="label">Booking ID</span>
                <span className="id">{bookingId}</span>
              </div>
              
              <div className="booking-summary">
                <p><strong>For:</strong> {formData.name}</p>
                <p><strong>Type:</strong> {formData.consultation_type}</p>
                <p><strong>Date:</strong> {formData.date?.toDateString()}</p>
                <p><strong>Time:</strong> {formData.time}</p>
              </div>
              
              <p className="success-note">A confirmation email has been sent to {formData.email}.</p>
              
              <div className="booking-actions centered mt-4">
                <button className="btn btn-primary" onClick={() => setTab('home')}>Return to Home</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
