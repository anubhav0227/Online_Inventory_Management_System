import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales, addSale, updateSale, deleteSale } from "../../stores/slices/salesSlice";
import toast from "react-hot-toast";

export default function SalesList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.sales || {});

  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const submitSale = () => {
    if (!item || !qty || !price) {
      toast.error("All fields required");
      return;
    }
    const newSale = { item, qty: Number(qty), price: Number(price), total: Number(qty) * Number(price) };
    dispatch(addSale(newSale));
    setItem(""); setQty(""); setPrice("");
    toast.success("Sale added");
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditItem(s.item); setEditQty(String(s.qty)); setEditPrice(String(s.price));
  };

  const saveEdit = () => {
    if (!editItem || !editQty || !editPrice) { toast.error("All fields required"); return; }
    dispatch(updateSale({ id: editingId, data: { item: editItem, qty: Number(editQty), price: Number(editPrice), total: Number(editQty) * Number(editPrice) } }));
    setEditingId(null);
    toast.success("Sale updated");
  };

  const remove = (id) => {
    if (!confirm("Delete sale?")) return;
    dispatch(deleteSale(id));
    toast.success("Sale deleted");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales</h1>

      <div className="p-4 bg-white rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Sale</h2>
        <div className="grid grid-cols-3 gap-4">
          <input className="border px-3 py-2 rounded" placeholder="Item Name" value={item} onChange={(e) => setItem(e.target.value)} />
          <input className="border px-3 py-2 rounded" placeholder="Quantity" value={qty} onChange={(e) => setQty(e.target.value)} />
          <input className="border px-3 py-2 rounded" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button onClick={submitSale} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Add Sale</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Sales</h2>

      <ul className="space-y-3">
        {list.map((sale) => (
          <li key={sale.id} className="bg-white p-4 rounded shadow border">
            {editingId === sale.id ? (
              <div className="flex gap-3">
                <input value={editItem} onChange={(e) => setEditItem(e.target.value)} className="border p-2 rounded flex-1" />
                <input value={editQty} onChange={(e) => setEditQty(e.target.value)} className="border p-2 rounded w-24" />
                <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="border p-2 rounded w-24" />
                <button onClick={saveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{sale.item}</div>
                  <div className="text-sm text-gray-500">Qty: {sale.qty} • Price: ₹{sale.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(sale)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => remove(sale.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
