import apiClient from "./services";

export default {
  getCompanyDetails() {
    return apiClient.get("companies");
  },
  updateCompanyDetails(company) {
    return apiClient.put("companies/" + company.id, company);
  },
  addCustomer(customer) {
    return apiClient.post("customers", customer);
  },
  getCustomers() {
    return apiClient.get("customers");
  },
  deleteCustomer(id) {
    return apiClient.delete("customers/" + id);
  },
  updateCustomer(customer) { 
    return apiClient.put("customers/" + customer.id, customer);
  }
  

};
