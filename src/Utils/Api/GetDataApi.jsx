import api from "./CreateApi";

export const addData = async (key, formData) => {
  try {
    const response = await api.post(`/${key}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getData = async (key) => {
  try {
    const response = await api.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateData = async (key, Id, formData) => {
  try {
    const response = await api.patch(`/${key}/${Id}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteData = async (key, Id) => {
  try {
    const response = await api.delete(`/${key}/${Id}`);
    return response.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
