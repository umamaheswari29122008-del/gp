import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Shield, Zap, RotateCcw, Timer, Droplets, Award, Thermometer, Star, Quote, Image as ImageIcon } from 'lucide-react';
import MagicRings from '../components/MagicRings';
import { useContent } from '../context/ContentContext';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Timer, Droplets, RotateCcw, Award, Shield, Zap, Thermometer,
};

function GelPackAnimation() {
  return (
    <div className="gel-pack-wrapper">
      <div className="gel-pack-body">
        <div className="gp-grommet top-[10px] left-[10px]" />
        <div className="gp-grommet top-[10px] right-[10px]" />
        <div className="gp-grommet bottom-[10px] left-[10px]" />
        <div className="gp-grommet bottom-[10px] right-[10px]" />
        <div className="gp-border-outer" />
        <div className="gp-border-mid" />
        <div className="gp-border-inner" />
        <div className="gp-grid">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="gp-cell" style={{ animationDelay: `${(i * 0.15) % 3}s` }} />
          ))}
        </div>
        <div className="gp-label">
          <span className="gp-brand">DOVE</span>
          <span className="gp-sublabel">ICE GEL PACK</span>
        </div>
        <div className="gp-shimmer" />
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="gp-frost" style={{ left: `${10 + (i * 7) % 80}%`, animationDelay: `${(i * 0.4) % 4}s`, animationDuration: `${2.5 + (i % 3) * 0.8}s` }} />
        ))}
      </div>
      <div className="gp-shadow" />
    </div>
  );
}

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
    <div className="section-reveal card-hover glass-card rounded-2xl overflow-hidden group flex flex-col"
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
        <h3 className="font-display font-bold text-white text-base mb-1.5">{product.name}</h3>
        <p className="text-ice-200/60 text-sm leading-relaxed mb-3 flex-1">{product.desc}</p>
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-ice-500/10">
          <span className="text-ice-400/60 text-xs font-semibold uppercase tracking-wider">Sizes:</span>
          <span className="text-ice-300/80 text-xs">{product.sizes}</span>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const content = useContent();
  const { hero, stats, big_stats, services, home_applications, testimonials, home_products, about_snippets, about_page, site } = content;

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
    <div>
      {/* ─── HERO ─── */}
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

        <div className={`relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
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

            <div className="hidden lg:flex items-center justify-center">
              <GelPackAnimation />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-ice-400/40 animate-bounce">
          <span className="text-xs font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── BIG STATS ─── */}
      <section className="py-16 border-y border-ice-500/8"
        style={{ background: 'linear-gradient(135deg, #071528 0%, #0c2540 50%, #071528 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {big_stats.map((s, i) => (
              <div key={s.label} className="section-reveal text-center" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="font-display text-4xl lg:text-5xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-white font-semibold text-sm">{s.label}</div>
                <div className="text-ice-400/50 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHORT ABOUT ─── */}
      <section className="py-24" style={{ background: '#030c1e' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="section-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-5">About Dove Gel Packs</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                {about_page.about_intro_title}<br /><span className="gradient-text">{about_page.about_intro_highlight}</span>
              </h2>
              <p className="text-ice-200/65 text-base leading-relaxed mb-4">{about_page.about_intro_p1}</p>
              <p className="text-ice-200/55 text-base leading-relaxed mb-6">{about_page.about_intro_p2}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="glow-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ice-500 text-white font-bold text-sm hover:bg-ice-400 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card border border-ice-500/20 text-ice-200 font-semibold text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="section-reveal">
              <div className="grid grid-cols-2 gap-4">
                {about_snippets.map(({ title, desc, icon }, i) => {
                  const Icon = ICON_MAP[icon] || Shield;
                  return (
                    <div key={title} className="glass-card rounded-2xl p-4 hover:border-ice-500/30 transition-colors" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-9 h-9 rounded-xl bg-ice-500/15 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-ice-400" />
                      </div>
                      <div className="text-white font-semibold text-sm mb-1">{title}</div>
                      <div className="text-ice-200/55 text-xs leading-relaxed">{desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS SECTION ─── */}
      <section className="py-24" style={{ background: '#030c1e' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 section-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-4">Our Products</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
              The Right Pack for <span className="gradient-text">Every Need</span>
            </h2>
            <p className="text-ice-200/55 text-base max-w-xl mx-auto">
              4 product lines covering every cold-chain application — from small pouches to industrial insulated boxes.
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
              View Full Product Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── APPLICATIONS ─── */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #04101e 0%, #071528 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 section-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-4">Applications</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
              Trusted Across <span className="gradient-text">Every Industry</span>
            </h2>
            <p className="text-ice-200/55 text-base max-w-xl mx-auto">From hospital wards to home delivery — Dove keeps the cold chain intact.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {home_applications.map((app, i) => (
              <div key={app.title} className="section-reveal card-hover glass-card rounded-2xl p-6 flex gap-4 items-start" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <h3 className="font-display font-semibold text-white text-base mb-1">{app.title}</h3>
                  <p className="text-ice-200/55 text-sm leading-relaxed">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 section-reveal">
            <Link to="/applications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card border border-ice-500/20 text-ice-300 font-semibold text-sm hover:text-white hover:border-ice-500/40 transition-colors">
              See All Applications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a2040 0%, #0c3560 50%, #0a2c52 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(200,240,255,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 section-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-4">Testimonials</div>
            <h2 className="font-display text-4xl font-bold text-white">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
          </div>

          <div className="section-reveal">
            <div className="glass-card rounded-3xl p-8 lg:p-10 text-center relative overflow-hidden mb-6">
              <div className="absolute top-6 left-8 text-ice-500/20">
                <Quote className="w-16 h-16" />
              </div>
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[activeTestimonial]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-ice-100/80 text-lg leading-relaxed max-w-2xl mx-auto mb-6 italic">
                "{testimonials[activeTestimonial]?.text}"
              </p>
              <div>
                <div className="font-display font-bold text-white text-base">{testimonials[activeTestimonial]?.name}</div>
                <div className="text-ice-400/65 text-sm mt-0.5">{testimonials[activeTestimonial]?.role}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-8 bg-ice-400' : 'w-2 bg-ice-500/30 hover:bg-ice-500/50'}`} />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {testimonials.slice(0, 2).map((t, i) => (
              <div key={i} className="section-reveal glass-card rounded-2xl p-5" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-ice-200/65 text-sm leading-relaxed mb-3 italic line-clamp-3">"{t.text}"</p>
                <div className="text-white font-semibold text-xs">{t.name}</div>
                <div className="text-ice-400/55 text-xs">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071528 0%, #0a2040 100%)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center section-reveal">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            {hero.cta_headline.split('Perfectly Cold?')[0]}<span className="gradient-text">Perfectly Cold?</span>
          </h2>
          <p className="text-ice-200/60 text-lg mb-8 max-w-xl mx-auto">{hero.cta_sub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer"
              className="glow-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors">
              {hero.cta_btn_whatsapp} <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card border border-ice-500/20 text-ice-200 font-semibold text-sm hover:text-white transition-colors">
              {hero.cta_btn_quote}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
