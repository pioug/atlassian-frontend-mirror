import type { MouseEvent, ReactNode } from 'react';

import type { Placement } from '@atlaskit/popper/main';
import type ProfileClient from '@atlaskit/profilecard/profile-card-client';
import type { ProfileCardAction } from '@atlaskit/profilecard/types';

/**
 * Render-prop signature for injecting a custom user profile card around a mention. When the
 * `people-teams_migrate-user-profile-card` feature gate is on and the consumer supplies this
 * function via `ProfilecardProvider.renderUserMentionCard`, the editor will call it instead of
 * rendering the default link fallback.
 *
 * - In the renderer / read-only path, `referenceElement` is omitted and the consumer is expected
 *   to wrap `children` (the mention node) with their own card-with-trigger component.
 * - In the editor (ProseMirror nodeview) path, `referenceElement` is the mention DOM and the
 *   consumer is expected to render the card inside a popup anchored to that element. The click
 *   that opened the card was already handled by the editor.
 */
export type RenderUserMentionCard = (props: {
	children: ReactNode;
	cloudId: string;
	/** Renders a reduced, non-interactive card with the header + manager section only */
	isReduced?: boolean;
	/** Optional mention-local marker supplied by the renderer. */
	localId?: string;
	/** Popper placement for the card relative to the `referenceElement`. */
	placement?: Placement;
	/** Known identity to prefill the card with, giving its trigger a concrete accessible name. */
	prefilledProfileData?: { accountId: string; name: string };
	referenceElement?: HTMLElement;
	userId: string;
}) => ReactNode;

/**
 * Render-prop for injecting a custom agent profile card around a mention. `children` present
 * means the renderer path (wrap it with your own trigger/popup); absent means the editor path
 * (render a bare card).
 */
export type RenderAgentMentionCard = (props: {
	accountId: string;
	children?: ReactNode;
	cloudId: string;
	isReadOnly?: boolean;
	onChatClick?: (event: MouseEvent, agentStudioId?: string) => void;
}) => ReactNode;

export interface ProfilecardProvider {
	cloudId: string;
	getActions: (id: string, text: string, accessLevel?: string) => ProfileCardAction[];
	renderAgentMentionCard?: RenderAgentMentionCard;
	/**
	 * Optional render-prop that wraps a user mention with a consumer-supplied profile card UI.
	 * Only used when the `people-teams_migrate-user-profile-card` feature gate is on. Lets 1P
	 * products (e.g. Confluence) inject the new private user profile card while public editor
	 * consumers fall back to a link.
	 */
	renderUserMentionCard?: RenderUserMentionCard;
	resourceClient: ProfileClient;
}
