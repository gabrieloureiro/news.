import { CHANNEL_CONSTANTS } from "constants/index";
import { useMutation, UseMutationResult } from "react-query";
import { createNews } from "services";
import { queryClient } from "services/queryClient";

export function useCreateChannel(): UseMutationResult {
  return useMutation(createNews, {
    onSuccess: () => {
      queryClient.invalidateQueries([CHANNEL_CONSTANTS.CHANNEL_CACHE]);
    },
  });
}
