import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";


//MOCK VERSION
let mockItems = [
  {
    id: "1",
    title: "Phone",
    description: "Black phone found near the library entrance",
    location: "Library entrance, near the benches",
    date: "2026-03-15",
    status: "ACTIVE",
    imageUrl: "",
  },
  {
    id: "2",
    title: "Backpack",
    description: "Black backpack found in the cafeteria, contains notebooks",
    location: "Student Center cafeteria",
    date: "2026-03-01",
    status: "ACTIVE",
    imageUrl: "",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockListItems() {
  await delay(250);
  return [...mockItems];
}

async function mockGetItemById(id) {
  await delay(200);

  const item = mockItems.find((item) => item.id === id);

  if (!item) {
    throw new Error("Item not found");
  }

  return { ...item };
}

async function mockUpdateItem(id, updatedFields) {
  await delay(250);

  const index = mockItems.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Item not found");
  }

  mockItems[index] = {
    ...mockItems[index],
    ...updatedFields,
  };

  return { ...mockItems[index] };
}

async function mockSoftDeleteItem(id) {
  await delay(200);

  const index = mockItems.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Item not found");
  }

  //Mock soft delete: for now just mark as archived
  mockItems[index] = {
    ...mockItems[index],
    status: "ARCHIVED",
  };

  return { ...mockItems[index] };
}

//REAL VERSION

function mapItem(item) {
  return { ...item, imageUrl: item.image_url ?? null };
}

async function realListItems() {
  const items = await http.get("/items", { token: getToken() });
  return items.map(mapItem);
}

async function realGetItemById(id) {
  const item = await http.get(`/items/${id}`, { token: getToken() });
  return mapItem(item);
}

async function realUpdateItem(id, updatedFields) {
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
    if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
    payload.image_url = uploadData.url;
  }

  return await http.put(`/items/${id}`, payload, { token: getToken() });
}

async function realSoftDeleteItem(id) {
  return await http.delete(`/items/${id}`, { token: getToken() });
}

async function mockCreateItem(data) {
  await delay(300);
  const newItem = {
    id: String(mockItems.length + 1),
    title: data.title || "Lost Item",
    description: data.description,
    category: data.category,
    campus: data.campus,
    location: data.location || "",
    date: data.date,
    status: "ACTIVE",
    imageUrl: data.image ? URL.createObjectURL(data.image) : "",
  };
  mockItems.push(newItem);
  return { ...newItem };
}

async function realCreateItem(data) {
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
    if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
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

//Public

export async function listItems() {
  return USE_MOCK ? mockListItems() : realListItems();
}

export async function getItemById(id) {
  return USE_MOCK ? mockGetItemById(id) : realGetItemById(id);
}

export async function updateItem(id, updatedFields) {
  return USE_MOCK
    ? mockUpdateItem(id, updatedFields)
    : realUpdateItem(id, updatedFields);
}

export async function softDeleteItem(id) {
  return USE_MOCK
    ? mockSoftDeleteItem(id)
    : realSoftDeleteItem(id);
}

export async function createItem(data) {
  return USE_MOCK ? mockCreateItem(data) : realCreateItem(data);
}