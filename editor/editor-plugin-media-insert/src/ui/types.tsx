export type OnInsertAttrs = {
	collection: string | undefined;
	dimensions?: { height: number; width: number };
	fileMimeType: string;
	id: string;
	occurrenceKey: string | undefined;
};
