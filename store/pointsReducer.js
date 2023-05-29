const initialState = {
  points: 0,
};

const pointsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT_POINTS":
      return {
        ...state,
        points: state.points + action.payload,
      };
    default:
      return state;
  }
};

export default pointsReducer;
