import axios from "axios";
import authHeader from "./auth-header"; // Utility for JWT header

const API_URL = "http://localhost:8080/api/products/";

const getAllProducts = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createProduct = (productData) => {
    return axios.post(API_URL, productData, { headers: authHeader() });
};

const updateProduct = (id, productData) => {
    return axios.put(API_URL + id, productData, { headers: authHeader() });
};

const deleteProduct = (id) => {
    return axios.delete(API_URL + id, { headers: authHeader() });
};

const ProductService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default ProductService;
