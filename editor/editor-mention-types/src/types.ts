export interface MentionNameInfo {
	name?: string;
}

export type GetMentionNameDetails = (id: string) => Promise<MentionNameInfo | undefined>;
