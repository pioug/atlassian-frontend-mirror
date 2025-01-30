import type { ReactNode } from 'react';

export type { ReactionAction, Actions } from './Actions';
export { ReactionStatus, ReactionUpdateType } from './reaction';
export type {
	ReactionSource,
	ReactionsError,
	ReactionsLoading,
	ReactionsReadyState,
	ReactionsState,
	ReactionSummary,
	ReactionFocused,
	QuickReactionEmojiSummary,
	ReactionsNotLoaded,
	Reactions,
	ReactionClick,
	ReactionMouseEnter,
	onDialogSelectReactionChange,
} from './reaction';
export type { Client, Request } from './client';
export type { Updater } from './Updater';
export type { User } from './User';
export type { Store, StorePropInput, State, OnChangeCallback } from './store';

type TriggerPosition =
	| 'bottom-start'
	| 'bottom'
	| 'bottom-end'
	| 'left-start'
	| 'left'
	| 'left-end'
	| 'top-end'
	| 'top'
	| 'top-start'
	| 'right-end'
	| 'right'
	| 'right-start';

type ProfileCardWrapperProps = {
	userId?: string | null;
	position?: TriggerPosition;
	isAnonymous?: boolean;
	canViewProfile?: boolean;
	children: ReactNode;
	fullName?: string;
	disabledAriaAttributes?: boolean;
	onVisibilityChange?: (isVisible: boolean) => void;
	offset?: [number, number];
	ariaLabel?: string;
};

export type ProfileCardWrapper = React.ComponentType<ProfileCardWrapperProps>;
