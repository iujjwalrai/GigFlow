import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Submit bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async ({ gigId, message, price }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/bids`,
        { gigId, message, price },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
    }
  }
);

// Get bids for a gig
export const fetchBids = createAsyncThunk(
  'bids/fetchBids',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/bids/${gigId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

// Get my bids (all bids by the authenticated user)
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/bids/my-bids`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my bids');
    }
  }
);

// Hire freelancer
export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBids: (state) => {
      state.bids = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bids
      .addCase(fetchBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        // Update bids with the complete list from server
        // This ensures all rejected bids are properly marked
        if (action.payload.allBids) {
          state.bids = action.payload.allBids;
        } else {
          // Fallback: update individual bid if allBids not provided
          const bidIndex = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
          if (bidIndex !== -1) {
            state.bids[bidIndex] = action.payload.bid;
          }
          // Update rejected bids by comparing gigId
          const gigId = action.payload.bid.gigId?._id || action.payload.bid.gigId;
          state.bids = state.bids.map(bid => {
            const bidGigId = bid.gigId?._id || bid.gigId;
            if (bidGigId && gigId && bidGigId.toString() === gigId.toString() && bid._id !== action.payload.bid._id) {
              return { ...bid, status: 'rejected' };
            }
            return bid;
          });
        }
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBids, clearError } = bidSlice.actions;
export default bidSlice.reducer;

