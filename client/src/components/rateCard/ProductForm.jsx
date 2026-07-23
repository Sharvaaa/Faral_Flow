function ProductForm() {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Product Name"
          className="border rounded-lg p-2"
        />

        <select className="border rounded-lg p-2">
          <option>kg</option>
          <option>gram</option>
          <option>piece</option>
          <option>packet</option>
          <option>box</option>
          <option>dozen</option>
        </select>

        <input
          type="number"
          placeholder="Retail Price (₹)"
          className="border rounded-lg p-2"
        />

        <input
          type="number"
          placeholder="Wholesale Price (₹)"
          className="border rounded-lg p-2"
        />
      </div>

      <button className="mt-5 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800">
        Add Product
      </button>
    </div>
  );
}

export default ProductForm;