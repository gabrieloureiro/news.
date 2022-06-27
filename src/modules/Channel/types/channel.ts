export type ChannelPayload = {
  title: string;
  description: string;
  user_id: string;
};

export type ChannelQueryParams = {
  id: string;
};

export type LikeChannelQueryParams = {
  channel_id: string;
  user_id: string;
};

export type ChannelResponse = {
  channel: {
    id: string;
    title: string;
    description: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
  };
  messages: [
    {
      id: string;
      message: string;
      hasImage: boolean;
      image_path: string | null;
      user_id: string;
      channel_id: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
};
