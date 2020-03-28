export const SET_USER_ID = 'SET_USER_ID';
export const SET_USER_LIST = 'SET_USER_LIST';

export default {
  namespaced: true,
  
  state: {
    userId: null,
    userList: [
    ],
  },
  getters: {
    
  },
  mutations: {
    [SET_USER_ID](state, userId) {
      state.userId = userId;
    },
    [SET_USER_LIST](state, userList) {
      state.userList = userList;
    },
  },
  actions: {

  },
};
