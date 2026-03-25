import { useInsertionEffect } from 'react';

import { ensurePresetStyles } from './ensure-preset-styles';

type TPresetWithCssAndName = { css: string; name: string };

/**
 * Normalizes a preset prop to a value (or null) and ensures its CSS
 * is injected once into `document.head`.
 *
 * Works with any preset that has `{ css, name }` — animation presets
 * (TAnimationPreset) and arrow presets (TArrowPreset) both satisfy this shape.
 */
export function usePresetStyles<T extends TPresetWithCssAndName>({
	preset,
}: {
	preset: T | false | null | undefined;
}): T | null {
	const resolved: T | null =
		preset != null && preset !== false ? preset : null;

	useInsertionEffect(() => {
		if (resolved) {
			ensurePresetStyles({ preset: resolved });
		}
	}, [resolved]);

	return resolved;
}
