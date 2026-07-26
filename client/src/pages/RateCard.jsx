import { useState } from "react";
import ProductForm from "../components/rateCard/ProductForm";
import ProductTable from "../components/rateCard/ProductTable";
import sampleProducts from "../data/sampleProducts";

const initialFormData = {
  name: "",
  unit: "kg",
  retailPrice: "",
  wholesalePrice: "",
};

function RateCard() {
  const [products, setProducts] = useState(sampleProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Add Product
  const addProduct = () => {
    const duplicate = products.some(
      (product) =>
        product.name.toLowerCase() === formData.name.toLowerCase() &&
        product.id !== editingProduct?.id
    );

    if (duplicate) {
      alert("Product already exists.");
      return;
    }
    
    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!formData.retailPrice || Number(formData.retailPrice) <= 0) {
      alert("Retail price must be greater than 0.");
      return;
    }

    if (!formData.wholesalePrice || Number(formData.wholesalePrice) <= 0) {
      alert("Wholesale price must be greater than 0.");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      unit: formData.unit,
      retailPrice: Number(formData.retailPrice),
      wholesalePrice: Number(formData.wholesalePrice),
    };

    setProducts((prevProducts) => [...prevProducts, newProduct]);

    setFormData(initialFormData);
  };

  // Delete Product
  // Delete Product
  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  // Edit Product
  const editProduct = (product) => {
    console.log("Edit clicked");
    console.log(product);

    setEditingProduct(product);

    setFormData({
      name: product.name,
      unit: product.unit,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
    });
  };

  // Update Product
  const updateProduct = () => {
    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!formData.retailPrice || Number(formData.retailPrice) <= 0) {
      alert("Retail price must be greater than 0.");
      return;
    }

    if (!formData.wholesalePrice || Number(formData.wholesalePrice) <= 0) {
      alert("Wholesale price must be greater than 0.");
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: formData.name,
              unit: formData.unit,
              retailPrice: Number(formData.retailPrice),
              wholesalePrice: Number(formData.wholesalePrice),
            }
          : product
      )
    );

    setEditingProduct(null);
    setFormData(initialFormData);
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rate Card</h1>

      <ProductForm
        formData={formData}
        setFormData={setFormData}
        addProduct={addProduct}
        updateProduct={updateProduct}
        editingProduct={editingProduct}
        cancelEdit={cancelEdit}
      />

      <ProductTable
        products={products}
        deleteProduct={deleteProduct}
        editProduct={editProduct}
      />
    </div>
  );
}

export default RateCard;