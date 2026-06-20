import React from 'react';
import { motion } from 'framer-motion';

import aboutHeroImg from './assets/about_hero.png';
import lakshyaImg from './assets/avatar_lakshya.png';
import karanImg from './assets/avatar_karan.png';
import pragyanImg from './assets/avatar_pragyan.png';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About({ setTab }) {
  return (
    <motion.div 
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="about-hero"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="about-hero-content">
          <motion.div variants={fadeUpVariant} className="eyebrow">
            <div className="pulse-dot"></div>
            Discover Our Purpose
          </motion.div>
          <motion.h1 variants={fadeUpVariant}>
            About <em>CareBridge AI</em>
          </motion.h1>
          <motion.p variants={fadeUpVariant}>
            "Empowering individuals to overcome healthcare barriers through artificial intelligence, personalized guidance, and accessible digital solutions."
          </motion.p>
        </div>
        <motion.div variants={fadeUpVariant} className="about-hero-graphic">
          <img src={aboutHeroImg} alt="CareBridge AI Abstract Healthcare" />
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        className="about-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={fadeUpVariant}>Our Mission</motion.h2>
        <motion.p variants={fadeUpVariant} style={{ marginBottom: '4rem' }}>
          CareBridge AI was created to help people overcome the emotional, financial, informational, and practical barriers that often prevent them from seeking timely healthcare. By combining intelligent technology with a user-centered approach, we aim to make healthcare guidance more accessible, understandable, and approachable for everyone.
        </motion.p>
        
        <motion.h2 variants={fadeUpVariant}>Our Vision</motion.h2>
        <motion.p variants={fadeUpVariant}>
          To build a future where no individual delays medical care due to fear, uncertainty, cost concerns, or lack of information, empowering every person to make informed healthcare decisions with confidence.
        </motion.p>
      </motion.section>

      {/* What We Offer */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="about-section">
          <motion.h2 variants={fadeUpVariant}>What CareBridge AI Offers</motion.h2>
        </div>
        <motion.div className="about-grid" variants={staggerContainer}>
          {[
            { icon: "🤖", title: "AI-powered guidance", desc: "Intelligent, empathetic conversations to navigate health concerns." },
            { icon: "📝", title: "Barrier assessment", desc: "A psychological quiz to identify your specific healthcare hesitations." },
            { icon: "📖", title: "Patient success stories", desc: "Real experiences to inspire and normalize seeking care." },
            { icon: "🎯", title: "Personalized recommendations", desc: "Actionable next steps based on your unique situation." },
            { icon: "📅", title: "Consultation booking", desc: "Directly schedule appointments with verified professionals." },
            { icon: "📚", title: "Educational resources", desc: "Clear, simple explanations of healthcare processes and options." },
            { icon: "🔒", title: "Secure & user-friendly", desc: "A safe, private environment for your most sensitive questions." }
          ].map((item, idx) => (
            <motion.div key={idx} className="feature-card" variants={fadeUpVariant}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Meet the Team */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="about-section">
          <motion.h2 variants={fadeUpVariant}>Meet the Team</motion.h2>
        </div>
        <div className="team-grid">
          <motion.div className="team-card" variants={fadeUpVariant}>
            <img src={lakshyaImg} alt="Lakshya Falor" className="team-avatar" />
            <h3>Lakshya Falor</h3>
            <p>Full Stack Developer & Project Lead</p>
          </motion.div>
          <motion.div className="team-card" variants={fadeUpVariant}>
            <img src={karanImg} alt="Karan Singh" className="team-avatar" />
            <h3>Karan Singh</h3>
            <p>Developer & System Integration</p>
          </motion.div>
          <motion.div className="team-card" variants={fadeUpVariant}>
            <img src={pragyanImg} alt="Pragyan Shrivastav" className="team-avatar" />
            <h3>Pragyan Shrivastav</h3>
            <p>Developer & Research Contributor</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section 
        className="about-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={fadeUpVariant}>Built With Modern Technologies</motion.h2>
        <motion.div className="tech-grid" variants={staggerContainer}>
          {["React", "Vite", "Node.js", "Express.js", "SQLite", "JavaScript", "AI-powered assistance", "Responsive Web Design"].map((tech, idx) => (
            <motion.span key={idx} className="tech-badge" variants={fadeUpVariant}>{tech}</motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Core Values */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="about-section">
          <motion.h2 variants={fadeUpVariant}>Core Values</motion.h2>
        </div>
        <div className="values-grid">
          <motion.div className="value-card" variants={fadeUpVariant}>
            <h3>Trust</h3>
            <p>Building reliable and transparent healthcare experiences.</p>
          </motion.div>
          <motion.div className="value-card" variants={fadeUpVariant}>
            <h3>Accessibility</h3>
            <p>Making healthcare guidance available to everyone.</p>
          </motion.div>
          <motion.div className="value-card" variants={fadeUpVariant}>
            <h3>Innovation</h3>
            <p>Using AI responsibly to simplify healthcare decisions.</p>
          </motion.div>
          <motion.div className="value-card" variants={fadeUpVariant}>
            <h3>Empathy</h3>
            <p>Designing with compassion and understanding for every user.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="disclaimer-box" variants={fadeUpVariant}>
          <h3>Important Disclaimer</h3>
          <p>
            CareBridge AI provides educational information and AI-assisted guidance to help users better understand healthcare barriers and available resources. It is not a substitute for professional medical diagnosis, treatment, or emergency medical services. Users should consult qualified healthcare professionals for medical advice and urgent care.
          </p>
        </motion.div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="cta-banner">
          <motion.h3 variants={fadeUpVariant}>Take the First Step Toward Better Healthcare</motion.h3>
          <motion.div className="cta-actions" variants={fadeUpVariant} style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { window.scrollTo(0,0); setTab("quiz"); }}>
              Take the Barrier Assessment
            </button>
            <button className="btn btn-outline" onClick={() => { window.scrollTo(0,0); setTab("booking"); }}>
              Book a Consultation
            </button>
            <button className="btn btn-outline" onClick={() => { window.scrollTo(0,0); setTab("chat"); }}>
              Talk to CareBridge AI
            </button>
          </motion.div>
        </div>
      </motion.section>

    </motion.div>
  );
}
