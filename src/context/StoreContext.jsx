import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

const StoreContext = createContext(null);

const STORAGE_KEY = 'shop-store';

const initialState = {
  cart: [],
  wishlist: [],
  coupon: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
  const cartId = `${action.product.id}-${action.size}-${action.color}`;

  const existing = state.cart.find(
    (item) => item.cartId === cartId
  );

  if (existing) {
    return {
      ...state,
      cart: state.cart.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + action.quantity }
          : item
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

    case 'UPDATE_QUANTITY':
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

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartId !== action.cartId),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };

    case 'SET_COUPON':
      return {
        ...state,
        coupon: action.coupon,
      };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
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

    const discountPercent =
      coupons[state.coupon.trim().toUpperCase()] || 0;

    const discount = subtotal * discountPercent;

    const shipping =
      subtotal === 0
        ? 0
        : subtotal - discount > 120
          ? 0
          : 12;

    const total = subtotal - discount + shipping;

    return {
      subtotal,
      discount,
      shipping,
      total,
    };
  }, [state.cart, state.coupon]);

  const addToCart = (product, size, color, quantity = 1) =>
    dispatch({
      type: 'ADD_TO_CART',
      product,
      size,
      color,
      quantity,
    });

  const updateQuantity = (cartId, quantity) =>
    dispatch({
      type: 'UPDATE_QUANTITY',
      cartId,
      quantity,
    });

  const removeFromCart = (cartId) =>
    dispatch({
      type: 'REMOVE_FROM_CART',
      cartId,
    });

  const toggleWishlist = (id) =>
    dispatch({
      type: 'TOGGLE_WISHLIST',
      id,
    });

  const setCoupon = (coupon) =>
    dispatch({
      type: 'SET_COUPON',
      coupon,
    });

  const clearCart = () =>
    dispatch({
      type: 'CLEAR_CART',
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
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}