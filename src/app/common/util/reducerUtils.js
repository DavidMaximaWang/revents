export const createReducer = (initialSate, fnMap) => {
  return (state = initialSate, { type, payload }) => {
    const handler = fnMap[type];
    return handler ? handler(state, payload) : state;
  };
};
