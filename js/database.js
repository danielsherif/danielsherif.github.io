// Brew & Clay - Database Module

const BrewAndClayDB = (function () {
  // Product database (NoSQL-like structure)
  const products = [
    {
      id: "mug-001",
      name: "Classic White Mug",
      price: 24.99,
      description: "Minimalist design perfect for everyday use",
      category: "Minimalist Series",
      image: "../MugImages/1.png",
      featured: true,
      inStock: true,
    },
    {
      id: "mug-002",
      name: "Textured Grey Mug",
      price: 29.99,
      description: "Artisan finish with unique textured surface",
      category: "Artistic Collection",
      image: "../MugImages/2.png",
      featured: true,
      inStock: true,
    },
    {
      id: "mug-003",
      name: "Gold Accent Mug",
      price: 34.99,
      description: "Premium design with elegant gold accents",
      category: "Limited Editions",
      image: "../MugImages/3.JPG",
      featured: true,
      inStock: true,
    },
    {
      id: "mug-004",
      name: "Modern Black Mug",
      price: 27.99,
      description: "Sleek black design for the modern home",
      category: "Minimalist Series",
      image: "../MugImages/4.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-005",
      name: "Artisan Natural Mug",
      price: 32.99,
      description: "Handcrafted with natural textures and organic feel",
      category: "Artistic Collection",
      image: "../MugImages/5.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-006",
      name: "Geometric Pattern Mug",
      price: 31.99,
      description: "Bold geometric patterns for a contemporary look",
      category: "Artistic Collection",
      image: "../MugImages/6.jpg",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-007",
      name: "Blue Ceramic Mug",
      price: 26.99,
      description: "Vibrant blue ceramic with glossy finish",
      category: "Minimalist Series",
      image: "../MugImages/1.png",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-008",
      name: "Speckled Pottery Mug",
      price: 33.99,
      description: "Handmade pottery with natural speckled pattern",
      category: "Artistic Collection",
      image: "../MugImages/2.png",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-009",
      name: "Matte Black Mug",
      price: 29.99,
      description: "Sophisticated matte black finish with minimalist design",
      category: "Minimalist Series",
      image: "../MugImages/4.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-010",
      name: "Rustic Brown Mug",
      price: 28.99,
      description: "Earthy tones with rustic texture and feel",
      category: "Artistic Collection",
      image: "../MugImages/5.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-011",
      name: "Marble Pattern Mug",
      price: 36.99,
      description: "Elegant marble pattern with gold accents",
      category: "Limited Editions",
      image: "../MugImages/3.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-012",
      name: "Pastel Pink Mug",
      price: 25.99,
      description: "Soft pastel pink with smooth finish",
      category: "Minimalist Series",
      image: "../MugImages/6.jpg",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-013",
      name: "Handpainted Floral Mug",
      price: 39.99,
      description: "Unique handpainted floral design on white ceramic",
      category: "Artistic Collection",
      image: "../MugImages/1.png",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-014",
      name: "Copper Accent Mug",
      price: 37.99,
      description: "Modern design with copper accents and handle",
      category: "Limited Editions",
      image: "../MugImages/2.png",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-015",
      name: "Minimalist Gray Mug",
      price: 23.99,
      description: "Simple gray design for everyday use",
      category: "Minimalist Series",
      image: "../MugImages/4.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-016",
      name: "Textured Ceramic Mug",
      price: 30.99,
      description: "Unique textured surface with organic patterns",
      category: "Artistic Collection",
      image: "../MugImages/5.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-017",
      name: "Silver Rim Mug",
      price: 35.99,
      description: "Elegant white mug with silver rim detail",
      category: "Limited Editions",
      image: "../MugImages/3.JPG",
      featured: false,
      inStock: true,
    },
    {
      id: "mug-018",
      name: "Geometric Blue Mug",
      price: 32.99,
      description: "Modern blue mug with geometric patterns",
      category: "Artistic Collection",
      image: "../MugImages/6.jpg",
      featured: false,
      inStock: true,
    },
  ];

  // Collections database
  const collections = [
    {
      id: "col-001",
      name: "Minimalist Series",
      description: "Clean lines and simple designs for the modern home",
    },
    {
      id: "col-002",
      name: "Artistic Collection",
      description: "Unique patterns and textures for the creative spirit",
    },
    {
      id: "col-003",
      name: "Limited Editions",
      description: "Exclusive designs available for a limited time only",
    },
    {
      id: "col-004",
      name: "New Arrivals",
      description: "Our latest designs fresh from the kiln",
    },
  ];

  // Get all products
  const getAllProducts = () => {
    return [...products];
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find((product) => product.id === id) || null;
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured);
  };

  // Search products
  const searchProducts = (query) => {
    const searchTerm = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  };

  // Get all collections
  const getAllCollections = () => {
    return [...collections];
  };

  // Get collection by ID
  const getCollectionById = (id) => {
    return collections.find((collection) => collection.id === id) || null;
  };

  // Public API
  return {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    getAllCollections,
    getCollectionById,
  };
})();

// Make the database available globally
window.BrewAndClayDB = BrewAndClayDB;
