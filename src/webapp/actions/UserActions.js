import {
  REQ_GET_USERS,
  REQ_GET_USER,
  REQ_GET_USER_ME,
  REQ_GET_USER_USER_INFO,
  REQ_GET_USER_ADMIN_INFO,
  REQ_POST_USER_REGISTER,
  REQ_POST_USER_LOGIN,
  REQ_POST_USER_LOGOUT,
  REQ_POST_USER_RESET_PASSWORD,
  REQ_DEL_USER
} from './types';

export default {
  getUser(query) {
    return {
      type: REQ_GET_USER,
      promise: apiClient => apiClient.get('/user', {
        query: {
          query
        }
      })
    };
  },

  getUsers() {
    return {
      type: REQ_GET_USERS,
      promise: apiClient => apiClient.get('/userS')
    };
  },

  me() {
    return {
      type: REQ_GET_USER_ME,
      promise: (apiClient) => apiClient.get('/user/me')
    };
  },

  userInfo() {
    return {
      type: REQ_GET_USER_USER_INFO,
      promise: (apiClient) => apiClient.get('/user/userInfo')
    };
  },

  adminInfo() {
    return {
      type: REQ_GET_USER_ADMIN_INFO,
      promise: (apiClient) => apiClient.get('/user/adminInfo')
    };
  },

  register(user) {
    return {
      type: REQ_POST_USER_REGISTER,
      promise: (apiClient) => apiClient.post('/user/register', {
        body: {
          ...user
        }
      })
    };
  },

  login(user, isAdmin = false) {
    let loginUrl;
    if (isAdmin) {
      loginUrl = '/user/adminLogin';
    } else {
      loginUrl = '/user/login';
    }
    return {
      type: REQ_POST_USER_LOGIN,
      promise: (apiClient) => apiClient.post(loginUrl, {
        body: {
          ...user
        }
      })
    };
  },

  logout() {
    return {
      type: REQ_POST_USER_LOGOUT,
      promise: (apiClient) => apiClient.post('/user/logout')
    };
  },

  resetPassword({ email }) {
    return {
      type: REQ_POST_USER_RESET_PASSWORD,
      promise: (apiClient) => apiClient.post('/user/resetPassword', {
        body: {
          email
        }
      })
    };
  },

  deleteUser(userId) {
    return {
      type: REQ_DEL_USER,
      promise: apiClient => apiClient.delete(`/user/${userId}`),
      payload: userId
    };
  }
};
