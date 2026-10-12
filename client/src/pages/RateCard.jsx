
import { useCallback, useEffect, useState } from "react";
import ProductForm from "../components/rateCard/ProductForm";
import ProductTable from "../components/rateCard/ProductTable";
import { supabase } from "../services/supabase";

const initialFormData = {
  name: "",
  retailPrice250g: "",
  retailPrice500g: "",
  retailPrice750g: "",
  retailPrice1kg: "",
  wholesalePrice: "",
};

const toFormData = (product) => ({
  name: product.name ?? "",
  retailPrice250g: String(product.retail_price_250g ?? ""),
  retailPrice500g: String(product.retail_price_500g ?? ""),
  retailPrice750g: String(product.retail_price_750g ?? ""),
  retailPrice1kg: String(product.retail_price_1kg ?? ""),
  wholesalePrice: String(product.wholesale_price_per_kg ?? ""),
});

const toProduct = (product) => ({
  ...product,
  retailPrice250g: Number(product.retail_price_250g),
  retailPrice500g: Number(product.retail_price_500g),
  retailPrice750g: Number(product.retail_price_750g),
  retailPrice1kg: Number(product.retail_price_1kg),
  wholesalePrice: Number(product.wholesale_price_per_kg),
});

function RateCard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select(
        "id, name, retail_price_250g, retail_price_500g, retail_price_750g, retail_price_1kg, wholesale_price_per_kg, is_active"
      )
      .eq("is_active", true)
      .order("name");

    if (fetchError) {
      setError(fetchError.message);
      setProducts([]);
    } else {
      setProducts((data ?? []).map(toProduct));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter a product name.");
      return false;
    }

    const prices = [
      ["250g retail price", formData.retailPrice250g],
      ["500g retail price", formData.retailPrice500g],
      ["750g retail price", formData.retailPrice750g],
      ["1kg retail price", formData.retailPrice1kg],
      ["Wholesale price per kg", formData.wholesalePrice],
    ];

    for (const [label, value] of prices) {
      if (
        value === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) <= 0
      ) {
        setError(`${label} must be greater than 0.`);
        return false;
      }
    }

    const duplicate = products.some(
      (product) =>
        product.name.trim().toLowerCase() ===
          formData.name.trim().toLowerCase() &&
        product.id !== editingProduct?.id
    );

    if (duplicate) {
      setError("A product with this name already exists.");
      return false;
    }

    return true;
  };

  const getDatabaseValues = () => ({
    name: formData.name.trim(),
    retail_price_250g: Number(formData.retailPrice250g),
    retail_price_500g: Number(formData.retailPrice500g),
    retail_price_750g: Number(formData.retailPrice750g),
    retail_price_1kg: Number(formData.retailPrice1kg),
    wholesale_price_per_kg: Number(formData.wholesalePrice),
  });

  const addProduct = async () => {
    setError("");
    if (!validateForm()) return;

    setSaving(true);

    const { error: insertError } = await supabase
      .from("products")
      .insert(getDatabaseValues());

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setFormData(initialFormData);
    await loadProducts();
  };

  const editProduct = (product) => {
    setError("");
    setEditingProduct(product);
    setFormData(toFormData(product));
  };

  const updateProduct = async () => {
    setError("");
    if (!editingProduct || !validateForm()) return;

    setSaving(true);

    const { error: updateError } = await supabase
      .from("products")
      .update(getDatabaseValues())
      .eq("id", editingProduct.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingProduct(null);
    setFormData(initialFormData);
    await loadProducts();
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Remove this product from the active Rate Card? Existing order and inventory history will be preserved."
    );

    if (!confirmed) return;

    setError("");

    const { error: deleteError } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingProduct?.id === id) {
      setEditingProduct(null);
      setFormData(initialFormData);
    }

    await loadProducts();
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setError("");
  };

  return (
    <div className="rate-card-page">
      <header className="page-header rate-card-header">
        <div>
          <p className="page-eyebrow">PRODUCT MANAGEMENT</p>
          <h1 className="page-title">Rate Card</h1>
          <p className="page-description">
            Manage products and their retail and wholesale prices.
          </p>
        </div>

        <div className="rate-card-count">
          <span className="rate-card-count-number">{products.length}</span>
          <span>Active products</span>
        </div>
      </header>

      {error && (
        <div className="app-alert app-alert-error" role="alert">
          <strong>Something needs your attention</strong>
          <p>{error}</p>
        </div>
      )}

      <ProductForm
        formData={formData}
        setFormData={setFormData}
        addProduct={addProduct}
        updateProduct={updateProduct}
        editingProduct={editingProduct}
        cancelEdit={cancelEdit}
        saving={saving}
      />

      <section className="rate-card-list-section">
        <div className="section-heading">
          <div>
            <h2>Product price list</h2>
            <p>Each packet size has its own independently entered price.</p>
          </div>
        </div>

        {loading ? (
          <div className="rate-card-state">
            <span className="loading-spinner" />
            <p>Loading products from your database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rate-card-state rate-card-empty">
            <div className="rate-card-empty-icon">₹</div>
            <h3>No products added yet</h3>
            <p>
              Add your first product above. Your saved prices will appear here.
            </p>
          </div>
        ) : (
          <ProductTable
            products={products}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
          />
        )}
      </section>
    </div>
  );
}

export default RateCard;