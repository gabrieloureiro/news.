import { REQUISITIONS_CONSTANTS } from "@constants";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import {
  createRequisition,
  getRequisitions,
  updateRequisition,
} from "services";
import { queryClient } from "services/queryClient";
import { RequisitionsResponse } from "types";

export function useCreateRequisition(): UseMutationResult {
  return useMutation(createRequisition, {
    onSettled: () => {
      queryClient.invalidateQueries([
        REQUISITIONS_CONSTANTS.REQUISITIONS_CACHE,
      ]);
    },
  });
}

export function useUpdateRequisition(): UseMutationResult {
  return useMutation(updateRequisition, {
    onSettled: () => {
      queryClient.invalidateQueries([
        REQUISITIONS_CONSTANTS.REQUISITIONS_CACHE,
      ]);
    },
  });
}

export function useRequisitions(): UseQueryResult<
  RequisitionsResponse[],
  string
> {
  return useQuery<RequisitionsResponse[], string>(
    [REQUISITIONS_CONSTANTS.REQUISITIONS_CACHE, "requisitions"],
    () => getRequisitions()
  );
}
