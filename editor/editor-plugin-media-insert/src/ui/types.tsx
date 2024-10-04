export type OnInsertAttrs = {
	id: string;
	collection: string | undefined;
	dimensions?: { width: number; height: number };
	occurrenceKey: string | undefined;
	fileMimeType: string;
};
