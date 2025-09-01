import { useState, useRef } from 'react';
import './SellerProductCreate.css';

// UI only – no API call logic. Placeholder submit handler.
export default function SellerProductCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]); // { id, file, url }
  const fileInputRef = useRef(null);

  function handleImagesSelected(filesList) {
    const files = Array.from(filesList || []);
    if (!files.length) return;
    const next = files.map(f => ({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...next]);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    handleImagesSelected(e.dataTransfer.files);
  }

  function handleRemoveImage(id) {
    setImages(prev => prev.filter(img => img.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Build payload (UI only)
    const payload = {
      title,
      description,
      price: { amount: Number(priceAmount), currency },
      stock: Number(stock),
      images: images.map(i => i.file?.name || i.url)
    };
    // No actual API call – just log for development.
    console.log('Create product payload (UI only):', payload);
  }

  const priceError = priceAmount !== '' && Number(priceAmount) <= 0;
  const stockError = stock !== '' && Number(stock) < 0;

  return (
    <div className="product-create-wrapper role-seller" aria-labelledby="product-create-heading">
      <header>
        <h1 id="product-create-heading">Add new product</h1>
        <p className="product-create-sub">Provide product details below. Fields marked with * are required.</p>
      </header>

      <form className="pc-form" onSubmit={handleSubmit} noValidate>
        <div className="pc-field">
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" required />
        </div>

        <div className="pc-field">
          <label htmlFor="description">Description *</label>
          <textarea id="description" name="description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Detailed description" required />
        </div>

        <div className="inline-group">
          <div className="pc-field" style={{maxWidth:'220px'}}>
            <label htmlFor="priceAmount">Price Amount *</label>
            <input id="priceAmount" name="priceAmount" type="number" min="1" step="1" inputMode="numeric" value={priceAmount} onChange={e=>setPriceAmount(e.target.value)} placeholder="e.g. 999" required />
            {priceError && <span className="error-text">Amount must be &gt; 0</span>}
          </div>
          <div className="pc-field" style={{maxWidth:'160px'}}>
            <label htmlFor="currency">Currency *</label>
            <select id="currency" name="currency" value={currency} onChange={e=>setCurrency(e.target.value)} required>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="pc-field" style={{maxWidth:'160px'}}>
            <label htmlFor="stock">Stock *</label>
            <input id="stock" name="stock" type="number" min="0" step="1" inputMode="numeric" value={stock} onChange={e=>setStock(e.target.value)} placeholder="e.g. 20" required />
            {stockError && <span className="error-text">Stock must be ≥ 0</span>}
          </div>
        </div>

        <div className="images-uploader">
          <label>Images *</label>
          <div
            className="images-dropzone"
            onDragOver={e=>{e.preventDefault();}}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              aria-label="Upload product images"
              onChange={e=>handleImagesSelected(e.target.files)}
            />
            <span><strong>Click to upload</strong> or drag & drop</span>
            <span className="help-text">PNG, JPG up to ~5MB each.</span>
          </div>
          {images.length > 0 && (
            <div className="images-grid" role="list" aria-label="Selected images">
              {images.map(img => (
                <div key={img.id} className="img-preview" role="listitem">
                  <img src={img.url} alt="Preview" />
                  <button type="button" className="remove-img" onClick={()=>handleRemoveImage(img.id)} aria-label="Remove image">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="divider" />
        <div className="actions-bar">
          <button type="button" className="btn secondary" onClick={()=>{ setTitle(''); setDescription(''); setPriceAmount(''); setCurrency('INR'); setStock(''); images.forEach(i=>URL.revokeObjectURL(i.url)); setImages([]); }}>Reset</button>
          <button type="submit" className="btn" disabled={!title || !description || !priceAmount || priceError || stockError || !images.length}>Create Product</button>
        </div>
      </form>
    </div>
  );
}
