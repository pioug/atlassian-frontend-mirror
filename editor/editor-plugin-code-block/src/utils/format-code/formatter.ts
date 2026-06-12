import type { Command } from '@atlaskit/editor-common/types';

import type {
	CodeBlockFormatProvider,
	FormatResult,
} from '../../types';

export type LanguageSource = 'auto-detected' | 'selected';
export type FormatCodeResult = FormatResult;

export const preloadFormatterOnIntent =
	(
		formatCodeProvider: CodeBlockFormatProvider | undefined,
		language: string | undefined,
	): Command =>
	(_state, dispatch) => {
		if (!dispatch || !formatCodeProvider || !language) {
			// Hover/focus handlers are command-shaped; keep dry-runs side-effect free.
			return false;
		}

		void formatCodeProvider.preload?.(language)?.catch(() => undefined);
		return false;
	};
