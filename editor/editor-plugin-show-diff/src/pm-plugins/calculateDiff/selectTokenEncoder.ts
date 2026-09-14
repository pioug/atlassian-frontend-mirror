import type { TokenEncoder } from 'prosemirror-changeset';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { attrAwareTokenEncoder } from './attrAwareTokenEncoder';
import { markAwareTokenEncoder } from './markAwareTokenEncoder';

export type TokenEncoderSelection = {
	/** Non-smart mark-aware path only; lets callers suppress a duplicate deleted side. */
	shouldHideMarkOnlyDeletions: boolean;
	/** Encoder to hand to `ChangeSet.create`. `undefined` means the library default. */
	tokenEncoder: TokenEncoder<string | number> | undefined;
};

/**
 * Single place `platform_editor_diff_inline_mark_changes` is read, shared by
 * `calculateDiffDecorations` and `computeDiffChanges` so the two cannot drift.
 *
 * With the gate off this returns what both callers computed before it existed.
 *
 * @param useAttrAwareEncoder Caller is running the smart classifier, which needs node attrs folded
 * into the token.
 */
export const selectTokenEncoder = (useAttrAwareEncoder: boolean): TokenEncoderSelection => {
	if (useAttrAwareEncoder) {
		return { tokenEncoder: attrAwareTokenEncoder, shouldHideMarkOnlyDeletions: false };
	}
	if (fg('platform_editor_diff_inline_mark_changes')) {
		return { tokenEncoder: markAwareTokenEncoder, shouldHideMarkOnlyDeletions: true };
	}
	return { tokenEncoder: undefined, shouldHideMarkOnlyDeletions: false };
};
