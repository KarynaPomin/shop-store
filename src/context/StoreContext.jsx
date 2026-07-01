import { createContext, useContext, useMemo, useReducer } from 'react';

const StoreContext = createContext(null);

const initialState = {
  cart: [],
  wishlist: [],
  coupon: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(
        (item) => item.id === action.product.id && item.size === action.size && item.color === action.color,
      );

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item === existing ? { ...item, quantity: item.quantity + action.quantity } : item,
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...action.product, size: action.size, color: action.color, quantity: action.quantity }],
      };
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item, index) =>
          index === action.index ? { ...item, quantity: Math.max(1, action.quantity) } : item,
        ),
      };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((_, index) => index !== action.index) };
    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case 'SET_COUPON':
      return { ...state, coupon: action.coupon };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const subtotal = state.cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const discount = state.coupon.trim().toUpperCase() === 'STYLE10' ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount > 120 || subtotal === 0 ? 0 : 12;
  const total = subtotal - discount + shipping;

  const value = useMemo(
    () => ({ state, dispatch, subtotal, discount, shipping, total }),
    [state, subtotal, discount, shipping, total],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
