import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Shield, Zap, RotateCcw, Timer, Droplets, Award, Thermometer, Star, Quote, Image as ImageIcon, CheckCircle2, Globe, Users, Leaf } from 'lucide-react';
import MagicRings from '../components/MagicRings';
import ProductImage from '../components/ProductImage';
import { useContent } from '../context/ContentContext';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Timer, Droplets, RotateCcw, Award, Shield, Zap, Thermometer, Globe, Users, Leaf,
};

const snowflakes = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.7 + 2) % 100}%`,
  delay: `${(i * 0.45) % 9}s`,
  duration: `${7 + (i % 5)}s`,
  size: `${2 + (i % 3)}px`,
}));

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.section-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Gradient accent colours per product index ─── */
const PRODUCT_ACCENTS = [
  { from: '#0d4a8a', to: '#0db2e8' },
  { from: '#0a4a60', to: '#06b6d4' },
  { from: '#0a4a3e', to: '#14b8a6' },
  { from: '#1a3a6a', to: '#2e7ce0' },
];

/* ─── Photo holder card for the home products section ─── */
function ProductPhotoCard({
  product,
  index,
}: {
  product: { name: string; desc: string; icon: string; tag: string; grad: string; sizes: string; image?: string };
  index: number;
}) {
  const accent = PRODUCT_ACCENTS[index % PRODUCT_ACCENTS.length];
  const hasImage = !!product.image;

  return (
    <div className="section-reveal light-card rounded-2xl overflow-hidden group flex flex-col"
      style={{ transitionDelay: `${index * 0.08}s` }}>

      {/* ── Photo / placeholder area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          /* Styled placeholder that clearly invites a photo */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 relative"
            style={{ background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)` }}
          >
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Animated gel pack icon */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-20 h-14 rounded-xl border-2 border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-xl"
                style={{ animation: 'gpCardPulse 2.5s ease-in-out infinite' }}>
                <div className="gp-card-grid" style={{ position: 'absolute', inset: 6, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gridTemplateRows: 'repeat(4,1fr)', gap: 2 }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="gp-card-cell rounded-[2px]" />
                  ))}
                </div>
                <span className="relative z-10 font-display font-black text-white/90 text-xs tracking-widest">DOVE</span>
              </div>
              <span className="text-2xl">{product.icon}</span>
            </div>

            {/* "Add photo" label */}
            <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
              <ImageIcon className="w-3.5 h-3.5 text-white/80" />
              <span className="text-white/80 text-xs font-semibold tracking-wide">Add Product Photo</span>
            </div>
          </div>
        )}

        {/* Tag badge — always shown */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/25 shadow">
          {product.tag}
        </span>
      </div>

      {/* ── Content area ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-[#0d2a5a] text-lg mb-1.5">{product.name}</h3>
        <p className="text-[#3d5a7a] text-sm leading-relaxed mb-3 flex-1">{product.desc}</p>
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-[#dae6f5]">
          <span className="text-[#1a56a0]/60 text-sm font-semibold uppercase tracking-wider">Sizes:</span>
          <span className="text-[#2a6aaa] text-sm">{product.sizes}</span>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const content = useContent();
  const { hero, stats, big_stats, services, home_applications, testimonials, home_products, about_snippets, about_page, site, home_sections, values, features, certifications } = content;

  const [loaded, setLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="light-page">
      {/* ─── HERO — stays dark blue ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#030c1e' }}>
        <div className="snow-container">
          {snowflakes.map((f) => (
            <div key={f.id} className="snowflake" style={{ left: f.left, width: f.size, height: f.size, animationDelay: f.delay, animationDuration: f.duration }} />
          ))}
        </div>
        <div className="absolute inset-0 z-0">
          <MagicRings color="#00d4ff" colorTwo="#0055aa" ringCount={8} attenuation={7} lineThickness={2.5} baseRadius={0.28} radiusStep={0.12} scaleRate={0.12} opacity={0.88} noiseAmount={0.05} ringGap={1.6} fadeIn={0.65} fadeOut={0.55} speed={0.85} followMouse mouseInfluence={0.18} hoverScale={1.12} parallax={0.05} clickBurst />
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(3,12,30,0.96) 0%, rgba(3,12,30,0.80) 38%, rgba(3,12,30,0.35) 62%, rgba(3,12,30,0.1) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-36 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #030c1e)' }} />

        {/* Product — right side of hero */}
        <div className={`absolute right-0 top-0 bottom-0 w-full lg:w-[50%] z-[2] flex items-center justify-center pointer-events-none transition-all duration-1200 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          style={{ isolation: 'isolate' }}>

          {/* Orbit ring + bubbles container */}
          <div className="relative" style={{ width: 'min(520px, 82vw)' }}>

            {/* Ambient glow — behind everything */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              <div className="hero-glow" />
            </div>

            {/* Orbiting blue bubbles — 12 dots on a circular path */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i / 12) * 360;
                const radius = 52; // % of container
                const delay = `${(i / 12) * 9}s`;
                const size = i % 3 === 0 ? 11 : i % 2 === 0 ? 7 : 5;
                return (
                  <span
                    key={i}
                    className="orbit-bubble"
                    style={{
                      ['--sz' as string]: `${size}px`,
                      ['--angle' as string]: `${angle}deg`,
                      ['--radius' as string]: `${radius}%`,
                      ['--delay' as string]: delay,
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>

            {/* Product with 3D half-rotation flip animation */}
            <div className="product-flip-wrap" style={{ position: 'relative', zIndex: 2 }}>
              <ProductImage className="w-full h-auto select-none block" />
            </div>

            {/* Ground shadow */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/5 h-8 blur-2xl rounded-full pointer-events-none"
              style={{ zIndex: 0, background: 'radial-gradient(ellipse, rgba(0,140,255,0.28), transparent 70%)' }}
            />
          </div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-300 text-xs font-semibold mb-6 border border-ice-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-ice-400 animate-pulse" />
              {hero.badge_text}
            </div>
            <h1 className="font-display text-5xl lg:text-[4.6rem] font-bold leading-[1.04] text-white mb-5">
              {hero.headline_line1}<br />
              <span className="gradient-text text-glow">{hero.headline_line2}</span><br />
              {hero.headline_line3}<br />
              <span className="gradient-text">{hero.headline_line4}</span>
            </h1>
            <p className="text-ice-100/70 text-lg leading-relaxed mb-7 max-w-lg"
              dangerouslySetInnerHTML={{ __html: hero.subheadline }} />

            <div className="flex gap-7 mb-7">
              {stats.map(({ icon, value, label, color }) => {
                const Icon = ICON_MAP[icon] || Shield;
                return (
                  <div key={label} className="text-center">
                    <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                    <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
                    <div className="text-ice-300/50 text-xs">{label}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link to="/products" className="glow-button inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ice-500 text-white font-bold text-sm shadow-lg shadow-ice-500/35 hover:bg-ice-400 transition-colors">
                {hero.btn_products_text} <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-green-500/18 border border-green-500/35 text-green-300 font-bold text-sm hover:bg-green-500/28 transition-colors">
                {hero.btn_whatsapp_text}
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {services.map(({ icon, text }) => {
                const Icon = ICON_MAP[icon] || Shield;
                return (
                  <span key={text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-ice-300 bg-ice-500/10 border border-ice-500/20">
                    <Icon className="w-3.5 h-3.5" /> {text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-ice-400/40 animate-bounce">
          <span className="text-xs font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── BIG STATS — light blue ─── */}
      <section className="py-12 border-y border-[#c5ddf5] light-section-blue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {big_stats.map((s, i) => (
              <div key={s.label} className="section-reveal text-center" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="font-display text-5xl lg:text-6xl font-bold gradient-text-dark mb-1.5">{s.value}</div>
                <div className="text-[#0d2a5a] font-semibold text-base">{s.label}</div>
                <div className="text-[#5a7a9a] text-sm mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHORT ABOUT — dark theme ─── */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #04101e 0%, #030c1e 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="section-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-sm font-semibold mb-5">{home_sections.about_badge}</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                {about_page.about_intro_title}<br /><span className="gradient-text">{about_page.about_intro_highlight}</span>
              </h2>
              <p className="text-ice-200/60 text-lg leading-relaxed mb-4">{about_page.about_intro_p1}</p>
              <p className="text-ice-200/45 text-lg leading-relaxed mb-6">{about_page.about_intro_p2}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="glow-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ice-500 text-white font-bold text-sm hover:bg-ice-400 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-ice-500/30 text-ice-300 font-bold text-sm hover:bg-ice-500/10 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="section-reveal">
              <div className="grid grid-cols-2 gap-4">
                {about_snippets.map(({ title, desc, icon }, i) => {
                  const Icon = ICON_MAP[icon] || Shield;
                  return (
                    <div key={title} className="glass-card rounded-2xl p-5" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-10 h-10 rounded-xl bg-ice-500/15 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-ice-400" />
                      </div>
                      <div className="text-white font-semibold text-base mb-1">{title}</div>
                      <div className="text-ice-200/50 text-sm leading-relaxed">{desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS SECTION — light blue ─── */}
      <section className="py-16 light-section-blue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 section-reveal">
            <div className="light-badge mb-4">{home_sections.products_badge}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold light-heading mb-3">
              {home_sections.products_title_line1} <span className="gradient-text-dark">{home_sections.products_title_line2}</span>
            </h2>
            <p className="light-body-text-soft text-lg max-w-2xl mx-auto">
              {home_sections.products_sub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {home_products.map((p, i) => (
              <ProductPhotoCard key={p.name} product={p} index={i} />
            ))}
          </div>

          <div className="text-center section-reveal">
            <Link to="/products"
              className="glow-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-ice-500 text-white font-bold text-sm shadow-lg shadow-ice-500/30 hover:bg-ice-400 transition-colors">
              {home_sections.products_btn} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── APPLICATIONS — dark theme ─── */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #030c1e 0%, #04101e 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 section-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-sm font-semibold mb-4">{home_sections.applications_badge}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
              {home_sections.applications_title_line1} <span className="gradient-text">{home_sections.applications_title_line2}</span>
            </h2>
            <p className="text-ice-200/50 text-lg max-w-2xl mx-auto">{home_sections.applications_sub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {home_applications.map((app, i) => (
              <div key={app.title} className="section-reveal glass-card rounded-2xl p-6 flex gap-4 items-start" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg mb-1">{app.title}</h3>
                  <p className="text-ice-200/50 text-sm leading-relaxed">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 section-reveal">
            <Link to="/applications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-ice-500/30 text-ice-300 font-bold text-sm hover:bg-ice-500/10 transition-colors">
              {home_sections.applications_btn} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS — light blue ─── */}
      <section className="py-10 relative overflow-hidden light-section-blue-deep">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(26,86,160,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 section-reveal">
            <div className="light-badge mb-4">{home_sections.testimonials_badge}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold light-heading">
              {home_sections.testimonials_title_line1} <span className="gradient-text-dark">{home_sections.testimonials_title_line2}</span>
            </h2>
          </div>

          <div className="section-reveal">
            <div className="light-card rounded-3xl p-8 lg:p-10 text-center relative overflow-hidden mb-6">
              <div className="absolute top-6 left-8 text-[#1a56a0]/15">
                <Quote className="w-16 h-16" />
              </div>
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[activeTestimonial]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[#3d5a7a] text-lg leading-relaxed max-w-2xl mx-auto mb-6 italic">
                "{testimonials[activeTestimonial]?.text}"
              </p>
              <div>
                <div className="font-display font-bold text-[#0d2a5a] text-lg">{testimonials[activeTestimonial]?.name}</div>
                <div className="text-[#1a56a0]/65 text-sm mt-0.5">{testimonials[activeTestimonial]?.role}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-8 bg-[#1a56a0]' : 'w-2 bg-[#1a56a0]/25 hover:bg-[#1a56a0]/45'}`} />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {testimonials.slice(0, 2).map((t, i) => (
              <div key={i} className="section-reveal light-card rounded-2xl p-5" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[#5a7a9a] text-sm leading-relaxed mb-3 italic line-clamp-3">"{t.text}"</p>
                <div className="text-[#0d2a5a] font-semibold text-sm">{t.name}</div>
                <div className="text-[#1a56a0]/55 text-sm">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUES — light blue ─── */}
      <section className="py-10 light-section-blue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 section-reveal">
            <div className="light-badge mb-4">{about_page.values_badge}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold light-heading mb-3">
              {about_page.values_title.split('Us Forward')[0]}<span className="gradient-text-dark">Us Forward</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = ICON_MAP[v.icon] || Shield;
              return (
                <div key={v.title} className="section-reveal light-card rounded-2xl p-6 group" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-[#0d2a5a] text-base mb-2">{v.title}</h3>
                  <p className="text-[#5a7a9a] text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES — dark theme ─── */}
      <section className="py-16" style={{ background: '#030c1e' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 section-reveal">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
              {about_page.features_title.split('Standards')[0]}<span className="gradient-text">Standards</span>
            </h2>
            <p className="text-ice-200/60 text-lg max-w-2xl mx-auto">{about_page.features_sub}</p>
          </div>
          <div className="section-reveal">
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={f.id || i} className="flex items-start gap-3 glass-card rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-ice-400 mt-0.5 flex-shrink-0" />
                  <span className="text-ice-200/70 text-sm leading-relaxed">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS — light blue ─── */}
      <section className="py-14 light-section-blue">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 section-reveal">
            {certifications.map((cert) => (
              <div key={cert.name} className="light-card rounded-2xl py-5 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#e8f2fc] border border-[#c5ddf5] flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <div className="text-[#0d2a5a] font-semibold text-sm">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA — white ─── */}
      <section className="py-16 relative overflow-hidden light-section-white">
        <div className="max-w-4xl mx-auto px-6 text-center section-reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-bold light-heading mb-4">
            {hero.cta_headline.split(hero.cta_title_highlight)[0]}<span className="gradient-text-dark">{hero.cta_title_highlight}</span>
          </h2>
          <p className="light-body-text-soft text-lg mb-8 max-w-2xl mx-auto">{hero.cta_sub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer"
              className="glow-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors">
              {hero.cta_btn_whatsapp} <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/contact"
              className="light-btn-outline">
              {hero.cta_btn_quote}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
