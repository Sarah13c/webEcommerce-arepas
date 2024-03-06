const initialState = {
    username: null,
  };
  
  export const setUser = (username) => {
    return {
      type: 'SET_USER',
      payload: username,
    };
  };
  
  export const clearUser = () => {
    return {
      type: 'CLEAR_USER',
    };
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          username: action.payload,
        };
      case 'CLEAR_USER':
        return {
          ...state,
          username: null,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  