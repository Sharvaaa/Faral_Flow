
function ProductForm({
  formData,
  setFormData,
  addProduct,
  updateProduct,
  editingProduct,
  cancelEdit,
  saving = false,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const retailFields = [
    { name: "retailPrice250g", label: "250g packet", hint: "Retail price" },
    { name: "retailPrice500g", label: "500g packet", hint: "Retail price" },
    { name: "retailPrice750g", label: "750g packet", hint: "Retail price" },
    { name: "retailPrice1kg", label: "1kg packet", hint: "Retail price" },
  ];

  return (
    <section className="product-form-card">
      <div className="product-form-heading">
        <div className="product-form-heading-icon">+</div>
        <div>
          <h2>{editingProduct ? "Edit product" : "Add a product"}</h2>
          <p>
            {editingProduct
              ? "Update the product details and prices below."
              : "Enter the product name and all five prices."}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          editingProduct ? updateProduct() : addProduct();
        }}
      >
        <div className="form-field product-name-field">
          <label htmlFor="product-name">Product name</label>
          <input
            id="product-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Besan Ladoo"
            maxLength={100}
            required
            disabled={saving}
          />
        </div>

        <div className="price-fields-heading">
          <div>
            <h3>Retail pricing</h3>
            <p>Set each packet price independently.</p>
          </div>
          <span className="price-tag">Customer orders</span>
        </div>

        <div className="retail-price-grid">
          {retailFields.map((field) => (
            <div className="form-field price-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <span className="field-hint">{field.hint}</span>
              <div className="price-input-wrap">
                <span className="currency-symbol">₹</span>
                <input
                  id={field.name}
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder="0.00"
                  aria-label={`${field.label} retail price in rupees`}
                  min="0.01"
                  step="0.01"
                  required
                  disabled={saving}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="wholesale-price-panel">
          <div className="wholesale-price-copy">
            <h3>Wholesale price</h3>
            <p>Reference only — not used for customer order calculations.</p>
          </div>
          <div className="form-field wholesale-price-field">
            <label htmlFor="wholesalePrice">Price per kg</label>
            <div className="price-input-wrap">
              <span className="currency-symbol">₹</span>
              <input
                id="wholesalePrice"
                type="number"
                name="wholesalePrice"
                value={formData.wholesalePrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="product-form-actions">
          {editingProduct && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? "Saving..."
              : editingProduct
                ? "Save changes"
                : "Add product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;