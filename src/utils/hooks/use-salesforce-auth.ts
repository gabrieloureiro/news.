import { useQuery, UseQueryResult } from "react-query";

import { useCustomQuery } from "./use-custom-query";
import { salesforceAuth } from "services/salesforceAuth";

const SALESFORCE_AUTH_CACHE = "salesforce-auth-cache";

export const useSalesforceAuth = (): UseQueryResult<any> => {
  return useCustomQuery<any>([SALESFORCE_AUTH_CACHE], () => salesforceAuth(), {
    staleTime: 60 * 60 * 2,
  });
};
