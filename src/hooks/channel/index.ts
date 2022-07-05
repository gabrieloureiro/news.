import { CHANNEL_CONSTANTS } from "@constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import {
  createChannel,
  deleteChannel,
  getChannelById,
  getChannels,
} from "services";
import { queryClient } from "services/queryClient";
import { ChannelQueryParams, ChannelResponse, ChannelsResponse } from "types";

export function useCreateChannel(): UseMutationResult {
  return useMutation(createChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_CACHE]);
    },
  });
}

export function useDeleteChannel(): UseMutationResult {
  return useMutation(deleteChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        CHANNEL_CONSTANTS.CHANNEL_CACHE,
        CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE,
      ]);
    },
  });
}

export function useChannels(): UseQueryResult<ChannelsResponse[], string> {
  return useQuery<ChannelsResponse[], string>(
    [CHANNEL_CONSTANTS.CHANNEL_CACHE, "channel"],
    () => getChannels()
  );
}

export function useChannel(
  params: ChannelQueryParams
): UseQueryResult<ChannelResponse, string> {
  return useQuery<ChannelResponse, string>(
    [CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE, params],
    () => getChannelById(params)
  );
}
