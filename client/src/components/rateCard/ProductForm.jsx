function ProductForm({
  formData,
  setFormData,
  addProduct,
  updateProduct,
  editingProduct,
  cancelEdit,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border rounded-lg p-2"
        />

        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          <option value="kg">kg</option>
          <option value="gram">gram</option>
          <option value="piece">piece</option>
          <option value="packet">packet</option>
          <option value="box">box</option>
          <option value="dozen">dozen</option>
        </select>

        <input
          type="number"
          name="retailPrice"
          value={formData.retailPrice}
          onChange={handleChange}
          placeholder="Retail Price (₹)"
          className="border rounded-lg p-2"
        />

        <input
          type="number"
          name="wholesalePrice"
          value={formData.wholesalePrice}
          onChange={handleChange}
          placeholder="Wholesale Price (₹)"
          className="border rounded-lg p-2"
        />
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={editingProduct ? updateProduct : addProduct}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            onClick={cancelEdit}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductForm;