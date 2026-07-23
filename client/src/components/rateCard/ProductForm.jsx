function ProductForm({ formData, setFormData, addProduct}) {
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
        Add Product
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
          <option>kg</option>
          <option>gram</option>
          <option>piece</option>
          <option>packet</option>
          <option>box</option>
          <option>dozen</option>
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

      <button
        onClick={addProduct}
        className="mt-5 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800">
        Add Product
      </button>
    </div>
  );
}

export default ProductForm;