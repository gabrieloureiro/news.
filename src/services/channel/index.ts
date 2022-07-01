import apiClient from "services/apiClient";
import {
  ChannelPayload,
  ChannelQueryParams,
  ChannelResponse,
  LikeChannelQueryParams,
} from "types";

export async function likeChannel({
  channel_id,
  user_id,
}: LikeChannelQueryParams): Promise<void> {
  return apiClient.put(`channelUserLike/${channel_id}`, user_id);
}

export async function createChannel(params: ChannelPayload): Promise<void> {
  return apiClient.post("channel", params);
}

export async function getChannelById({
  id,
}: ChannelQueryParams): Promise<ChannelResponse> {
  const { data } = await apiClient.get<ChannelResponse>(`channel/${id}`, {
    params: {
      id,
    },
  });

  return data;
}

export async function getChannels(): Promise<ChannelResponse[]> {
  const { data } = await apiClient.get<ChannelResponse[]>("channel");

  return data;
}
