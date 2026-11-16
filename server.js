
import express from "express";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Temporary in-memory product storage
let products = [
  { id: 1, name: "Laptop", price: 55000 },
  { id: 2, name: "Mobile", price: 20000 }
];

// Home route
app.get("/", (req, res) => {
  res.send("Product API is running successfully!");
});

// 1. GET all products
app.get("/products", (req, res) => {
  res.status(200).json({
    message: "All products fetched successfully",
    data: products
  });
});

// 2. GET a single product by ID
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.status(200).json({
    message: "Product found",
    data: product
  });
});

// 3. POST - Add a new product
app.post("/products", (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined || Number(price) <= 0 || !Number.isFinite(Number(price))) {
    return res.status(400).json({
      message: "Please provide a valid product name and price"
    });
  }

  const newProduct = {
    id: products.length
      ? Math.max(...products.map(p => p.id)) + 1
      : 1,
    name,
    price: Number(price)
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    data: newProduct
  });
});

// 4. PUT - Update a product
app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const { name, price } = req.body;

  if (name !== undefined) product.name = name;

  if (price !== undefined) {
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a valid positive number"
      });
    }
    product.price = Number(price);
  }

  res.status(200).json({
    message: "Product updated successfully",
    data: product
  });
});

// 5. DELETE - Delete a product
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    message: "Product deleted successfully",
    data: deletedProduct
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
