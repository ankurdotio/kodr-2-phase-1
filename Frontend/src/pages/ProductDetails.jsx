import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ProductDetails.css';
import api from '../api/client';
import axios from 'axios';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true); setError('');
        const res = await api.get(`/api/products/${id}`);
        if (!cancelled) setProduct(res.data.product);
      } catch (e) {
        if (!cancelled) setError(e?.response?.status === 404 ? 'Product not found' : 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleBuy() {

    const response = await axios.post(`http://localhost:3000/api/payments/create/${id}`,{}, { withCredentials: true })

    console.log(response.data)

     const options = {
        key: "rzp_test_jFm6yLzfwSZQld", // from .env (frontend can use only key_id)
        amount: response.data.order.price.amount,
        currency: response.data.order.price.currency,
        name: "My Company",
        description: "Test Transaction",
        order_id: response.data.order.orderId,
        handler: async function (response) {
          console.log(response);
          
          axios.post("http://localhost:3000/api/payments/verify", {
            razorpayOrderId:response.razorpay_order_id, razorpayPaymentId:response.razorpay_payment_id, signature:response.razorpay_signature
          },{withCredentials:true}).then(response=>{
            console.log(response.data)
          }).catch(err=>{
            console.log(err)
          })
          
          
        },
        prefill: {
          name: response.data.user.fullName.firstName + ' ' + response.data.user.fullName.lastName,
          email: response.data.user.email,
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

  }

  if (loading) return <div className="pd-shell"><p>Loading…</p></div>;
  if (error) return <div className="pd-shell"><p>{error}</p></div>;
  if (!product) return <div className="pd-shell"><p>Product not found.</p></div>;

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
            <button onClick={handleBuy} className="btn-buy" disabled={out}>{out ? 'Unavailable' : 'Buy now'}</button>
        </div>
        <div className="pd-meta">
          <span><strong>ID:</strong> {product._id}</span>
          <span><strong>Currency:</strong> {product.price.currency}</span>
        </div>
      </div>
    </div>
  );
}
