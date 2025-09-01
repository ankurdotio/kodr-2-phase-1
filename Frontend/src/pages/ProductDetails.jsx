import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import './ProductDetails.css';

// UI only: sample product lookup; replace with API fetch later.
const sampleProducts = [
  {
    _id: 'p1',
    title: 'test_product',
    description: 'test_description',
    price: { amount: 999, currency: 'INR' },
    images: [
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/faac7bd7-de98-41c6-81ee-1662f17e7ac5_p8DgQjfuxw',
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/e22e71f1-7299-497a-8d4d-6d79c6372bb2_EVDvZvd55C',
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/fbcc73d9-818f-4f6e-8734-c73440c17020_4O98LOZ8fy'
    ],
    stock: 20
  },
  {
    _id: 'p2',
    title: 'Minimal Backpack',
    description: 'Durable & water resistant everyday carry with padded compartments for a 15" laptop and accessories.\n\nFeatures:\n• Water resistant coating\n• YKK zippers\n• Hidden security pocket',
    price: { amount: 4599, currency: 'INR' },
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1514474959185-1472d4d4b221?auto=format&fit=crop&w=800&q=60'
    ],
    stock: 4
  }
];

export default function ProductDetails() {
  const { id } = useParams();
  const product = useMemo(() => sampleProducts.find(p => p._id === id) || sampleProducts[0], [id]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) {
    return <div className="pd-shell"><p>Product not found.</p></div>;
  }

  const priceFmt = new Intl.NumberFormat('en-IN',{ style:'currency', currency: product.price.currency }).format(product.price.amount/100);
  const activeImage = product.images?.[activeIndex];
  const out = product.stock <= 0;

  return (
    <div className="pd-shell" aria-labelledby="pd-title">
      <div className="pd-media" aria-label="Product images">
        {activeImage ? (
          <img src={activeImage} alt={product.title} className="pd-main-img" />
        ) : (
          <div className="pd-main-img" aria-hidden="true" />
        )}
        {product.images && product.images.length > 1 && (
          <div className="pd-thumbs" role="list">
            {product.images.map((img, i) => (
              <button key={img} type="button" className={`pd-thumb ${i===activeIndex ? 'active':''}`} role="listitem" onClick={()=>setActiveIndex(i)} aria-label={`Show image ${i+1}`}> 
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pd-info">
        <h1 id="pd-title" className="pd-title">{product.title}</h1>
        <div className={`pd-stock ${out ? 'out':''}`}>{out ? 'Out of stock' : `${product.stock} in stock`}</div>
        <div className="pd-price" aria-live="polite">{priceFmt}</div>
        <p className="pd-desc">{product.description}</p>
        <div className="pd-actions">
            <button className="btn-buy" disabled={out}>{out ? 'Unavailable' : 'Buy now'}</button>
        </div>
        <div className="pd-meta">
          <span><strong>ID:</strong> {product._id}</span>
          <span><strong>Currency:</strong> {product.price.currency}</span>
        </div>
      </div>
    </div>
  );
}
