import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "react-query";

export function useCustomQuery<T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  options: UseQueryOptions<T, string, T> = {}
): UseQueryResult<T, string> {
  return useQuery<T, string>(
    queryKey,
    async (...context) => {
      try {
        return await queryFn(...context);
      } catch (error) {
        throw new Error(error);
      }
    },
    options
  );
}
