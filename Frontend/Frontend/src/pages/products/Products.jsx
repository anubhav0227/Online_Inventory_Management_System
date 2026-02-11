// src/pages/products/Products.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  deleteCategory as deleteCategoryAction,
} from "../../stores/slices/categorySlice";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../stores/slices/productSlice";
import toast from "react-hot-toast";

console.log("PRODUCTS.JSX LOADED — timestamp:", Date.now());

export default function Products() {
  const dispatch = useDispatch();

  const { list: categories = [] } = useSelector((s) => s.categories || {});
  const { list: products = [], loading } = useSelector((s) => s.products || {});

  // category state
  const [newCategory, setNewCategory] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // product form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ----- Categories -----
  const addNewCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name required");
      return;
    }
    try {
      setCatLoading(true);
      await dispatch(addCategory(newCategory.trim()));
      setNewCategory("");
      dispatch(fetchCategories());
      toast.success("Category added");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add category");
    } finally {
      setCatLoading(false);
    }
  };

  const removeCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await dispatch(deleteCategoryAction(id));
      dispatch(fetchCategories());
      toast.success("Category deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete category");
    }
  };

  // ----- Products -----
  const submitProduct = async (e) => {
    e && e.preventDefault();
    if (!name.trim() || !categoryId || !sku.trim() || !price || !qty) {
      toast.error("Please fill required fields (name, category, sku, price, qty).");
      return;
    }

    const payload = {
      name: name.trim(),
      categoryId: Number(categoryId),
      sku: sku.trim(),
      price: Number(price),
      qty: Number(qty),
      desc: desc.trim(),
      totalValue: Number(price) * Number(qty),
    };

    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, data: payload }));
        toast.success("Product updated");
        setEditingId(null);
      } else {
        await dispatch(addProduct(payload));
        toast.success("Product added");
      }
      setName(""); setCategoryId(""); setSku(""); setPrice(""); setQty(""); setDesc("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setCategoryId(p.categoryId);
    setSku(p.sku);
    setPrice(String(p.price));
    setQty(String(p.qty));
    setDesc(p.desc || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = (id) => {
    if (!confirm("Delete product?")) return;
    dispatch(deleteProduct(id));
  };

  const getCategoryName = (id) => {
    const c = categories.find((x) => x.id === id);
    return c ? c.name : "—";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow border">
        <h3 className="font-semibold mb-3">Categories</h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Add Category</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded text-sm"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewCategory(); } }}
            />
            <button onClick={addNewCategory} disabled={catLoading}
              className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">
              {catLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {categories.length === 0 && <li className="text-sm text-gray-500">No categories</li>}
          {categories.map((c) => (
            <li key={c.id} className="text-sm p-2 rounded hover:bg-gray-50 flex justify-between items-center border">
              <div>
                <div className="font-medium text-gray-800">{c.name}</div>
                <div className="text-xs text-gray-400">#{c.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-xs bg-gray-100 rounded">Edit</button>
                <button onClick={() => removeCategory(c.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="lg:col-span-3">
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-semibold mb-3">{editingId ? "Edit Product" : "Add Product"}</h2>

          <form onSubmit={submitProduct} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 rounded" placeholder="Product name *" />

            <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className="border p-2 rounded">
              <option value="">Select category *</option>
              {categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <input value={sku} onChange={(e)=>setSku(e.target.value)} className="border p-2 rounded" placeholder="SKU *" />

            <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number" className="border p-2 rounded" placeholder="Price *" />
            <input value={qty} onChange={(e)=>setQty(e.target.value)} type="number" className="border p-2 rounded" placeholder="Quantity *" />
            <input value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-2 rounded md:col-span-3" placeholder="Short description (optional)" />

            <div className="md:col-span-3 flex gap-2 justify-end">
              {editingId && <button type="button" onClick={() => { setEditingId(null); setName(""); setCategoryId(""); setSku(""); setPrice(""); setQty(""); setDesc(""); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>}
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">{editingId ? "Save Product" : "Add Product"}</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-3">Products</h3>
          {loading && <p>Loading products...</p>}
          <ul className="space-y-3">
            {products.length === 0 && <li className="text-gray-500">No products yet</li>}
            {products.map((p)=>(
              <li key={p.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-gray-600">{getCategoryName(categories,p.categoryId)} • SKU: {p.sku}</div>
                  <div className="text-sm mt-1">₹{p.price} × {p.qty} = <b>₹{p.totalValue}</b></div>
                  {p.desc && <div className="text-xs text-gray-500 mt-1">{p.desc}</div>}
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={()=>startEdit(p)} className="px-3 py-1 bg-yellow-400 rounded text-sm">Edit</button>
                  <button onClick={()=>removeProduct(p.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

// small helpers used in render
function getCategoryName(categories, id) {
  const c = categories.find((x)=> x.id === id);
  return c ? c.name : "—";
}
// these placeholders are overridden by functions inside component scope via closures (startEdit/removeProduct)
function startEdit(){ console.warn("startEdit placeholder called"); }
function removeProduct(){ console.warn("removeProduct placeholder called"); }
