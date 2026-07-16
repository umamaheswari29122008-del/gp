import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

function ProductCard({ variant, accentFrom, accentTo }: { variant: { name: string; image?: string }; accentFrom: string; accentTo: string }) {
  return (
    <div className="product-card group cursor-pointer">
      <div className="product-card-img-wrap">
        {variant.image ? (
          <img src={variant.image} alt={variant.name} className="product-card-img" />
        ) : (
          <div className="product-card-placeholder">
            <div className="gp-card-pack" style={{ '--c1': accentFrom, '--c2': accentTo } as React.CSSProperties}>
              <div className="gp-card-grid">
                {Array.from({ length: 20 }).map((_, i) => <div key={i} className="gp-card-cell" />)}
              </div>
              <div className="gp-card-label">DOVE</div>
              <div className="gp-card-shimmer" />
            </div>
            <span className="product-card-add-label">Add Image</span>
          </div>
        )}
      </div>
      <div className="product-card-caption">{variant.name}</div>
    </div>
  );
}

function CategorySection({ cat, whatsapp }: { cat: ReturnType<typeof useContent>['product_categories'][0]; whatsapp: string }) {
  return (
    <div className="cat-section">
      <div className="cat-header">
        <div className="cat-accent-line" style={{ background: `linear-gradient(90deg, ${cat.accent_from}, ${cat.accent_to})` }} />
        <h2 className="cat-title">{cat.title}</h2>
        <p className="cat-description">{cat.description}</p>
        <div className="cat-specs">
          {cat.specs.map((s) => (
            <span key={s} className="cat-spec-pill" style={{ borderColor: `${cat.accent_from}40`, color: cat.accent_from }}>{s}</span>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {cat.variants.map((v) => (
          <ProductCard key={v.name} variant={v} accentFrom={cat.accent_from} accentTo={cat.accent_to} />
        ))}
      </div>
      <div className="cat-cta-row">
        <a href={`${whatsapp}?text=I'm interested in ${encodeURIComponent(cat.title)}`} target="_blank" rel="noopener noreferrer" className="cat-cta-wa">
          <MessageCircle className="w-4 h-4" /> Order via WhatsApp
        </a>
        <Link to="/contact" className="cat-cta-quote">Get Bulk Quote <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.section-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function Products() {
  const content = useContent();
  const { product_categories, site } = content;
  const [active, setActive] = useState(product_categories[0]?.id || 'pouches');
  useReveal();

  const activeCat = product_categories.find((c) => c.id === active) || product_categories[0];

  return (
    <div className="products-page">
      <section className="products-hero section-reveal">
        <div className="products-hero-grid-bg" />
        <div className="products-hero-inner">
          <div className="products-hero-tag">Product Catalog</div>
          <h1 className="products-hero-title">Premium Cold Chain<br /><span className="gradient-text">Solutions</span></h1>
          <p className="products-hero-sub">4 product lines engineered for every cold-chain application — made in India, trusted worldwide.</p>
        </div>
      </section>

      <div className="cat-tabs-bar">
        <div className="cat-tabs-inner">
          {product_categories.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`cat-tab ${active === c.id ? 'cat-tab--active' : ''}`}>
              {c.label}{active === c.id && <ChevronRight className="w-3.5 h-3.5 rotate-90" />}
            </button>
          ))}
        </div>
      </div>

      <section className="products-content section-reveal">
        {activeCat && <CategorySection key={activeCat.id} cat={activeCat} whatsapp={site.whatsapp_number} />}
      </section>

      <section className="all-cats-strip section-reveal">
        <div className="all-cats-inner">
          <div className="all-cats-title">All Product Categories</div>
          <div className="all-cats-grid">
            {product_categories.map((c) => (
              <button key={c.id} onClick={() => { setActive(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`all-cat-card ${active === c.id ? 'all-cat-card--active' : ''}`}
                style={{ '--accent': c.accent_from } as React.CSSProperties}>
                <div className="all-cat-dot" style={{ background: `linear-gradient(135deg, ${c.accent_from}, ${c.accent_to})` }} />
                <div className="all-cat-label">{c.label}</div>
                <div className="all-cat-count">{c.variants.length} variant{c.variants.length > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
