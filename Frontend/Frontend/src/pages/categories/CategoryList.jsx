import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../stores/slices/categorySlice";
import toast from "react-hot-toast";

export default function CategoryList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.categories || {});

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const addNew = async () => {
    if (!newName.trim()) {
      toast.error("Category name required");
      return;
    }
    await dispatch(addCategory(newName));
    setNewName("");
    toast.success("Category added");
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      toast.error("Category name required");
      return;
    }
    await dispatch(updateCategory({ id: editingId, name: editName }));
    setEditingId(null);
    toast.success("Category updated");
  };

  const remove = async (id) => {
    if (!confirm("Delete category?")) return;
    await dispatch(deleteCategory(id));
    toast.success("Category deleted");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="flex gap-3 mb-4">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="New Category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addNew} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {list.map((cat) => (
          <li
            key={cat.id}
            className="
              p-4 bg-gray-100 rounded-lg shadow 
              border border-gray-300 flex items-center justify-between
            "
          >
            <div className="flex-1">
              {editingId === cat.id ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <span className="font-medium text-gray-800">{cat.name}</span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(cat)}
                    className="px-3 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(cat.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
