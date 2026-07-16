import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Shield, Zap, RotateCcw, Globe, Award, Users, Leaf } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Zap, RotateCcw, Globe, Award, Users, Leaf,
};

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.section-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function About() {
  const { about_page, about_stats, milestones, values, features, certifications } = useContent();
  useReveal();

  return (
    <div style={{ background: '#030c1e', minHeight: '100vh' }}>
      {/* HERO */}
      <section className="relative pt-36 pb-28 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(13,178,232,0.09) 0%, transparent 65%), linear-gradient(135deg, #030c1e 0%, #071528 60%, #0a1d38 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(56,201,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,201,247,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center section-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-5">{about_page.hero_badge}</div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {about_page.hero_title_line1}<br />
            <span className="gradient-text">{about_page.hero_title_line2}</span>{' '}
            {about_page.hero_title_line3}
          </h1>
          <p className="text-ice-100/68 text-xl leading-relaxed max-w-2xl mx-auto mb-8">{about_page.hero_sub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="glow-button inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ice-500 text-white font-bold text-sm shadow-lg shadow-ice-500/30 hover:bg-ice-400 transition-colors">
              {about_page.btn_products} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-ice-500/20 text-ice-200 font-semibold text-sm hover:text-white transition-colors">
              {about_page.btn_contact}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS — white background */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {about_stats.map(({ value, label, icon }, i) => {
              const Icon = ICON_MAP[icon] || Shield;
              return (
                <div key={label} className="section-reveal text-center group" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e8f2fc] border border-[#c5ddf5] mb-4 group-hover:bg-[#d8e8f5] transition-colors mx-auto">
                    <Icon className="w-7 h-7 text-[#1a56a0]" />
                  </div>
                  <div className="font-display text-4xl font-bold gradient-text-dark mb-1">{value}</div>
                  <div className="text-[#0d2a5a] font-semibold text-sm">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-28" style={{ background: '#030c1e' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 section-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-4">{about_page.story_badge}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
              {about_page.story_title.split('Innovation')[0]}<span className="gradient-text">Innovation</span>
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ice-500/50 via-ice-500/30 to-transparent" />
            {milestones.map((m, i) => (
              <div key={m.year} className={`section-reveal relative flex gap-8 mb-10 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-2 w-4 h-4 rounded-full bg-ice-500 border-2 border-ice-300/40 shadow-lg shadow-ice-500/40 z-10" />
                <div className="hidden lg:block w-1/2 flex-shrink-0" />
                <div className={`ml-10 lg:ml-0 lg:w-1/2 glass-card rounded-2xl p-5 ${i % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <div className="inline-block px-3 py-1 rounded-full bg-ice-500/15 border border-ice-500/25 text-ice-400 text-xs font-bold mb-2">{m.year}</div>
                  <h3 className="font-display font-semibold text-white text-base mb-1">{m.title}</h3>
                  <p className="text-ice-200/60 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES — white background */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 section-reveal">
            <div className="light-badge mb-4">{about_page.values_badge}</div>
            <h2 className="font-display text-4xl font-bold text-[#0d2a5a] mb-3">
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

      {/* FEATURES LIST */}
      <section className="py-16" style={{ background: '#030c1e' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 section-reveal">
            <h2 className="font-display text-4xl font-bold text-white mb-3">
              {about_page.features_title.split('Standards')[0]}<span className="gradient-text">Standards</span>
            </h2>
            <p className="text-ice-200/60 text-base max-w-xl mx-auto">{about_page.features_sub}</p>
          </div>
          <div className="section-reveal">
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={f.id || i} className="flex items-start gap-3 glass-card rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-ice-400 mt-0.5 flex-shrink-0" />
                  <span className="text-ice-200/70 text-sm leading-relaxed">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS — white background */}
      <section className="py-16" style={{ background: '#ffffff' }}>
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

      {/* CTA */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #071528 0%, #0a2040 100%)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center section-reveal">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            {about_page.cta_headline.split('Dove Gel Packs')[0]}<span className="gradient-text">Dove Gel Packs</span>
          </h2>
          <p className="text-ice-200/60 text-lg mb-8">{about_page.cta_sub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="glow-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-ice-500 text-white font-bold text-sm shadow-lg shadow-ice-500/30 hover:bg-ice-400 transition-colors">
              {about_page.cta_btn_contact} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card border border-ice-500/20 text-ice-200 font-semibold text-sm hover:text-white transition-colors">
              {about_page.cta_btn_products}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
