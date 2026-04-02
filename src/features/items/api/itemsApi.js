import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

function mapItem(item) {
  return { ...item, imageUrl: item.image_url ?? null };
}

async function listItems() {
  const res = await http.get("/items", { token: getToken() });
  const items = Array.isArray(res) ? res : res?.data ?? [];
  return items.map(mapItem);
}

async function listMyItems() {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const userId = user?.id;
  const res = await http.get(`/items?user_id=${userId}`, { token: getToken() });
  const items = Array.isArray(res) ? res : res?.data ?? [];
  return items.map(mapItem);
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
      throw new Error("We couldn't upload your image right now. Please try again or submit without an image.");
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
      throw new Error("We couldn't upload your image right now. Please try again or submit without an image.");
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
