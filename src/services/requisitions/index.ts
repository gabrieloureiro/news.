import apiClient from "services/apiClient";
import { RequisitionsResponse, Status } from "types";

type UpdateRequisitionParams = {
  id: number;
  status: Status;
};

export async function getRequisitions(): Promise<RequisitionsResponse[]> {
  const { data } = await apiClient.get<RequisitionsResponse[]>("/requisitions");

  return data;
}

export async function createRequisition(
  userId: string | number
): Promise<void> {
  return apiClient.post(`/requisitions`, {}, { params: { userId } });
}

export async function updateRequisition({
  id,
  status,
}: UpdateRequisitionParams): Promise<void> {
  return apiClient.put(`/requisitions/${id}`, {}, { params: { status } });
}
