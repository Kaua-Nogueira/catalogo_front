import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useStoreConfig = () => {
  return useQuery({
    queryKey: ["storeConfig"],
    queryFn: async () => {
      const response = await api.get("/store/config");
      return response.data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/store/categories");
      return response.data.data;
    },
  });
};

export const useProducts = (filters: any) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await api.get("/store/products", { params: filters });
      return response.data; // data.data is the items, data.meta has pagination
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await api.get(`/store/products/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post("/store/orders", orderData);
      return response.data;
    },
  });
};

export const useTrackOrders = (ids: number[]) => {
  return useQuery({
    queryKey: ["trackOrders", ids],
    queryFn: async () => {
      if (!ids || ids.length === 0) return [];
      const response = await api.get("/store/orders/track", {
        params: { ids: ids.join(",") },
      });
      return response.data.data;
    },
    enabled: ids.length > 0,
  });
};
