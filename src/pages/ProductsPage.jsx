import React, { useState } from "react";
import { motion } from "framer-motion";

const ProductsPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const products = [
    {
      id: 1,
      name: "Neem Oil Spray",
      description:
        "Organic neem oil for controlling fungal and bacterial leaf diseases.",
      price: "₹250",
      image: "",
      category: "Organic",
    },
    {
      id: 2,
      name: "Bio Fungicide",
      description:
        "Eco-friendly bio fungicide to protect against common Gymnema leaf blights.",
      price: "₹400",
      image: "",
      category: "Bio-Control",
    },
    {
      id: 3,
      name: "Trichoderma Bio-Control",
      description:
        "Beneficial fungi-based solution to suppress soil-borne leaf diseases.",
      price: "₹350",
      image: "",
      category: "Bio-Control",
    },
    {
      id: 4,
      name: "Copper Oxychloride",
      description:
        "Effective broad-spectrum fungicide for preventing and treating various leaf spots.",
      price: "₹300",
      image: "",
      category: "Chemical",
    },
    {
      id: 5,
      name: "Compost Tea",
      description:
        "Nutrient-rich organic tea that boosts plant immunity and soil health.",
      price: "₹200",
      image: "",
      category: "Organic",
    },
    {
      id: 6,
      name: "Seaweed Extract",
      description:
        "Natural growth stimulant that enhances stress resistance and nutrient uptake.",
      price: "₹320",
      image: "",
      category: "Organic",
    },
  ];

  const categories = ["All", "Organic", "Bio-Control", "Chemical"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Show a brief confirmation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "Added!";
    button.classList.add("btn-success");
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("btn-success");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Page Header */}
      <motion.header
        className="py-5 bg-success text-white text-center rounded-4 mb-5"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <motion.h1
            className="fw-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🛒 Our Products
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Solutions for Gymnema Sylvestre Leaf Health
          </motion.p>
        </div>
      </motion.header>

      {/* Category Filter */}
      <motion.div
        className="container mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`btn ${
                selectedCategory === category
                  ? "btn-success"
                  : "btn-outline-success"
              } rounded-pill px-4`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        className="container py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="row g-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              className="col-md-4"
              key={product.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="card product-card shadow-sm h-100 border-0 rounded-3">
                <div
                  className="card-img-top product-img bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "200px", borderRadius: "15px 15px 0 0" }}
                >
                  <i
                    className="bi bi-box-seam text-success"
                    style={{ fontSize: "4rem" }}
                  ></i>
                  <span className="position-absolute top-0 start-0 m-3 badge bg-success">
                    {product.category}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-success fw-bold">
                    {product.name}
                  </h5>
                  <p className="card-text text-muted flex-grow-1">
                    {product.description}
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-success fs-5">
                        {product.price}
                      </span>
                      <motion.button
                        className="btn btn-outline-success btn-sm rounded-pill"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          className="card border-0 shadow rounded-4 mt-5"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="card-body">
            <h3 className="text-success text-center mb-4">
              🌿 Why Choose Our Products?
            </h3>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <i
                  className="bi bi-shield-check text-success"
                  style={{ fontSize: "2.5rem" }}
                ></i>
                <h5 className="mt-3">Eco-Friendly</h5>
                <p className="text-muted">
                  Safe for environment and beneficial insects
                </p>
              </div>
              <div className="col-md-4 mb-4">
                <i
                  className="bi bi-stars text-success"
                  style={{ fontSize: "2.5rem" }}
                ></i>
                <h5 className="mt-3">Scientifically Proven</h5>
                <p className="text-muted">
                  Tested and verified by agricultural experts
                </p>
              </div>
              <div className="col-md-4 mb-4">
                <i
                  className="bi bi-lightning text-success"
                  style={{ fontSize: "2.5rem" }}
                ></i>
                <h5 className="mt-3">Fast Acting</h5>
                <p className="text-muted">Visible results in 7-14 days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          className="card border-0 shadow rounded-4 mt-5 bg-light"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="card-body">
            <h3 className="text-success text-center mb-4">
              💬 What Farmers Say
            </h3>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <p className="text-muted fst-italic">
                    "These products saved my Gymnema crop from severe fungal
                    infection. Highly recommended!"
                  </p>
                  <p className="fw-bold mb-0">- Ramesh Kumar, Karnataka</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <p className="text-muted fst-italic">
                    "The organic solutions worked wonders without harming my
                    soil quality. Great results!"
                  </p>
                  <p className="fw-bold mb-0">- Priya Sharma, Tamil Nadu</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <p className="text-muted fst-italic">
                    "Fast delivery and excellent customer support. Will
                    definitely order again."
                  </p>
                  <p className="fw-bold mb-0">- Anil Patel, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .product-card {
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        .product-img {
          height: 200px;
          object-fit: cover;
          position: relative;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductsPage;
