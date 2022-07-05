export type ChannelPayload = {
  title: string;
  description: string;
  user_id: string;
};

export type ChannelQueryParams = {
  id: string;
  userId: string;
};

export type Message = {
  id: number;
  message: string;
  hasImage: boolean;
  image_path: string | null;
  likesAmount: number;
  isLiked: boolean;
};

export type ChannelResponse = {
  id: number;
  title: string;
  description: string;
  messages: Message[];
};

export type ChannelsResponse = {
  id: string;
  title: string;
  description: string;
  messagesAmount: number;
  likesAmount: number;
};
