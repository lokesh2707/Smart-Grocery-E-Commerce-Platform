// Product Image Mapping
// Maps product names and categories to image paths

const productImageMap = {
  // Fruits
  'apple': '/images/products/apple.svg',
  'banana': '/images/products/banana.svg',
  'orange': '/images/products/orange.svg',
  
  // Vegetables
  'carrot': '/images/products/carrot.svg',
  'tomato': '/images/products/tomato.svg',
  
  // Dairy & Bakery
  'milk': '/images/products/milk.svg',
  'bread': '/images/products/bread.svg',
  'cheese': '/images/products/cheese.svg',
  'honey': 'https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_640.jpg',
  
  // Meat & Proteins
  'chicken': '/images/products/chicken.svg',
  
  // Grains
  'rice': '/images/products/rice.svg',
};

const categoryImageMap = {
  'Fruits': '/images/categories/fruits.svg',
  'Vegetables': '/images/categories/vegetables.svg',
  'Dairy': '/images/categories/dairy.svg',
  'Meat': '/images/categories/meat.svg',
  'Grains': '/images/categories/grains.svg',
  'Bakery': '/images/categories/grains.svg',
};

/**
 * Get product image by name
 */
export const getProductImage = (productName) => {
  if (!productName) return null;
  const normalizedName = productName.toLowerCase().trim();
  
  if (productImageMap[normalizedName]) {
    return productImageMap[normalizedName];
  }
  
  for (const [key, value] of Object.entries(productImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  return null;
};

/**
 * Get category image
 */
export const getCategoryImage = (category) => {
  if (!category) return null;
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  return categoryImageMap[normalizedCategory] || null;
};

/**
 * Attach image to product
 */
export const enrichProductWithImage = (product) => {
  if (!product.image) {
    const mappedImage = getProductImage(product.name);
    if (mappedImage) {
      return { ...product, image: mappedImage };
    }
  }
  return product;
};

/**
 * ✅ FIX: Named default export (no ESLint warnings)
 */
const imageMapping = {
  productImageMap,
  categoryImageMap,
  getProductImage,
  getCategoryImage,
  enrichProductWithImage,
};

export default imageMapping;