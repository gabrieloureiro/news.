import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import apiClient from "services/apiClient";
import { queryClient } from "services/queryClient";
import {
  ChannelPayload,
  ChannelQueryParams,
  ChannelResponse,
  LikeChannelQueryParams,
} from "../types";

const CHANNEL_CACHE = "channel-cache";
const CHANNEL_BY_ID_CACHE = "channel-by-id-cache";

export async function createChannel(params: ChannelPayload): Promise<void> {
  return apiClient.post("channel", params);
}

export async function likeChannel({
  channel_id,
  user_id,
}: LikeChannelQueryParams): Promise<void> {
  return apiClient.put(`channelUserLike/${channel_id}`, user_id);
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

export function useCreateChannel(): UseMutationResult {
  return useMutation(createChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CACHE]);
    },
  });
}

export function useChannels(): UseQueryResult<ChannelResponse[], string> {
  return useQuery<ChannelResponse[], string>([CHANNEL_CACHE, "channel"], () =>
    getChannels()
  );
}

export function useChannel(
  params: ChannelQueryParams
): UseQueryResult<ChannelResponse, string> {
  return useQuery<ChannelResponse, string>([CHANNEL_BY_ID_CACHE, params], () =>
    getChannelById(params)
  );
}
