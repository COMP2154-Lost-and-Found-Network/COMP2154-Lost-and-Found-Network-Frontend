import http from "../../../services/httpClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

let mockItems = [
  {
    id: 1,
    title: "Phone",
    type: "found",
    created_at: "2026-03-18T10:30:00.000Z",
    location_display_name: "St. James - Buliing 2",
  },
  {
    id: 2,
    title: "Backpack",
    type: "lost",
    created_at: "2026-03-17T14:10:00.000Z",
    location_display_name: "Casa Loma - Library",
  },
  {
    id: 3,
    title: "Wallet",
    type: "found",
    created_at: "2026-03-16T09:45:00.000Z",
    location_display_name: "Waterfront - Lobby",
  },
];

let mockClaims = [
  { id: 1, status: "pending" },
  { id: 2, status: "approved" },
  { id: 3, status: "pending" },
];

let mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Phones, laptops, tablets, chargers",
    is_active: false,
  },
  {
    id: 2,
    name: "Bags",
    description: "Backpacks, purses, luggage",
    is_active: true,
  },
  {
    id: 3,
    name: "Documents",
    description: "ID cards, passprots, papers",
    is_active: false,
  },
];

let mockLocations = [
  {
    id: 1,
    campus: "St. James",
    building_name: "A Building",
    room_number: "201",
    display_name: "St. James - A Building 201",
    is_active: true,
  },
  {
    id: 2,
    campus: "Casa Loma",
    building_name: "Library",
    room_number: "102",
    display_name: "Casa Loma - Library",
    is_active: true,
  },
  {
    id: 3,
    campus: "Online",
    building_name: "Virtual Office",
    room_number: "",
    display_name: "Online - Virtual Office",
    is_active: false,
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Mock

async function mockGetDashboardMetrics() {
  await delay(200);

  return {
    totalItems: mockItems.length,
    activeClaims: mockClaims.filter((claim) => claim.status === "pending").length,
  };
}

async function mockGetRecentActivity() {
  await delay(200);

  return [...mockItems]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
}

async function mockListCategories() {
  await delay(150);
  return [...mockCategories];
}

async function mockAddCategory(payload) {
  await delay(150);

  const newCategory = {
    id: mockCategories.length + 1,
    name: payload.name,
    description: payload.description || "",
    is_active: true,
  };

  mockCategories.push(newCategory);
  return { ...newCategory };
}

async function mockUpdateCategory(categoryId, payload) {
  await delay(150);

  const index = mockCategories.findIndex(
    (category) => String(category.id) === String(categoryId)
  );

  if (index === -1) {
    throw new Error("Category not found");
  }

  mockCategories[index] = {
    ...mockCategories[index],
    ...payload,
  };

  return { ...mockCategories[index] };
}

async function mockDeactivateCategory(categoryId) {
  await delay(150);

  const index = mockCategories.findIndex(
    (category) => String(category.id) === String(categoryId)
  );

  if (index === -1) {
    throw new Error("Category not found");
  }

  mockCategories[index] = {
    ...mockCategories[index],
    is_active: false,
  };

  return { ...mockCategories[index] };
}

async function mockActivateCategory(categoryId) {
  await delay(150);

  const index = mockCategories.findIndex(
    (category) => String(category.id) === String(categoryId)
  );

  if (index === -1) {
    throw new Error("Category not found");
  }

  mockCategories[index] = {
    ...mockCategories[index],
    is_active: true,
  };

  return { ...mockCategories[index] };
}

async function mockListLocations() {
  await delay(150);
  return [...mockLocations];
}

async function mockAddLocation(payload) {
  await delay(150);

  const newLocation = {
    id: mockLocations.length + 1,
    campus: payload.campus,
    building_name: payload.building_name,
    room_number: payload.room_number || "",
    display_name: payload.display_name,
    is_active: payload.is_active ?? true,
  };

  mockLocations.push(newLocation);
  return { ...newLocation };
}

async function mockUpdateLocation(locationId, payload) {
  await delay(150);

  const index = mockLocations.findIndex(
    (location) => String(location.id) === String(locationId)
  );

  if (index === -1) {
    throw new Error("Location not found");
  }

  mockLocations[index] = {
    ...mockLocations[index],
    ...payload,
  };

  return { ...mockLocations[index] };
}

async function mockDeactivateLocation(locationId) {
  await delay(150);

  const index = mockLocations.findIndex(
    (location) => String(location.id) === String(locationId)
  );

  if (index === -1) {
    throw new Error("Location not found");
  }

  mockLocations[index] = {
    ...mockLocations[index],
    is_active: false,
  };

  return { ...mockLocations[index] };
}

async function mockActivateLocation(locationId) {
  await delay(150);

  const index = mockLocations.findIndex(
    (location) => String(location.id) === String(locationId)
  );

  if (index === -1) {
    throw new Error("Location not found");
  }

  mockLocations[index] = {
    ...mockLocations[index],
    is_active: true,
  };

  return { ...mockLocations[index] };
}

//Real

async function realGetDashboardMetrics() {
  return await http.get("/admin/dashboard");
}

async function realGetRecentActivity() {
  return await http.get("/admin/activity");
}

async function realListCategories() {
  return await http.get("/admin/categories");
}

async function realAddCategory(payload) {
  return await http.post("/admin/categories", payload);
}

async function realUpdateCategory(categoryId, payload) {
  return await http.put(`/admin/categories/${categoryId}`, payload);
}

async function realDeactivateCategory(categoryId) {
  return await http.patch(`/admin/categories/${categoryId}/deactivate`);
}

async function realActivateCategory(categoryId) {
  return await http.patch(`/admin/categories/${categoryId}/activate`);
}

async function realListLocations() {
  return await http.get("/admin/locations");
}

async function realAddLocation(payload) {
  return await http.post("/admin/locations", payload);
}

async function realUpdateLocation(locationId, payload) {
  return await http.put(`/admin/locations/${locationId}`, payload);
}

async function realDeactivateLocation(locationId) {
  return await http.patch(`/admin/locations/${locationId}/deactivate`);
}

async function realActivateLocation(locationId) {
  return await http.patch(`/admin/locations/${locationId}/activate`);
}

//Public

export async function getDashboardMetrics() {
  return USE_MOCK ? mockGetDashboardMetrics() : realGetDashboardMetrics();
}

export async function getRecentActivity() {
  return USE_MOCK ? mockGetRecentActivity() : realGetRecentActivity();
}

export async function listCategories() {
  return USE_MOCK ? mockListCategories() : realListCategories();
}

export async function addCategory(payload) {
  return USE_MOCK ? mockAddCategory(payload) : realAddCategory(payload);
}

export async function updateCategory(categoryId, payload) {
  return USE_MOCK
    ? mockUpdateCategory(categoryId, payload)
    : realUpdateCategory(categoryId, payload);
}

export async function deactivateCategory(categoryId) {
  return USE_MOCK
    ? mockDeactivateCategory(categoryId)
    : realDeactivateCategory(categoryId);
}

export async function activateCategory(categoryId) {
  return USE_MOCK
    ? mockActivateCategory(categoryId)
    : realActivateCategory(categoryId);
}

export async function listLocations() {
  return USE_MOCK ? mockListLocations() : realListLocations();
}

export async function addLocation(payload) {
  return USE_MOCK ? mockAddLocation(payload) : realAddLocation(payload);
}

export async function updateLocation(locationId, payload) {
  return USE_MOCK
    ? mockUpdateLocation(locationId, payload)
    : realUpdateLocation(locationId, payload);
}

export async function deactivateLocation(locationId) {
  return USE_MOCK
    ? mockDeactivateLocation(locationId)
    : realDeactivateLocation(locationId);
}

export async function activateLocation(locationId) {
  return USE_MOCK
    ? mockActivateLocation(locationId)
    : realActivateLocation(locationId);
}
