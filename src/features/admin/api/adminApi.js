import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

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

let mockDisputes = [
  {
    id: 1,
    item_id: 1,
    item_title: "Phone",
    claim_id: 10,
    claimant_name: "Jane Smith",
    reporter_name: "John Doe",
    reason: "Both parties claim ownership of the same phone. Claimant says it has a blue case, reporter says black case.",
    status: "open",
    created_at: "2026-03-22T10:00:00.000Z",
    updated_at: "2026-03-22T10:00:00.000Z",
    resolved_at: null,
    resolution_notes: null,
  },
  {
    id: 2,
    item_id: 3,
    item_title: "Wallet",
    claim_id: 12,
    claimant_name: "Michael Chen",
    reporter_name: "Sarah Lee",
    reason: "Claimant's verification details were rejected but they insist the item is theirs. Requesting admin review.",
    status: "open",
    created_at: "2026-03-20T14:30:00.000Z",
    updated_at: "2026-03-20T14:30:00.000Z",
    resolved_at: null,
    resolution_notes: null,
  },
  {
    id: 3,
    item_id: 2,
    item_title: "Backpack",
    claim_id: 8,
    claimant_name: "Alex Johnson",
    reporter_name: "Derek Page",
    reason: "Multiple claims on same item. Need admin to verify correct owner.",
    status: "resolved",
    created_at: "2026-03-15T09:00:00.000Z",
    updated_at: "2026-03-17T11:00:00.000Z",
    resolved_at: "2026-03-17T11:00:00.000Z",
    resolution_notes: "Verified ownership through student ID found inside backpack. Claim approved for Alex Johnson.",
  },
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
    pendingDisputes: 0,
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

async function mockListDisputes() {
  await delay(200);
  return [...mockDisputes];
}

async function mockResolveDispute(disputeId, notes) {
  await delay(200);
  const idx = mockDisputes.findIndex((d) => String(d.id) === String(disputeId));
  if (idx === -1) throw new Error("Dispute not found");
  mockDisputes[idx] = {
    ...mockDisputes[idx],
    status: "resolved",
    resolved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resolution_notes: notes,
  };
  return { ...mockDisputes[idx] };
}

//Real

async function realListDisputes() {
  return await http.get("/claims/escalated", { token: getToken() });
}

async function realResolveDispute(approvedClaimId, feedback) {
  return await http.post("/claims/resolve", { approved_claim_id: approvedClaimId, reporter_feedback: feedback }, { token: getToken() });
}

async function realGetDashboardMetrics() {
  return await http.get("/admin/stats", { token: getToken() });
}

async function realGetRecentActivity() {
  return await http.get("/admin/activity");
}

async function realListCategories() {
  return await http.get("/categories", { token: getToken() });
}

async function realAddCategory(payload) {
  return await http.post("/categories", payload, { token: getToken() });
}

async function realUpdateCategory(categoryId, payload) {
  return await http.put(`/categories/${categoryId}`, payload, { token: getToken() });
}

async function realDeactivateCategory(categoryId) {
  return await http.put(`/categories/${categoryId}`, { is_active: false }, { token: getToken() });
}

async function realActivateCategory(categoryId) {
  return await http.put(`/categories/${categoryId}`, { is_active: true }, { token: getToken() });
}

async function realListLocations() {
  return await http.get("/locations", { token: getToken() });
}

async function realAddLocation(payload) {
  return await http.post("/locations", payload, { token: getToken() });
}

async function realUpdateLocation(locationId, payload) {
  return await http.put(`/locations/${locationId}`, payload, { token: getToken() });
}

async function realDeactivateLocation(locationId) {
  return await http.put(`/locations/${locationId}`, { is_active: false }, { token: getToken() });
}

async function realActivateLocation(locationId) {
  return await http.put(`/locations/${locationId}`, { is_active: true }, { token: getToken() });
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

export async function listDisputes() {
  return USE_MOCK ? mockListDisputes() : realListDisputes();
}

export async function getDisputeById(disputeId) {
  if (USE_MOCK) {
    await delay(200);
    const dispute = mockDisputes.find((d) => String(d.id) === String(disputeId));
    if (!dispute) throw new Error("Dispute not found");
    return { ...dispute };
  }
  return http.get(`/claims/${disputeId}`, { token: getToken() });
}

export async function getClaimsForItem(itemId) {
  if (USE_MOCK) {
    await delay(200);
    // Return mock claims that match the item
    return [
      {
        id: 10,
        item_id: Number(itemId),
        claimant_name: "Jane Smith",
        verification_details: "The phone has a blue case and a cracked screen. My student ID wallpaper is on the lock screen.",
        status: "rejected",
        created_at: "2026-03-19T08:00:00.000Z",
      },
      {
        id: 11,
        item_id: Number(itemId),
        claimant_name: "Alex Torres",
        verification_details: "This is my phone. It has a black case with a sticker on the back and my photos inside.",
        status: "pending",
        created_at: "2026-03-20T14:00:00.000Z",
      },
    ];
  }
  return http.get(`/claims?item_id=${itemId}`, { token: getToken() });
}

export async function resolveDispute(disputeId, notes) {
  return USE_MOCK
    ? mockResolveDispute(disputeId, notes)
    : realResolveDispute(disputeId, notes);
}

export async function assignClaim(claimId, assignedToUserId) {
  if (USE_MOCK) {
    await delay(200);
    return { id: claimId, assigned_to_user_id: assignedToUserId };
  }
  return http.put(`/claims/${claimId}/assign`, { assigned_to_user_id: assignedToUserId }, { token: getToken() });
}
