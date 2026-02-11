import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  updateCategory,
  fetchCategories,
} from "../../stores/slices/categorySlice";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { list: categories, loading } = useSelector(
    (state) => state.categories
  );

  // ================= LOAD FOR EDIT =================
  useEffect(() => {
    if (!id) return;

    // fetch categories if not loaded
    if (categories.length === 0) {
      dispatch(fetchCategories());
      return;
    }

    const category = categories.find(
      (c) => String(c.id) === String(id)
    );

    if (!category) {
      toast.error("Category not found");
      navigate("/categories");
      return;
    }

    setName(category.name);
  }, [id, categories, dispatch, navigate]);

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (id) {
        await dispatch(
          updateCategory({
            id,
            name: name.trim(),
          })
        ).unwrap();

        toast.success("Category updated");
      } else {
        await dispatch(addCategory(name.trim())).unwrap();
        toast.success("Category added");
      }

      navigate("/categories");
    } catch (err) {
      toast.error(err || "Failed to save category");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-lg bg-white p-6 rounded shadow"
    >
      <h2 className="text-lg font-medium mb-4">
        {id ? "Edit Category" : "New Category"}
      </h2>

      <label className="block mb-4">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="Enter category name"
          disabled={loading}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          Save
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-gray-100 rounded"
          onClick={() => navigate("/categories")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
