export type MutationRecordWithTimestamp = MutationRecord & {
	timestamp?: number;
};

export type AttributeMutationData = {
	attributeName: string;
};

/**
 * Add here when there are more type of mutation data
 */
export type MutationData = AttributeMutationData;
