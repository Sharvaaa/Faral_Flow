import { useState } from "react";
import ProductForm from "../components/rateCard/ProductForm";
import ProductTable from "../components/rateCard/ProductTable";
import sampleProducts from "../data/sampleProducts";

function RateCard() {
  const [products] = useState(sampleProducts);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rate Card</h1>

      <ProductForm />

      <ProductTable products={products} />
    </div>
  );
}

export default RateCard;