import http from "../../../services/httpClient";

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

async function realListItems() {
  return await http.get("/items");
}

async function realGetItemById(id) {
  return await http.get(`/items/${id}`);
}

async function realUpdateItem(id, updatedFields) {
  return await http.put(`/items/${id}`, updatedFields);
}

async function realSoftDeleteItem(id) {
  return await http.patch(`/items/${id}/soft-delete`);
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
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("description", data.description);
  formData.append("date", data.date);
  formData.append("campus", data.campus);
  if (data.location) formData.append("location", data.location);
  formData.append("type", data.type || "LOST");
  if (data.image) {
    formData.append("image", data.image);
  }

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    body: formData,
  });

  let responseData = null;
  try {
    responseData = await res.json();
  } catch {
    // ignore non-JSON
  }

  if (!res.ok) {
    const msg = responseData?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return responseData;
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