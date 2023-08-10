import type {
  CollabEditProvider,
  SyncUpErrorFunction,
} from '@atlaskit/collab-provider';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
export type {
  InviteToEditComponentProps,
  InviteToEditButtonProps,
  CollabInviteToEditProps,
  CollabAnalyticsProps,
} from '@atlaskit/editor-common/collab';

export type PrivateCollabEditOptions = CollabEditOptions & {
  sanitizePrivateContent?: boolean;
  onSyncUpError?: SyncUpErrorFunction;
};

export type ProviderCallback = <ReturnType>(
  codeToExecute: (provider: CollabEditProvider) => ReturnType | undefined,
  onError?: (err: Error) => void,
) => Promise<ReturnType | undefined> | undefined;

export type ProviderBuilder = (
  collabEditProviderPromise: Promise<CollabEditProvider>,
) => ProviderCallback;
