// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EmptyStateHandler = (params: EmptyStateHandlerParams) => React.ReactElement<any> | null;

export type EmptyStateHandlerParams = {
	mode: string;
	searchTerm?: string;
	selectedCategory?: string;
};
