import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

function mapItem(item) {
  return { ...item, imageUrl: item.image_url ?? null };
}

async function listItems() {
  const items = await http.get("/items", { token: getToken() });
  return (items ?? []).map(mapItem);
}

async function listMyItems() {
  const items = await http.get("/items/my-items", { token: getToken() });
  return (items ?? []).map(mapItem);
}

async function getItemById(id) {
  const item = await http.get(`/items/${id}`, { token: getToken() });
  return mapItem(item);
}

async function updateItem(id, updatedFields) {
  const payload = { ...updatedFields };
  delete payload.imageFile;

  if (updatedFields.imageFile) {
    const formData = new FormData();
    formData.append("image", updatedFields.imageFile);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const uploadRes = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadData.error || "Image upload failed");
    }
    payload.image_url = uploadData.url;
  }

  return await http.put(`/items/${id}`, payload, { token: getToken() });
}

async function softDeleteItem(id) {
  return await http.delete(`/items/${id}`, { token: getToken() });
}

async function createItem(data) {
  let image_url = null;

  if (data.image) {
    const formData = new FormData();
    formData.append("image", data.image);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const uploadRes = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadData.error || "Image upload failed");
    }
    image_url = uploadData.url;
  }

  return await http.post(
    "/items",
    {
      user_id: data.user_id,
      category_id: data.category_id,
      location_id: data.location_id,
      title: data.title,
      description: data.description,
      date: data.date,
      type: data.type?.toLowerCase(),
      location_details: data.location_details || null,
      image_url,
    },
    { token: getToken() }
  );
}

export {
  listItems,
  listMyItems,
  getItemById,
  updateItem,
  softDeleteItem,
  createItem,
};
