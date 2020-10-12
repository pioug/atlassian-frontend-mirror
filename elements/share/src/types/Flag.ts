export const OBJECT_SHARED = 'object-shared';

export const ADMIN_NOTIFIED = 'admin-notified';

export type FlagType = 'object-shared' | 'admin-notified';

export type MessageDescriptor = {
  id: string;
  description: string;
  defaultMessage: string;
};

export type Flag = {
  appearance: 'success';
  title: MessageDescriptor;
  type: FlagType;
};
