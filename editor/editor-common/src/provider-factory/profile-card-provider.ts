import type { ReactNode } from 'react';

import type { ProfileCardAction, ProfileClient } from '@atlaskit/profilecard';

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
	referenceElement?: HTMLElement;
	userId: string;
}) => ReactNode;

export interface ProfilecardProvider {
	cloudId: string;
	getActions: (id: string, text: string, accessLevel?: string) => ProfileCardAction[];
	/**
	 * Optional render-prop that wraps a user mention with a consumer-supplied profile card UI.
	 * Only used when the `people-teams_migrate-user-profile-card` feature gate is on. Lets 1P
	 * products (e.g. Confluence) inject the new private user profile card while public editor
	 * consumers fall back to a link.
	 */
	renderUserMentionCard?: RenderUserMentionCard;
	resourceClient: ProfileClient;
}
