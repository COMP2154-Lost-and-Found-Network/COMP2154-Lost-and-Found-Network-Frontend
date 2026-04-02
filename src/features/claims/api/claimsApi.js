import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

let mockClaims = [
  {
    id: 1,
    item_id: 1,
    claimant_id: 2,
    item_title: "Phone",
    verification_details:
      "this is my phone. It has a cracked screen and a blue case",
    status: "pending",
    reporter_feedback: null,
    contact_shared_at: null,
    created_at: "2026-03-18T12:00:00.000Z",
    updated_at: "2026-03-18T12:00:00.000Z",
    reviewed_at: null,
  },
  {
    id: 2,
    item_id: 2,
    claimant_id: 2,
    item_title: "Backpack",
    verification_details:
      "This may be my backpack. It should contain a math notebook and a charger",
    status: "rejected",
    reporter_feedback:
      "The item contents and identifying details did not match what was reported",
    contact_shared_at: null,
    created_at: "2026-03-12T09:30:00.000Z",
    updated_at: "2026-03-13T15:45:00.000Z",
    reviewed_at: "2026-03-13T15:45:00.000Z",
  },
  {
    id: 3,
    item_id: 3,
    claimant_id: 1,
    item_title: "Wallet",
    verification_details:
      "Brown leather wallet with student card and TTC card inside",
    status: "approved",
    reporter_feedback: null,
    contact_shared_at: "2026-03-14T11:00:00.000Z",
    created_at: "2026-03-10T08:00:00.000Z",
    updated_at: "2026-03-14T11:00:00.000Z",
    reviewed_at: "2026-03-14T09:00:00.000Z",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockSubmitClaim(itemId, data, userId) {
  await delay(300);
  const newClaim = {
    id: mockClaims.length + 1,
    item_id: Number(itemId),
    claimant_id: userId,
    item_title: `Item #${itemId}`,
    verification_details: data.verification_details,
    status: "pending",
    reporter_feedback: null,
    contact_shared_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reviewed_at: null,
  };
  mockClaims.push(newClaim);
  return { ...newClaim };
}

//Mock data

async function mockListMyClaims(userId) {
  await delay(200);
  return mockClaims.filter((claim) => claim.claimant_id === userId);
}

async function mockGetMyClaimById(claimId, userId) {
  await delay(150);

  const claim = mockClaims.find(
    (c) => String(c.id) === String(claimId) && c.claimant_id === userId
  );

  if (!claim) {
    throw new Error("Claim not found");
  }

  return { ...claim };
}

async function mockWithdrawClaim(claimId, userId) {
  await delay(150);

  const index = mockClaims.findIndex(
    (c) => String(c.id) === String(claimId) && c.claimant_id === userId
  );

  if (index === -1) {
    throw new Error("Claim not found");
  }

  mockClaims[index] = {
    ...mockClaims[index],
    status: "withdrawn",
    updated_at: new Date().toISOString(),
  };

  return { ...mockClaims[index] };
}

//Real data

async function realListMyClaims(userId) {
  return await http.get(`/claims?claimant_id=${userId}`, { token: getToken() });
}

async function realGetMyClaimById(claimId) {
  return await http.get(`/claims/${claimId}`, { token: getToken() });
}

async function realWithdrawClaim(claimId) {
  return await http.delete(`/claims/${claimId}/withdraw`, { token: getToken() });
}

async function realSubmitClaim(itemId, data) {
  return await http.post("/claims", { item_id: Number(itemId), ...data }, { token: getToken() });
}

//Public

export async function listMyClaims(userId) {
  return USE_MOCK ? mockListMyClaims(userId) : realListMyClaims(userId);
}

export async function getMyClaimById(claimId, userId) {
  return USE_MOCK
    ? mockGetMyClaimById(claimId, userId)
    : realGetMyClaimById(claimId);
}

export async function withdrawClaim(claimId, userId) {
  return USE_MOCK
    ? mockWithdrawClaim(claimId, userId)
    : realWithdrawClaim(claimId);
}

export async function submitClaim(itemId, data, userId) {
  return USE_MOCK
    ? mockSubmitClaim(itemId, data, userId)
    : realSubmitClaim(itemId, data);
}
