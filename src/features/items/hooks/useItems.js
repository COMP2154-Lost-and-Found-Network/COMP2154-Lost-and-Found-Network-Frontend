import { useEffect, useState } from "react";
import * as itemsApi from "../api/itemsApi";

export default function useItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setIsLoading(true);
      setError("");
      const data = await itemsApi.listItems();
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load items");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { items, isLoading, error, refresh };
}