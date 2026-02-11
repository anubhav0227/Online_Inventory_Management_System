import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen">
      
      {/*  HEADER  */}
      <header className="py-6 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold">
          <span className="text-white">Inventory</span>
          <span className="text-yellow-400">Pro</span>
        </Link>

        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 bg-white text-gray-900 rounded-lg">
            Login
          </Link>
          <Link
            to="/companies/register"
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg"
          >
            Register
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-[75vh] flex items-center">
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Inventory Management,
              <span className="text-yellow-400"> Simplified.</span>
            </h1>

            <p className="text-lg text-gray-300 mb-6">
              Track stock, manage sales & purchases, monitor analytics — everything in one
              powerful dashboard.
            </p>

            <div className="flex gap-4">
              <Link
                to="/companies/register"
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold"
              >
                Get Started
              </Link>

              <a
                href="#features"
                className="px-6 py-3 border border-gray-300 rounded-lg"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src="https://cdn3d.iconscout.com/3d/premium/thumb/business-dashboard-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--statistics-data-analysis-analytics-charts-pack-marketing-illustrations-5728447.png"
            alt="dashboard"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gray-800/40 border-t border-gray-700">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { title: "Smart Inventory", desc: "Track real-time stock levels with precision." },
            { title: "Sales & Purchases", desc: "Manage customer and supplier operations easily." },
            { title: "Cloud Sync", desc: "Your data is always backed up and accessible." },
            { title: "Advanced Analytics", desc: "Monitor trends & insights instantly." },
            { title: "Multi-User Access", desc: "Create roles with admin-level control." },
            { title: "Secure Platform", desc: "Enterprise grade security & encryption." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 p-6 rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-300 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src="https://cdn3d.iconscout.com/3d/premium/thumb/storage-warehouse-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--goods-store-stock-pack-illustrations-5728451.png"
            className="w-full max-w-md"
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose InventoryPro?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              InventoryPro is built for modern companies that want fast, reliable,
              and efficient inventory control.
            </p>
            <p className="text-gray-300">
              From stock management to analytics, our platform helps optimize your
              business workflow with ease.
            </p>
          </motion.div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 text-center gap-8 px-6">
          {[
            { num: "10K+", label: "Products Tracked" },
            { num: "500+", label: "Companies Registered" },
            { num: "1M+", label: "Inventory Movements" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-5xl font-bold text-yellow-400">{s.num}</h3>
              <p className="text-gray-300 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-10">Loved by Businesses</h2>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            "This system helped us cut inventory errors by 40%.",
            "Amazing UI and very smooth workflow!",
            "Our entire business runs on InventoryPro now.",
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-lg"
            >
              <p className="text-gray-200">“{t}”</p>
              <p className="mt-3 text-sm text-yellow-400">— User {i + 1}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-yellow-400 text-gray-900 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to take control?</h2>
        <p className="mb-6">Start managing your inventory smarter, today.</p>
        <Link
          to="/companies/register"
          className="px-8 py-3 font-bold bg-gray-900 text-white rounded-lg"
        >
          Get Started — It's Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-300">
        © {new Date().getFullYear()} InventoryPro. All rights reserved.
      </footer>

    </div>
  );
}
