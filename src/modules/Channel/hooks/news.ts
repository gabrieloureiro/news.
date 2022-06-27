import { CHANNEL_CONSTANTS } from "modules/Channel/constants";
import { useMutation, UseMutationResult } from "react-query";
import apiClient from "services/apiClient";
import { queryClient } from "services/queryClient";
import { NewsPayload } from "../types";

export async function createNews(params: NewsPayload): Promise<void> {
  return apiClient.post("news", params);
}

export function useCreateChannel(): UseMutationResult {
  return useMutation(createNews, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_CACHE]);
    },
  });
}
