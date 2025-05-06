export type Reason = 'managed' | 'ext.dir.scim' | 'ext.dir.google';

export interface MutabilityConstraint {
	field: string;
	reason: Reason;
}
