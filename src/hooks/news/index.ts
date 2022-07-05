import { CHANNEL_CONSTANTS } from "@constants";
import { useMutation, UseMutationResult } from "react-query";
import { createNews, updateNewsLikes } from "services";
import { queryClient } from "services/queryClient";

export function useCreateNews(): UseMutationResult {
  return useMutation(createNews, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE]);
    },
  });
}

export function useUpdateNewsLikes(): UseMutationResult {
  return useMutation(updateNewsLikes, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE]);
    },
  });
}
