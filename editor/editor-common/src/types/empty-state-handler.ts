export type EmptyStateHandler = (
  params: EmptyStateHandlerParams,
) => React.ReactElement<any> | null;

export type EmptyStateHandlerParams = {
  mode: string;
  selectedCategory?: string;
  searchTerm?: string;
};
