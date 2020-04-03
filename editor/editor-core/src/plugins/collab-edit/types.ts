import { ReactElement } from 'react';
import { Providers } from '@atlaskit/editor-common/provider-factory';
import { CollabEditProvider } from '@atlaskit/editor-common';

export {
  CollabParticipant,
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventConnectionData,
  CollabeEventPresenceData,
  CollabEventTelepointerData,
  CollabSendableSelection,
} from '@atlaskit/editor-common';

export type InviteToEditComponentProps = {
  children: ReactElement<InviteToEditButtonProps>;
};

export type InviteToEditButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  selected: boolean;
};

export interface CollabInviteToEditProps {
  inviteToEditHandler?: (event: React.MouseEvent<HTMLElement>) => void;
  isInviteToEditButtonSelected?: boolean;
  inviteToEditComponent?: React.ComponentType<InviteToEditComponentProps>;
}

export type CollabEditOptions = {
  provider?: Providers['collabEditProvider'];
  userId?: string;
  useNativePlugin?: boolean;
  allowUnsupportedContent?: boolean;
  sendDataOnViewUpdated?: boolean;
} & CollabInviteToEditProps;

export type PrivateCollabEditOptions = CollabEditOptions & {
  sanitizePrivateContent?: boolean;
};

export type ProviderCallback = (
  codeToExecute: (provider: CollabEditProvider) => void,
) => void;

export type ProviderBuilder = (
  collabEditProviderPromise: Promise<CollabEditProvider>,
) => ProviderCallback;
