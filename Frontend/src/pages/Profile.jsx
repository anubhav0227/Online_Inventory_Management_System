// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchPurchases } from "../stores/slices/purchaseSlice";
import { fetchSales } from "../stores/slices/salesSlice";

/**
 * Profile page — updated:
 * - Stats computed robustly (handles many purchase shapes)
 * - Bio is editable and saved client-side (wire to backend thunk if available)
 * - Activity aggregated from user.activity + purchases + sales, deduped & sorted
 * - Removed Recent Purchases and Change Password UI
 *
 * To persist changes to server: replace the TODO dispatch calls with your real thunks:
 *   - dispatch(updateUser(...)) or similar
 */

const THEME = {
  accent: "#00D1B2",
  cardBg: "bg-gray-900",
  cardBorder: "border-gray-700",
};

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);
  const purchases = useSelector((s) => s.purchases?.list || []);
  const sales = useSelector((s) => s.sales?.list || []);

  // Editable form
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", bio: "" });
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    dispatch(fetchPurchases());
    dispatch(fetchSales());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || user.username || "",
        phone: user.phone || "",
        company: user.companyName || user.company || "",
        bio: user.bio || "",
      });
      if (user.avatarUrl) setAvatarDataUrl(user.avatarUrl);
    }
  }, [user]);

  /* ==========================
     Stats: handle multiple purchase shapes
     Some backends return purchase.createdBy, purchase.userId, purchase.owner_id, etc.
     We compute:
       - overallTotals (system-wide)
       - userRelatedTotals (if purchases reference the current user)
     and prefer userRelated if it has items; otherwise show overall
     ========================== */
  const { overallTotals, userRelatedTotals } = useMemo(() => {
    let overallCount = 0;
    let overallSpend = 0;
    let userCount = 0;
    let userSpend = 0;

    const userIdStr = user ? String(user.id) : null;

    for (const p of purchases) {
      overallCount++;
      const pTotal = Number(p.totalAmount ?? p.total_amount ?? (p.quantity && (p.unitPrice ?? p.costPrice) ? (Number(p.quantity) * Number(p.unitPrice ?? p.costPrice)) : 0)) || 0;
      overallSpend += pTotal;

      // robust check for ownership fields
      const ownerFields = [
        p.createdBy,
        p.created_by,
        p.userId,
        p.user_id,
        p.ownerId,
        p.owner_id,
        p.created_at_user_id,
      ].map((v) => (v === undefined || v === null ? null : String(v)));

      const matchesUser = userIdStr && ownerFields.some((val) => val === userIdStr);
      if (matchesUser) {
        userCount++;
        userSpend += pTotal;
      }
    }

    return {
      overallTotals: { count: overallCount, spend: overallSpend },
      userRelatedTotals: { count: userCount, spend: userSpend },
    };
  }, [purchases, user]);

  // choose what to display: prefer user-related if any exist, else overall
  const displayTotals = (userRelatedTotals.count > 0) ? userRelatedTotals : overallTotals;

  /* ==========================
     Activity aggregation:
     - take user.activity if available (expect {title, time, type})
     - plus recent purchases and sales (create readable titles)
     - dedupe by generated key (type + id + time), sort descending
     ========================== */
  const activity = useMemo(() => {
    const items = [];

    // 1) user.activity array (if present)
    if (user && Array.isArray(user.activity)) {
      for (const a of user.activity) {
        // ensure a.time exists
        if (!a) continue;
        const time = a.time || a.timestamp || a.date || null;
        items.push({
          id: `uact-${a.id ?? a.title ?? Math.random()}`,
          title: a.title || a.message || "Activity",
          time: time ? new Date(time).getTime() : Date.now(),
          meta: a.meta || {},
          source: "user",
        });
      }
    }

    // 2) recent purchases (take last 8)
    for (const p of (purchases || []).slice(-12)) {
      const time = p.createdAt || p.created_at || p.timestamp || p.time || null;
      const tnum = time ? new Date(time).getTime() : Date.now();
      items.push({
        id: `purchase-${p.id}`,
        title: `Purchased ${p.productName || p.product || "item"}`,
        time: tnum,
        meta: { qty: p.quantity, total: p.totalAmount ?? p.total_amount },
        source: "purchase",
      });
    }

    // 3) recent sales (take last 8)
    for (const s of (sales || []).slice(-12)) {
      const time = s.createdAt || s.created_at || s.timestamp || s.time || null;
      const tnum = time ? new Date(time).getTime() : Date.now();
      items.push({
        id: `sale-${s.id}`,
        title: `Sold ${s.productName || s.product || "item"}`,
        time: tnum,
        meta: { qty: s.quantity, total: s.totalAmount ?? s.total_amount },
        source: "sale",
      });
    }

    // dedupe by id (keep latest) and sort by time desc
    const map = new Map();
    for (const it of items) {
      // if duplicate id, keep the one with later time
      if (!map.has(it.id) || (map.get(it.id).time < it.time)) map.set(it.id, it);
    }
    const merged = Array.from(map.values()).sort((a, b) => b.time - a.time);
    // limit to 12 items
    return merged.slice(0, 12);
  }, [user, purchases, sales]);

  /* ==========================
     Avatar handling
     ========================== */
  function handleAvatarPick(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  }

  /* ==========================
     Save profile (client-only) — replace with your server thunk
     ========================== */
  async function saveProfile() {
    if (!form.name || !form.email) {
      toast.error("Name & email required");
      return;
    }

    try {
      // TODO: dispatch your updateUser thunk here, e.g.:
      // await dispatch(updateUser({ id: user.id, data: { ...form }, avatar: avatarFile })).unwrap();

      // For now do optimistic client save only
      toast.success("Profile updated (client-only)");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  }

  /* ==========================
     Inline Bio save (editable in profile card)
     ========================== */
  function saveBio() {
    // TODO: call server to save bio
    toast.success("Bio saved (client-only)");
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-400 mt-2">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="text-gray-400 mt-1">Manage your account & preferences</div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setEditing((e) => !e); }} className="px-3 py-2 rounded-md border border-gray-700 text-sm">
            {editing ? "Close Edit" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Purchases" value={displayTotals.count} />
        <StatCard title="Total spend" value={`₹${Number(displayTotals.spend || 0).toLocaleString()}`} />
        <StatCard title="Role" value={user.role || "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className={`${THEME.cardBg} ${THEME.cardBorder} p-5 rounded-md`}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-white/5 flex items-center justify-center text-2xl text-white overflow-hidden">
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.name || "U")[0]}</span>
                )}
              </div>

              {editing && (
                <label className="absolute -bottom-2 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarPick(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="px-2 py-1 rounded-md bg-white/5 text-xs border border-gray-700">Upload</div>
                </label>
              )}
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-white">{user.name}</div>
              <div className="text-sm text-gray-400">{user.email || user.username}</div>
              <div className="text-sm text-gray-400 mt-1">{form.company || "—"}</div>
            </div>

            <div className="w-full mt-3">
              <div className="text-sm text-gray-400 mb-1">About / Bio</div>

              {/* Bio is editable inline */}
              {editing ? (
                <>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
                    placeholder="Write a short bio..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => { saveBio(); }} className="px-3 py-1 rounded-md border border-gray-700">Save Bio</button>
                    <button onClick={() => setForm((s) => ({ ...s, bio: user.bio || "" }))} className="px-3 py-1 rounded-md border border-gray-700">Revert</button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-300">{form.bio || "No bio set."}</p>
              )}
            </div>

            <div className="w-full mt-4 flex gap-2">
              <button onClick={() => setEditing(true)} className="flex-1 px-3 py-2 rounded-md border border-gray-700">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Edit / Details */}
        <div className={`${THEME.cardBg} ${THEME.cardBorder} p-5 rounded-md lg:col-span-2`}>
          <h2 className="text-lg font-semibold text-white mb-3">Account details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} disabled={!editing} />
            <Field label="Email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} disabled={!editing} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} disabled={!editing} />
            <Field label="Company" value={form.company} onChange={(v) => setForm((s) => ({ ...s, company: v }))} disabled={!editing} />
          </div>

          {editing && (
            <div className="mt-4 flex gap-2">
              <button onClick={saveProfile} className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Save</button>
              <button onClick={() => {
                setForm({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  company: user.companyName || user.company || "",
                  bio: user.bio || "",
                });
                setAvatarDataUrl(user.avatarUrl || null);
                setEditing(false);
              }} className="px-3 py-2 rounded-md border border-gray-700">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Activity panel */}
      <div className={`${THEME.cardBg} ${THEME.cardBorder} p-5 rounded-md`}>
        <h3 className="text-lg font-semibold text-white mb-3">Activity</h3>

        {activity.length === 0 && <div className="text-gray-400">No recent activity.</div>}

        <div className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-white font-medium">{a.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(a.time).toLocaleString()}
                  {a.source && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-white/3 text-gray-200">{a.source}</span>}
                </div>
                {a.meta && a.meta.qty !== undefined && (
                  <div className="text-xs text-gray-400 mt-1">Qty: {a.meta.qty} • Total: ₹{Number(a.meta.total || 0).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------- UI helpers ----------------- */

function StatCard({ title, value }) {
  return (
    <div className={`p-4 rounded-md ${THEME.cardBg} ${THEME.cardBorder}`}>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 mt-1 rounded-md ${disabled ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-white"} border border-gray-700`}
      />
    </div>
  );
}
