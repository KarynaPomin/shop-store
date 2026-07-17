import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useAuth } from "./AuthContext";
import { makeRequest } from "../makeRequest";

const StoreContext = createContext(null);

const STORAGE_KEY = "shop-store";

const initialState = {
  cart: [],
  wishlist: [],
  coupon: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const cartId = `${action.product.id}-${action.size}-${action.color}`;

      const existing = state.cart.find((item) => item.cartId === cartId);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.cartId === cartId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            cartId,
            id: action.product.id,
            name: action.product.name,
            price: action.product.price,
            salePrice: action.product.salePrice,
            images: action.product.images,
            size: action.size,
            color: action.color,
            quantity: action.quantity,
          },
        ],
      };
    }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartId === action.cartId
            ? {
                ...item,
                quantity: Math.max(1, action.quantity),
              }
            : item,
        ),
      };

    case "SET_CART":
      return {
        ...state,
        cart: action.cart,
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartId !== action.cartId),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "TOGGLE_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.wishlist,
      };

    case "SET_COUPON":
      return {
        ...state,
        coupon: action.coupon,
      };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getCart();
      getFavorites();
    }
  }, [user]);

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialState,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const cartTotals = useMemo(() => {
    const subtotal = state.cart.reduce(
      (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
      0,
    );

    const coupons = {
      STYLE10: 0.1,
    };

    const discountPercent = coupons[state.coupon.trim().toUpperCase()] || 0;

    const discount = subtotal * discountPercent;

    const shipping = subtotal === 0 ? 0 : subtotal - discount > 120 ? 0 : 12;

    const total = subtotal - discount + shipping;

    return {
      subtotal,
      discount,
      shipping,
      total,
    };
  }, [state.cart, state.coupon]);

  const getCart = async () => {
    if (!user) return;

    const res = await makeRequest.get(`/users/${user.id}`, {
      params: {
        populate: {
          cart_items: {
            populate: {
              product: {
                populate: ["images"],
              },
            },
          },
        },
      },
    });

    dispatch({
      type: "SET_CART",
      cart: res.data.cart_items.map((item) => ({
        cartId: item.documentId,
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        salePrice: item.product.salePrice,
        images: item.product.images,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
    });
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    if (!user) {
      dispatch({ type: "ADD_TO_CART", product, size, color, quantity });
      return;
    }

    const existing = state.cart.find(
      (item) =>
        item.id === product.id && item.size === size && item.color === color,
    );

    if (existing) {
      await makeRequest.put(`/cart-items/${existing.cartId}`, {
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await makeRequest.post(`/cart-items`, {
        data: { user: user.id, product: product.id, quantity, size, color },
      });
    }

    getCart();
  };

  const removeFromCart = async (cartId) => {
    if (!user) {
      dispatch({ type: "REMOVE_FROM_CART", cartId });
      return;
    }

    await makeRequest.delete(`/cart-items/${cartId}`);
    getCart();
  };

  const updateQuantity = (cartId, quantity) =>
    dispatch({
      type: "UPDATE_QUANTITY",
      cartId,
      quantity,
    });

  const getFavorites = async () => {
    if (!user) return;

    const res = await makeRequest.get(
      `/users/${user.id}?populate=favorite_items`,
    );

    dispatch({
      type: "SET_WISHLIST",
      wishlist: res.data.favorite_items.map((p) => p.id),
    });
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      dispatch({ type: "TOGGLE_WISHLIST", id: productId });
      return;
    }

    const exists = state.wishlist.includes(productId);
    const updated = exists
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId];

    await makeRequest.put(`/users/${user.id}`, {
      favorite_items: updated,
    });

    dispatch({ type: "SET_WISHLIST", wishlist: updated });
  };

  const setCoupon = (coupon) =>
    dispatch({
      type: "SET_COUPON",
      coupon,
    });

  const clearCart = () =>
    dispatch({
      type: "CLEAR_CART",
    });

  const value = useMemo(
    () => ({
      state,

      cartTotals,

      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      setCoupon,
      clearCart,
    }),
    [state, cartTotals],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
