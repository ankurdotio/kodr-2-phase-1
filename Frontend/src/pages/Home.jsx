import { useMemo, useState } from 'react';
import './Home.css';

// UI only: sample products similar shape to seller endpoint
const sampleProducts = [
  {
    _id: 'p1',
    title: 'test_product',
    description: 'test_description',
    price: { amount: 999, currency: 'INR' },
    images: ['https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/faac7bd7-de98-41c6-81ee-1662f17e7ac5_p8DgQjfuxw'],
    stock: 20
  },
  {
    _id: 'p2',
    title: 'Minimal Backpack',
    description: 'Durable & water resistant everyday carry.',
    price: { amount: 4599, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1514474959185-1472d4d4b221?auto=format&fit=crop&w=600&q=60'],
    stock: 4
  },
  {
    _id: 'p3',
    title: 'Ceramic Mug',
    description: 'Hand glazed stoneware mug 350ml.',
    price: { amount: 1299, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1556909114-6d2a7926f397?auto=format&fit=crop&w=600&q=60'],
    stock: 0
  },
  {
    _id: 'p4',
    title: 'Wireless Earbuds',
    description: 'Noise isolating Bluetooth 5.3 earbuds.',
    price: { amount: 8999, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1585386959984-a4155222cd05?auto=format&fit=crop&w=600&q=60'],
    stock: 37
  }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = sampleProducts.filter(p => !q || p.title.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
    switch (sort) {
      case 'price-asc': list = [...list].sort((a,b)=>a.price.amount - b.price.amount); break;
      case 'price-desc': list = [...list].sort((a,b)=>b.price.amount - a.price.amount); break;
      case 'stock': list = [...list].sort((a,b)=>b.stock - a.stock); break;
      default: break; // newest placeholder
    }
    return list;
  }, [query, sort]);

  return (
    <div className="home-shell" aria-labelledby="home-heading">
      <section className="home-hero">
        <h1 id="home-heading" className="home-title">Discover products</h1>
        <p className="home-sub">Browse a curated selection of items. This UI uses sample data only – integrate your API later to power real listings.</p>
      </section>

      <div className="products-toolbar">
        <div className="filters" role="search">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={query}
            onChange={e=>setQuery(e.target.value)}
          />
          <select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div style={{fontSize:'.65rem', color:'var(--color-text-soft)'}} aria-live="polite">{filtered.length} products</div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty" role="status">
          <strong>No products</strong>
          Try adjusting your search or filters.
        </div>
      ) : (
        <div className="products-grid" role="list" aria-label="Products">
          {filtered.map(p => {
            const cover = p.images?.[0];
            const priceFmt = new Intl.NumberFormat('en-IN',{style:'currency', currency:p.price.currency}).format(p.price.amount/100);
            const low = p.stock < 5;
            return (
              <article key={p._id} className="p-card" role="listitem" aria-label={p.title}>
                {cover ? <img src={cover} alt={p.title} className="p-thumb" loading="lazy" /> : <div className="p-thumb" aria-hidden="true" />}
                <div className="p-body">
                  <h3 className="p-title" title={p.title}>{p.title}</h3>
                  <p className="p-desc" title={p.description}>{p.description}</p>
                  <div className="p-price-row">
                    <span className="p-price">{priceFmt}</span>
                    <span className={`p-stock ${low ? 'low' : ''}`}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
