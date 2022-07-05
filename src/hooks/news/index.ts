import { CHANNEL_CONSTANTS } from "@constants";
import { useMutation, UseMutationResult } from "react-query";
import { createNews, deleteMessage, updateNewsLikes } from "services";
import { queryClient } from "services/queryClient";

export function useCreateNews(): UseMutationResult {
  return useMutation(createNews, {
    onSettled: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE]);
    },
  });
}

export function useUpdateNewsLikes(): UseMutationResult {
  return useMutation(updateNewsLikes, {
    onSettled: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE]);
    },
  });
}

export function useDeleteMessage(): UseMutationResult {
  return useMutation(deleteMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_BY_ID_CACHE]);
    },
  });
}
