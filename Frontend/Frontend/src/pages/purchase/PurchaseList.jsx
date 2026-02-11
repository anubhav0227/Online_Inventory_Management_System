import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchases, addPurchase, updatePurchase, deletePurchase } from "../../stores/slices/purchaseSlice";
import toast from "react-hot-toast";

export default function PurchaseList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.purchases || {});

  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const submit = () => {
    if (!item || !qty || !price) { toast.error("All fields required"); return; }
    dispatch(addPurchase({ item, qty: Number(qty), price: Number(price), total: Number(qty) * Number(price) }));
    setItem(""); setQty(""); setPrice("");
    toast.success("Purchase added");
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditItem(p.item); setEditQty(String(p.qty)); setEditPrice(String(p.price));
  };

  const saveEdit = () => {
    if (!editItem || !editQty || !editPrice) { toast.error("All fields required"); return; }
    dispatch(updatePurchase({ id: editingId, data: { item: editItem, qty: Number(editQty), price: Number(editPrice), total: Number(editQty) * Number(editPrice) } }));
    setEditingId(null); toast.success("Purchase updated");
  };

  const remove = (id) => {
    if (!confirm("Delete purchase?")) return;
    dispatch(deletePurchase(id));
    toast.success("Purchase deleted");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Purchase</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-3">Add Purchase</h2>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Item" className="border p-2 rounded" value={item} onChange={(e) => setItem(e.target.value)} />
          <input placeholder="Qty" className="border p-2 rounded" value={qty} onChange={(e) => setQty(e.target.value)} />
          <input placeholder="Price" className="border p-2 rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button onClick={submit} className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded">Add Purchase</button>
      </div>

      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            {editingId === p.id ? (
              <div className="flex gap-2 w-full">
                <input className="border p-2 rounded flex-1" value={editItem} onChange={(e) => setEditItem(e.target.value)} />
                <input className="border p-2 rounded w-20" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
                <input className="border p-2 rounded w-24" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                <button onClick={saveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <div className="font-semibold">{p.item}</div>
                  <div className="text-sm text-gray-500">Qty: {p.qty} • Price: ₹{p.price}</div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
