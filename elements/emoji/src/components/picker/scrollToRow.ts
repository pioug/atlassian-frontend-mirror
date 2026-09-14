// this function is being exported so it can be mocked in unit tests
export const scrollToRow = (listRef: any, index?: number): void => {
	listRef.current?.scrollToRow(index);
};
