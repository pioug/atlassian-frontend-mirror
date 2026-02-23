export type MutationRecordWithTimestamp = MutationRecord & {
	timestamp?: number;
};

export type MutationDataWithTimestamp = {
	timestamp?: DOMHighResTimeStamp;
};

export type AttributeMutationData = MutationDataWithTimestamp & {
	attributeName: string;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
};

/**
 * Add here when there are more type of mutation data
 */
export type MutationData = AttributeMutationData | MutationDataWithTimestamp;
