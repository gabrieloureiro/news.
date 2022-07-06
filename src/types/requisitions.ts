export type Status = {
  status: "PENDING" | "APPROVED" | "REFUSED";
};

export type RequisitionsResponse = {
  id: number;
  name: string;
  user_id: number;
} & Status;
