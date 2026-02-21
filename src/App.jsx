import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, CheckCircle, ChevronRight, Layout, Zap, Search, PlusCircle, User, Compass, MessageCircle, Share2, Copy, Calendar, MapPin } from 'lucide-react';
import { translations } from './translations';
import './App.css';

function App() {
    const [lang, setLang] = useState('kk');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [scopied, setScopied] = useState(false);
    const t = translations[lang];

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOYIGnToi_5hQpzOX_8EWfbVjrzPptShJK2-1B8xN1Qavcw_aq0H9ypaftWTp3hbX1/exec";

    const handleShare = async () => {
        const shareData = {
            title: 'Lupa KZ',
            text: t.heroSubtitle,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            setScopied(true);
            setTimeout(() => setScopied(false), 2000);
        }
    };

    const handleLangChange = (newLang) => {
        setLang(newLang);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            // Using a simple fetch for Google Apps Script Web App
            // Note: In a real scenario, you'd handle CORS or use a service like Sheet.best
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Essential for Google Scripts regular web apps
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    date: new Date().toLocaleString(),
                    language: lang
                }),
            });

            setStatus('success');
        } catch (error) {
            console.error("Submission error:", error);
            // Since mode is 'no-cors', we might not see the error clearly, 
            // but we'll assume success if the request finishes without crashing
            setStatus('success');
        }
    };

    return (
        <div className="landing-container">
            {/* Background blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            {/* Navigation */}
            <nav className="navbar glass-morphism">
                <div className="logo">
                    <Search size={24} className="logo-icon" />
                    <span>Lupa</span>
                </div>
                <div className="nav-actions">
                    <button onClick={handleShare} className="share-btn glass-morphism">
                        {scopied ? <CheckCircle size={18} /> : <Share2 size={18} />}
                        <span>{scopied ? 'Copied!' : t.shareLink}</span>
                    </button>
                    <div className="lang-switcher">
                        <Globe size={18} />
                        <button onClick={() => handleLangChange('kk')} className={lang === 'kk' ? 'active' : ''}>KK</button>
                        <button onClick={() => handleLangChange('en')} className={lang === 'en' ? 'active' : ''}>EN</button>
                        <button onClick={() => handleLangChange('ru')} className={lang === 'ru' ? 'active' : ''}>RU</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <h1 className="gradient-text">{t.heroTitle}</h1>
                    <p>{t.heroSubtitle}</p>

                    {status !== 'success' ? (
                        <form onSubmit={handleSubmit} className="wishlist-form glass-morphism">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder={t.emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === 'loading'}
                            />
                            <button type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? '...' : t.joinWishlist} <ChevronRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="success-message"
                        >
                            <CheckCircle size={24} color="#0ea5e9" />
                            <span>{t.wishlistSuccess}</span>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="app-mockup-container"
                >
                    <div className="phone-frame glass-morphism">
                        <div className="phone-screen">
                            <MockupApp lang={lang} />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>{t.featuresTitle}</h2>
                <div className="features-grid">
                    <FeatureCard
                        icon={<Search size={32} />}
                        title={t.feature1Title}
                        desc={t.feature1Desc}
                    />
                    <FeatureCard
                        icon={<Layout size={32} />}
                        title={t.feature2Title}
                        desc={t.feature2Desc}
                    />
                    <FeatureCard
                        icon={<Zap size={32} />}
                        title={t.feature3Title}
                        desc={t.feature3Desc}
                    />
                </div>
            </section>

            <footer className="footer">
                <p>{t.footerLink}</p>
            </footer>
        </div>
    );
}

function MockupApp({ lang }) {
    const mockupCategories = {
        en: ["All", "Tech", "Nature", "Music", "Art"],
        ru: ["Все", "Тех", "Природа", "Музыка", "Арт"],
        kk: ["Барлығы", "Тех", "Табиғат", "Музыка", "Өнер"]
    };

    const mockupEvents = {
        en: [
            { title: "Female Founders Breakfast", category: "Business", location: "Almaty, Ritz-Carlton", time: "10:00", price: "7000 ₸", image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=400&q=80" },
            { title: "Medeo Night Hike", category: "Nature", location: "Almaty", time: "20:00", price: "Free", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
            { title: "Shymbulak Ski Session", category: "Sport", location: "Almaty", time: "11:00", price: "5000 ₸", image: "https://images.unsplash.com/photo-1605540436561-5b52167bc11e?w=400&q=80" },
            { title: "Underground Rave", category: "Music", location: "Almaty", time: "23:00", price: "3000 ₸", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" }
        ],
        ru: [
            { title: "Завтрак для предпринимательниц", category: "Бизнес", location: "Алматы, Ritz-Carlton", time: "10:00", price: "7000 ₸", image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=400&q=80" },
            { title: "Ночной поход Медеу", category: "Природа", location: "Алматы", time: "20:00", price: "Бесплатно", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
            { title: "Шымбулак: Лыжи", category: "Спорт", location: "Алматы", time: "11:00", price: "5000 ₸", image: "https://images.unsplash.com/photo-1605540436561-5b52167bc11e?w=400&q=80" },
            { title: "Underground Rave", category: "Музыка", location: "Алматы", time: "23:00", price: "3000 ₸", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" }
        ],
        kk: [
            { title: "Кәсіпкер әйелдермен таңғы ас", category: "Бизнес", location: "Алматы, Ritz-Carlton", time: "10:00", price: "7000 ₸", image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=400&q=80" },
            { title: "Медеу түнгі жорық", category: "Табиғат", location: "Алматы", time: "20:00", price: "Тегін", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
            { title: "Шымбұлақ: Шаңғы тебу", category: "Спорт", location: "Алматы", time: "11:00", price: "5000 ₸", image: "https://images.unsplash.com/photo-1605540436561-5b52167bc11e?w=400&q=80" },
            { title: "Underground Rave", category: "Музыка", location: "Almaty", time: "23:00", price: "3000 ₸", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" }
        ]
    };

    const events = mockupEvents[lang];
    const categories = mockupCategories[lang];

    return (
        <div className="mockup-app">
            <div className="coming-soon-badge">Beta</div>
            <header className="mockup-header">
                <div className="mockup-logo">
                    <Search size={14} className="logo-icon" />
                    <span>Lupa</span>
                </div>
                <div className="search-pill">Search...</div>
            </header>
            <main className="mockup-main">
                <div className="mockup-categories">
                    {categories.map((cat, i) => (
                        <span key={i} className={`mockup-chip ${i === 0 ? 'active' : ''}`}>{cat}</span>
                    ))}
                </div>
                <div className="mockup-section-title">Discovery</div>
                <div className="mockup-scroll-container">
                    {events.map((ev, i) => (
                        <div key={i} className="mockup-card-row">
                            <div className="mockup-row-img-wrapper">
                                <img
                                    src={ev.image}
                                    alt=""
                                    className="mockup-row-img"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <div className="mockup-img-shimmer"></div>
                            </div>
                            <div className="mockup-row-info">
                                <h4>{ev.title}</h4>
                                <div className="mockup-row-meta">
                                    <div className="meta-item"><Calendar size={10} /> <span>{ev.time}</span></div>
                                    <div className="meta-item"><MapPin size={10} /> <span>{ev.location}</span></div>
                                </div>
                                <div className="mockup-price-tag">{ev.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <nav className="mockup-nav">
                <Compass size={18} />
                <PlusCircle size={18} />
                <MessageCircle size={18} />
                <User size={18} />
            </nav>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="feature-card glass-morphism"
        >
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </motion.div>
    );
}

export default App;
