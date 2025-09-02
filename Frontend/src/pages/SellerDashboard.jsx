import { useMemo, useState, useEffect } from 'react';
import './SellerDashboard.css';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!user?.role || user.role !== 'seller') return;
      try {
        setLoading(true); setError('');
        const res = await api.get('/api/products/seller');
        if (!cancel) setProducts(res.data.products || []);
      } catch (e) {
        if (cancel) return;
        const status = e?.response?.status;
        if (status === 401) setError('Please login as seller to view dashboard.');
        else if (status === 403) setError('Access denied. Seller role required.');
        else setError('Failed to load seller products');
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    load();
    return () => { cancel = true; };
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }, [products, query]);

  const totalStock = filtered.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalProducts = filtered.length;
  const lowStockCount = filtered.filter(p => p.stock !== undefined && p.stock < 5).length;

  if (authLoading) {
    return <div className="dashboard-shell role-seller"><p>Checking authentication…</p></div>;
  }
  if (!user || user.role !== 'seller') {
    return <div className="dashboard-shell role-seller"><p>Seller access required.</p></div>;
  }

  return (
    <div className="dashboard-shell role-seller" aria-labelledby="dash-title">
      <header className="dash-header">
        <h1 id="dash-title" className="dash-title">Seller Dashboard</h1>
        <p className="dash-sub">Overview of your products & stock status.</p>
      </header>

    <section className="cards-grid" aria-label="Metrics">
        <div className="metric-card">
          <span className="metric-label">Products</span>
      <span className="metric-value" aria-live="polite">{loading ? '…' : totalProducts}</span>
          <span className="metric-foot">Total active products</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Stock Units</span>
      <span className="metric-value" aria-live="polite">{loading ? '…' : totalStock}</span>
          <span className="metric-foot">Combined available stock</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Low Stock</span>
      <span className="metric-value" aria-live="polite">{loading ? '…' : lowStockCount}</span>
          <span className="metric-foot">Below threshold (&lt;5)</span>
        </div>
      </section>

      <section className="products-section" aria-labelledby="products-heading">
        <div className="section-head">
          <h2 id="products-heading">Products</h2>
          <div className="filters-bar">
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="empty-state" role="alert">
            <strong>Error</strong>
            {error}
          </div>
        )}
        {!error && !loading && filtered.length === 0 && (
          <div className="empty-state" role="status">
            <strong>No products found</strong>
            Try adjusting your search.
          </div>
        )}
        <div className="products-grid" role="list" aria-busy={loading}>
          {filtered.map(p => {
            const cover = p.images?.[0];
            const priceFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: p.price.currency }).format(p.price.amount / 100);
            const low = p.stock < 5;
            return (
              <article key={p._id} className="product-card" role="listitem" aria-label={p.title}>
                {cover ? (
                  <img src={cover} alt={p.title} className="product-thumb" loading="lazy" />
                ) : (
                  <div className="product-thumb" aria-hidden="true" />
                )}
                <div className="product-body">
                  <h3 className="product-title" title={p.title}>{p.title}</h3>
                  <p className="product-desc" title={p.description}>{p.description}</p>
                  <div className="price-stock">
                    <span className="price">{priceFmt}</span>
                    <span className={`stock ${low ? 'low' : ''}`}>{p.stock} in stock</span>
                  </div>
                </div>
              </article>
            );
          })}
          {loading && products.length === 0 && (
            <div className="empty-state" role="status" style={{gridColumn:'1/-1'}}>
              Loading products…
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
