import apiClient from "./services";

export default {
  getCompanyDetails() {
    return apiClient.get("companies");
  },
  updateCompanyDetails(company) {
    return apiClient.put("companies/" + company.id, company);
  }
};
