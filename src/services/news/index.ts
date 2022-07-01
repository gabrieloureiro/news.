import apiClient from "services/apiClient";
import { NewsPayload } from "types";

export async function createNews(params: NewsPayload): Promise<void> {
  return apiClient.post("news", params);
}
