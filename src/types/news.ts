export type NewsPayload = {
  message: string;
};

export type NewsQueryParams = {
  userId: string;
  channelId: string;
};

export type UpdateLikesPayload = {
  id: number;
};

export type UpdateLikesQueryParams = {
  userId: string;
};

export type DeleteNewsQueryParams = {
  userId: string;
};
