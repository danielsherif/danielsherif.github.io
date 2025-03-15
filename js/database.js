// Brew & Clay - Database Module

const BrewAndClayDB = (function() {
    // Product database (NoSQL-like structure)
    const products = [
        {
            id: 'mug-001',
            name: 'Classic White Mug',
            price: 24.99,
            description: 'Minimalist design perfect for everyday use',
            category: 'Minimalist Series',
            image: '../MugImages/1.png',
            featured: true,
            inStock: true
        },
        {
            id: 'mug-002',
            name: 'Textured Grey Mug',
            price: 29.99,
            description: 'Artisan finish with unique textured surface',
            category: 'Artistic Collection',
            image: '../MugImages/2.png',
            featured: true,
            inStock: true
        },
        {
            id: 'mug-003',
            name: 'Gold Accent Mug',
            price: 34.99,
            description: 'Premium design with elegant gold accents',
            category: 'Limited Editions',
            image: '../MugImages/3.JPG',
            featured: true,
            inStock: true
        },
        {
            id: 'mug-004',
            name: 'Modern Black Mug',
            price: 27.99,
            description: 'Sleek black design for the modern home',
            category: 'Minimalist Series',
            image: '../MugImages/4.JPG',
            featured: false,
            inStock: true
        },
        {
            id: 'mug-005',
            name: 'Artisan Natural Mug',
            price: 32.99,
            description: 'Handcrafted with natural textures and organic feel',
            category: 'Artistic Collection',
            image: '../MugImages/5.JPG',
            featured: false,
            inStock: true
        },
        {
            id: 'mug-006',
            name: 'Geometric Pattern Mug',
            price: 31.99,
            description: 'Bold geometric patterns for a contemporary look',
            category: 'Artistic Collection',
            image: '../MugImages/6.jpg',
            featured: false,
            inStock: true
        }
    ];

    // Collections database
    const collections = [
        {
            id: 'col-001',
            name: 'Minimalist Series',
            description: 'Clean lines and simple designs for the modern home'
        },
        {
            id: 'col-002',
            name: 'Artistic Collection',
            description: 'Unique patterns and textures for the creative spirit'
        },
        {
            id: 'col-003',
            name: 'Limited Editions',
            description: 'Exclusive designs available for a limited time only'
        },
        {
            id: 'col-004',
            name: 'New Arrivals',
            description: 'Our latest designs fresh from the kiln'
        }
    ];

    // Get all products
    const getAllProducts = () => {
        return [...products];
    };

    // Get product by ID
    const getProductById = (id) => {
        return products.find(product => product.id === id) || null;
    };

    // Get products by category
    const getProductsByCategory = (category) => {
        return products.filter(product => product.category === category);
    };

    // Get featured products
    const getFeaturedProducts = () => {
        return products.filter(product => product.featured);
    };

    // Search products
    const searchProducts = (query) => {
        const searchTerm = query.toLowerCase();
        return products.filter(product => 
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
        return collections.find(collection => collection.id === id) || null;
    };

    // Public API
    return {
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        searchProducts,
        getAllCollections,
        getCollectionById
    };
})();

// Make the database available globally
window.BrewAndClayDB = BrewAndClayDB;