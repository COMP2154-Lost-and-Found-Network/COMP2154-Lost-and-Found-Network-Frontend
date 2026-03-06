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