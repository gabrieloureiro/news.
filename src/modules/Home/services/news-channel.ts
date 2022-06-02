import apiClient from "services/apiClient";
import { NewsChannel } from "types";

export async function getNewsChannel(): Promise<NewsChannel[]> {
  const { data } = await apiClient.get<NewsChannel[]>(
    "News_Channel_Message__c"
  );

  return data;
}
