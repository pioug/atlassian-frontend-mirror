export const OBJECT_SHARED = 'object-shared';

export const ADMIN_NOTIFIED = 'admin-notified';

export type FlagType = 'object-shared' | 'admin-notified';

export type MessageDescriptor = {
	defaultMessage: string;
	description: string;
	id: string;
};

export type Flag = {
	appearance: 'success';
	title: MessageDescriptor;
	type: FlagType;
};
