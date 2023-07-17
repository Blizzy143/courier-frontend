import apiClient from "./services";

export default {
  getTickets() {
    return apiClient.get("tickets");
  },
  getClerkTickets() {
    return apiClient.get("tickets/clerk");
  }  ,
  getCourierTickets() {
    return apiClient.get("tickets/courier");
  },
  getTicket(id) {
    return apiClient.get("tickets/" + id);
  },
  addTicket(ticket) {
    return apiClient.post("tickets/", ticket);
  },
  updateTicket(ticket) {
    return apiClient.put("tickets/" + ticket.id, ticket);
  },
  deleteTicket(id) {
    return apiClient.delete("tickets/" + id);
  },

  getCourierTickets(id) {
    return apiClient.get("tickets/courier/" + id);
  }
  

};
