import axios from "axios";
import type {
  ApiResponse,
  Spec,
  SpecListItem,
  GeneratePayload,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

export async function generateSpec(
  payload: GeneratePayload
): Promise<{ specId: string }> {
  const { data } = await api.post<ApiResponse<{ specId: string }>>(
    "/generate",
    payload
  );
  if (!data.success) throw new Error(data.error || "Generation failed");
  return data.data!;
}

export async function fetchSpecs(
  page = 1,
  limit = 5,
  productType?: string
): Promise<{ specs: SpecListItem[]; pagination: ApiResponse<SpecListItem[]>["meta"] }> {
  const params: Record<string, string | number> = { page, limit };
  if (productType) params.productType = productType;
  const { data } = await api.get<ApiResponse<SpecListItem[]>>("/specs", {
    params,
  });
  if (!data.success) throw new Error(data.error || "Failed to fetch specs");
  return { specs: data.data!, pagination: data.meta };
}

export async function fetchSpec(id: string): Promise<Spec> {
  const { data } = await api.get<ApiResponse<Spec>>(`/specs/${id}`);
  if (!data.success) throw new Error(data.error || "Failed to fetch spec");
  return data.data!;
}

export async function updateSpec(
  id: string,
  updates: Record<string, unknown>
): Promise<Spec> {
  const { data } = await api.patch<ApiResponse<Spec>>(
    `/specs/${id}`,
    updates
  );
  if (!data.success) throw new Error(data.error || "Failed to update spec");
  return data.data!;
}

export async function deleteSpec(id: string): Promise<void> {
  const { data } = await api.delete<ApiResponse<{ deleted: boolean }>>(
    `/specs/${id}`
  );
  if (!data.success) throw new Error(data.error || "Failed to delete spec");
}
