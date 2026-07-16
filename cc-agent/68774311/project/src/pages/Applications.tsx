import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

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

export function Applications() {
  const { applications } = useContent();
  useReveal();

  return (
    <div style={{ background: '#030c1e', minHeight: '100vh' }}>
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(13,178,232,0.09) 0%, transparent 65%), linear-gradient(135deg, #030c1e 0%, #071528 60%, #0a1d38 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(56,201,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,201,247,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-3xl mx-auto px-6 text-center section-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-5">Applications</div>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Trusted Across<br /><span className="gradient-text">Every Industry</span>
          </h1>
          <p className="text-ice-200/65 text-lg leading-relaxed">
            From hospital wards to home delivery — Dove Gel Packs ensure the cold chain stays intact wherever your products travel.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {applications.map((app, i) => (
            <div key={app.id || app.title} className="section-reveal card-hover glass-card rounded-2xl overflow-hidden group" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="relative h-52 overflow-hidden">
                <img src={app.img} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/92 via-navy-900/20 to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-ice-500/90 text-white text-xs font-bold">{app.tag}</span>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-white text-lg mb-2">{app.title}</h3>
                <p className="text-ice-200/60 text-sm leading-relaxed mb-4">{app.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.details.map((d: string) => (
                    <span key={d} className="px-2.5 py-1 rounded-full bg-ice-500/10 border border-ice-500/18 text-ice-300/75 text-xs">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center section-reveal">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Don't See Your Industry?</h2>
        <p className="text-ice-200/55 mb-8 max-w-md mx-auto text-sm">Our gel packs work wherever temperature control matters. Get in touch for a custom solution.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="glow-button inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ice-500 text-white font-bold text-sm shadow-lg shadow-ice-500/30 hover:bg-ice-400 transition-colors">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-ice-500/20 text-ice-200 font-semibold text-sm hover:text-white transition-colors">
            View Products
          </Link>
        </div>
      </section>
    </div>
  );
}
