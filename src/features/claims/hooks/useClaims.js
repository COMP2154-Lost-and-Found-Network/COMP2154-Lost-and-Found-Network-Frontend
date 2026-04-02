import { useCallback, useEffect, useState } from "react";
import * as claimsApi from "../api/claimsApi";

export default function useClaims(userId) {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshClaims = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await claimsApi.listMyClaims(userId);
      setClaims(data);
    } catch (e) {
      if (e.status === 404) {
        setError("This feature is not available yet. The claims endpoint has not been set up on the server.");
      } else {
        setError(e.message || "Failed to load claims");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refreshClaims();
    }
  }, [userId, refreshClaims]);

  return {
    claims,
    isLoading,
    error,
    refreshClaims,
  };
}

