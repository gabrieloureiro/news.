declare type Options = {
  label: string;
  value: string;
};

declare type QueryEffects = {
  isLoading?: boolean;
  isFetched?: boolean;
  isFetching?: boolean;
  isError?: boolean;
};
