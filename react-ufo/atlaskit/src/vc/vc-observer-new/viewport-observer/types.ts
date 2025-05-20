export type MutationRecordWithTimestamp = MutationRecord & {
	timestamp?: number;
};

export type AttributeMutationData = {
	attributeName: string;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
};

/**
 * Add here when there are more type of mutation data
 */
export type MutationData = AttributeMutationData;
