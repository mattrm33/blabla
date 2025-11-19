import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Instagram,
  Plus,
  X,
  Upload,
  LogOut,
  ShieldCheck,
} from "lucide-react";

/* 🔐 Sécurité basique : mot de passe hashé (Bcrypt possible + backend si besoin) */
const ADMIN_USER = "admin";
const ADMIN_PASSWORD_HASH = btoa("herve regnier le goat"); // 🔴 À MODIFIER

export default function CramponDirectBoutique() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [ui, setUI] = useState({
    login: false,
    addProduct: false,
  });

  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "football",
    price: "",
    image: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  /* 📦 Storage produits */
  const loadProducts = async () => {
    try {
      const result = await window.storage.get("crampon_products");
      if (result) setProducts(JSON.parse(result.value));
    } catch {
      setProducts([]);
    }
  };

  const saveProducts = async (updated) => {
    await window.storage.set("crampon_products", JSON.stringify(updated));
    setProducts(updated);
  };

  /* 🔐 Connexion améliorée */
  const handleLogin = () => {
    const hash = btoa(loginData.password);
    if (loginData.username === ADMIN_USER && hash === ADMIN_PASSWORD_HASH) {
      setIsAdmin(true);
      setUI({ ...ui, login: false });
      setError("");
      setLoginData({ username: "", password: "" });
    } else {
      setError("❌ Identifiants incorrects");
    }
  };

  /* 🖼 Upload Image */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* ➕ Ajouter un produit */
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image)
      return setError("⚠️ Nom, prix et image obligatoires");

    const newItem = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
    };

    saveProducts([...products, newItem]);
    setNewProduct({ name: "", category: "football", price: "", image: "", description: "" });
    setUI({ ...ui, addProduct: false });
    setError("");
  };

  const handleDeleteProduct = (id) =>
    saveProducts(products.filter((p) => p.id !== id));

  const categories = {
    football: "⚽ Football",
    rugby: "🏉 Rugby",
    chaussettes: "🧦 Chaussettes Anti-Dérapantes",
  };

  /* 💎 UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 font-sans">

      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-600 w-10 h-10" />
            <h1 className="text-3xl font-black">CRAMPON DIRECT</h1>
          </div>

          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/cramponsdirect/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-full font-bold hover:scale-105 transition"
            >
              <Instagram className="w-5 h-5" /> Nous Contacter
            </a>

            {isAdmin ? (
              <>
                <button
                  onClick={() => setUI({ ...ui, addProduct: true })}
                  className="flex items-center gap-1 bg-green-600 px-4 py-2 text-white rounded-full font-bold"
                >
                  <Plus /> Ajouter
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="flex items-center gap-1 bg-red-600 px-4 py-2 text-white rounded-full font-bold"
                >
                  <LogOut /> Déconnexion
                </button>
              </>
            ) : (
              <ShieldCheck
                className="cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setUI({ ...ui, login: true })}
              />
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center text-white py-16 animate-fade-in">
        <h2 className="text-6xl font-black drop-shadow-xl mb-4">
          LES MEILLEURS CRAMPONS
        </h2>
        <p className="text-xl font-semibold opacity-90">
          Football • Rugby • Chaussettes Anti-Dérapantes
        </p>
      </section>

      {/* PRODUITS */}
      <section className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-xl hover:shadow-blue-500/40 overflow-hidden transition transform hover:-translate-y-2"
          >
            <img src={p.image} alt={p.name} className="h-64 w-full object-cover" />
            <div className="p-4">
              <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                {categories[p.category]}
              </span>
              <h3 className="text-2xl font-bold mt-2">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.description}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-3xl font-black text-blue-600">{p.price}€</span>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700"
                  >
                    <X />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!products.length && (
          <p className="col-span-full text-center text-white font-bold text-2xl opacity-80">
            Aucun produit disponible 😢
          </p>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center p-6 text-sm opacity-90">
        © 2025 - Crampon Direct. Contact via Instagram.
      </footer>

      {/* ✨ Modal Login + Modal Ajouter Produit à faire si tu veux aussi */}
    </div>
  );
}
