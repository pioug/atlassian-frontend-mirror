export type AGGPageInfo = {
	endCursor: string | null;
	hasNextPage: boolean;
};

export type ResultWithPageInfo<T> = {
	edges: T[];
	pageInfo: AGGPageInfo;
};

export type AGGPageInfoVariables = {
	first: number;
	after?: string;
};

// We should remove this function after cleaning up site scoped flag & migrating to AGG
export function isResultWithPageInfo<T>(
	result: T[] | ResultWithPageInfo<T>,
): result is ResultWithPageInfo<T> {
	return (result as ResultWithPageInfo<T>).pageInfo !== undefined;
}
