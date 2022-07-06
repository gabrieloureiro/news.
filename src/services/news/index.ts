import apiClient from "services/apiClient";
import {
  DeleteNewsQueryParams,
  NewsPayload,
  NewsQueryParams,
  UpdateLikesPayload,
  UpdateLikesQueryParams,
} from "types";

type CreateNewsParams = {
  payload: NewsPayload;
  params: NewsQueryParams;
};

export type UpdateLikesParams = {
  payload: UpdateLikesPayload;
  params: UpdateLikesQueryParams;
};

export type DeleteNewsParams = {
  id: number;
  params: DeleteNewsQueryParams;
};

export async function createNews({
  payload,
  params,
}: CreateNewsParams): Promise<void> {
  return apiClient.post("/news", payload, { params });
}

export async function updateNewsLikes({
  payload,
  params,
}: UpdateLikesParams): Promise<void> {
  return apiClient.put(`/news/${payload.id}`, payload, { params });
}

export async function deleteMessage({
  id,
  params,
}: DeleteNewsParams): Promise<void> {
  return apiClient.delete(`/news/${id}`, { params });
}
