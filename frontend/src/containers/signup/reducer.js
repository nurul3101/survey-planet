import ActionTypes from './constant.js'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || {},
}

export default (state = initialState, payload) => {
  switch (payload.type) {
    case ActionTypes.FetchUserInfo:
      return { ...state, user: payload.user }
    default:
      return state
  }
}
