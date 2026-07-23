import { useState } from "react";
import ProductForm from "../components/rateCard/ProductForm";
import ProductTable from "../components/rateCard/ProductTable";
import sampleProducts from "../data/sampleProducts";

function RateCard() {
  const [products, setProducts] =useState(sampleProducts);

  const [formData, setFormData] = useState({
    name: "",
    unit: "kg",
    retailPrice: "",
    wholesalePrice: "",
  });

  const addProduct = () => {
    // Validation
    if (
      !formData.name.trim() ||
      !formData.retailPrice ||
      !formData.wholesalePrice
    ) {
      alert("Please fill all the fields.");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: formData.name,
      unit: formData.unit,
      retailPrice: Number(formData.retailPrice),
      wholesalePrice: Number(formData.wholesalePrice),
    };

    setProducts((prevProducts) => [...prevProducts, newProduct]);

    // Reset form
    setFormData({
      name: "",
      unit: "kg",
      retailPrice: "",
      wholesalePrice: "",
    });
  };

  const deleteProduct = (id) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rate Card</h1>

      <ProductForm
        formData={formData}
        setFormData={setFormData}
        addProduct={addProduct}
      />

      <ProductTable
        products={products}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default RateCard;