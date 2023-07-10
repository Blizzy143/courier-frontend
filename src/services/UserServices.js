import apiClient from "./services";

export default {
  getUser() {
    return apiClient.get("users");
  },
  addUser(user) {
    return apiClient.post("users/", user);
  },
  loginUser(user) {
    return apiClient.post("auth/login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  logoutUser() {
    return apiClient.post("auth/logout");
  },
  getClerks() {
    return apiClient.get("users/clerk");
  },
  getCouriers() {
    return apiClient.get("users/courier");
  }
  
};
