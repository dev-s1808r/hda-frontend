import { api } from "../instance";

export const assignFoldersToUser = async (data) => {
  try {
    const response = await api.post("/assign-folder", data);
    return response.data; // Return the API response
  } catch (error) {
    console.log("Error assigning folders:", error);
    throw error.response?.data || error.message; // Throw error for the caller to handle
  }
};
