import apiClient from "services/apiClient";
import {
  ChannelPayload,
  ChannelQueryParams,
  ChannelResponse,
  ChannelsResponse,
} from "types";

export type CreateChannelParams = {
  payload: ChannelPayload;
  params: ChannelQueryParams;
};

export async function createChannel({
  payload,
  params,
}: CreateChannelParams): Promise<void> {
  return apiClient.post("/channel", payload, { params });
}

export async function getChannelById({
  id,
  userId,
}: ChannelQueryParams): Promise<ChannelResponse> {
  const { data } = await apiClient.get<ChannelResponse>(`/channel/${id}`, {
    params: { userId },
  });

  return data;
}

export async function getChannels(): Promise<ChannelsResponse[]> {
  const { data } = await apiClient.get<ChannelsResponse[]>("/channel");

  return data;
}
