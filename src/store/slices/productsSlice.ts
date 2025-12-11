import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, getImageUrl } from '../../services/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: 'jersey' | 'jaket' | 'aksesoris' | 'sparepart';
  stock: number;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (category?: string) => {
    const response = await productsAPI.getAll(category);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number) => {
  const response = await productsAPI.getById(id);
  return response.data;
});

export const createProduct = createAsyncThunk('products/create', async (formData: FormData) => {
  const response = await productsAPI.create(formData);
  return response.data;
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await productsAPI.update(id, formData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await productsAPI.delete(id);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map((product: Product) => ({
          ...product,
          image: product.image ? getImageUrl(product.image) : null,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const newProduct = {
          ...action.payload,
          image: action.payload.image ? getImageUrl(action.payload.image) : null,
        };
        state.products.unshift(newProduct);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = {
            ...action.payload,
            image: action.payload.image ? getImageUrl(action.payload.image) : null,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export default productsSlice.reducer;

