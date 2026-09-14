import type { MentionUserType } from '@atlaskit/adf-schema/mention';
import type { MentionNodeData } from '@atlaskit/mention/types';

export type MentionNodeDataCallback = (
	payload: { data: MentionNodeData; error?: undefined } | { data?: undefined; error: Error },
) => void;

/** `AGENT` is emitted by editor agent sources at runtime but is not serialized as an ADF user type. */
export type MentionNodeDataUserType = MentionUserType | 'AGENT';

export interface MentionNodeDataIdentifier {
	id: string;
	userType?: MentionNodeDataUserType;
}

/**
 * Product-facing bridge between mention data resolution and mention UI.
 *
 * Create one provider per renderer or editor instance and pass it through the
 * renderer props or mentions plugin options. `getMentionDataFromCache` is used
 * during render, including SSR, so it must never start a network request.
 * Deterministic products may return data from it synchronously; network-backed
 * products should return cached data or `undefined`, then resolve through
 * `getMentionData` on the client.
 *
 * The UI depends only on these mention-specific methods to avoid a package
 * cycle with the reusable implementation in editor-plugin-mentions.
 */
export interface MentionNodeDataProvider {
	getMentionData: (mention: MentionNodeDataIdentifier, callback: MentionNodeDataCallback) => void;
	getMentionDataFromCache: (mention: MentionNodeDataIdentifier) => MentionNodeData | undefined;
}
