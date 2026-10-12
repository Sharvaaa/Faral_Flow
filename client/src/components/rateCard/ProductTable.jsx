
function ProductTable({ products, deleteProduct, editProduct }) {
  const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

  return (
    <div className="product-table-card">
      <div className="product-table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th className="product-name-column">Product</th>
              <th>250g Retail</th>
              <th>500g Retail</th>
              <th>750g Retail</th>
              <th>1kg Retail</th>
              <th>Wholesale/kg</th>
              <th className="product-actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="product-table-empty">
                  No products added yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="product-name-cell">
                    <span className="product-name-mark">
                      {product.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span>{product.name}</span>
                  </td>

                  <td>{formatPrice(product.retailPrice250g)}</td>
                  <td>{formatPrice(product.retailPrice500g)}</td>
                  <td>{formatPrice(product.retailPrice750g)}</td>
                  <td>{formatPrice(product.retailPrice1kg)}</td>

                  <td>
                    <span className="wholesale-price">
                      {formatPrice(product.wholesalePrice)}
                    </span>
                  </td>

                  <td>
                    <div className="product-table-actions">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                        className="product-action-edit"
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="product-action-remove"
                        aria-label={`Remove ${product.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="product-table-footer">
          Showing <strong>{products.length}</strong>{" "}
          {products.length === 1 ? "active product" : "active products"}
        </div>
      )}
    </div>
  );
}

export default ProductTable;