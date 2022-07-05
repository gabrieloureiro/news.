export type ChannelPayload = {
  title: string;
  description: string;
};

export type ChannelQueryParams = {
  id?: string;
  userId: string;
};

export type Message = {
  id: number;
  message: string;
  hasImage: boolean;
  image_path: string | null;
  likesAmount: number;
  isLiked: boolean;
  message_owner: {
    id: number;
    name: string;
  };
};

export type ChannelResponse = {
  id: number;
  title: string;
  description: string;
  messages: Message[];
  channel_owner: {
    id: number;
    name: string;
  };
};

export type ChannelsResponse = {
  id: string;
  title: string;
  description: string;
  messagesAmount: number;
  likesAmount: number;
};
