import { CHANNEL_CONSTANTS } from "constants/index";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import { createChannel, getChannelById, getChannels } from "services";
import { queryClient } from "services/queryClient";
import { ChannelQueryParams, ChannelResponse } from "../../types";

export function useCreateChannel(): UseMutationResult {
  return useMutation(createChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_CACHE]);
    },
  });
}

export function useChannels(): UseQueryResult<ChannelResponse[], string> {
  return useQuery<ChannelResponse[], string>(
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
