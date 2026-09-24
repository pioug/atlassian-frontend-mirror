import type { TokenEncoder } from 'prosemirror-changeset';

import { attrAwareTokenEncoder } from './attrAwareTokenEncoder';
import { markAwareTokenEncoder } from './markAwareTokenEncoder';

export type TokenEncoderSelection = {
	/** Non-smart mark-aware path only; lets callers suppress a duplicate deleted side. */
	shouldHideMarkOnlyDeletions: boolean;
	/** Encoder to hand to `ChangeSet.create`. */
	tokenEncoder: TokenEncoder<string | number>;
};

/**
 * Single place the token encoder is chosen, shared by `calculateDiffDecorations` and
 * `computeDiffChanges` so the two cannot drift.
 *
 * @param useAttrAwareEncoder Caller is running the smart classifier, which needs node attrs folded
 * into the token.
 */
export const selectTokenEncoder = (useAttrAwareEncoder: boolean): TokenEncoderSelection => {
	if (useAttrAwareEncoder) {
		return { tokenEncoder: attrAwareTokenEncoder, shouldHideMarkOnlyDeletions: false };
	}
	return { tokenEncoder: markAwareTokenEncoder, shouldHideMarkOnlyDeletions: true };
};
