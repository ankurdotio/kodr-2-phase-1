import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import api from "../api/client"



export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search+sort+page fetch
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      (async () => {
        try {
          setLoading(true);
          setError('');
          const params = new URLSearchParams({
            page: String(page),
            limit: '12',
            sort,
          });
          if (query.trim()) params.append('search', query.trim());
          const url = `/api/products?${params.toString()}`;
          const res = await api.get(url, { signal: controller.signal });
          setProducts(res.data.products || []);
          setTotalPages(res.data.totalPages || 1);
        } catch (err) {
          if (err?.name === 'CanceledError') return;
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      })();
    }, 300); // debounce 300ms
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, sort, page]);

  // Reset page when query or sort changes
  useEffect(() => { setPage(1); }, [query, sort]);
  
  
  const filtered = products; // server already filtered/sorted

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
        <div style={{fontSize:'.65rem', color:'var(--color-text-soft)'}} aria-live="polite">
          {loading ? 'Loading…' : `${filtered.length} products`}
        </div>
      </div>
      {error && (
        <div className="empty" role="alert">
          <strong>Error</strong>
          {error}
        </div>
      )}
      {!error && !loading && products.length === 0 && (
        <div className="empty" role="status">
          <strong>No products</strong>
          Try adjusting your search or filters.
        </div>
      )}
      <div className="products-grid" role="list" aria-label="Products" aria-busy={loading}>
        {products.map(p => {
          const cover = p.images?.[0];
          const priceFmt = new Intl.NumberFormat('en-IN',{style:'currency', currency:p.price.currency}).format(p.price.amount/100);
          const low = p.stock < 5;
          return (
            <article
              key={p._id}
              className="p-card"
              role="listitem"
              aria-label={p.title}
              tabIndex={0}
              onClick={() => navigate(`/product/${p._id}`)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/product/${p._id}`); } }}
              style={{cursor:'pointer'}}
            >
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
        {loading && products.length === 0 && (
          <div className="empty" role="status" style={{gridColumn:'1/-1'}}>
            Loading products…
          </div>
        )}
      </div>
      {!error && totalPages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} aria-label="Previous page">Prev</button>
          <span style={{fontSize:'.7rem'}}>Page {page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} aria-label="Next page">Next</button>
        </nav>
      )}
    </div>
  );
}
