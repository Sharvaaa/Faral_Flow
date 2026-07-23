import ProductRow from "./ProductRow";

function ProductTable({ products }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3 text-left">Retail Price</th>
            <th className="p-3 text-left">Wholesale Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;