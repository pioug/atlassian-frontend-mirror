import { useInsertionEffect } from 'react';

import { ensurePresetStyles } from './ensure-preset-styles';

type TPresetWithCssAndName = { css: string; name: string };

/**
 * Normalizes the `animate` prop to a preset (or null) and ensures its CSS
 * is injected once into document.head. Used by PopupContent, Popover, and
 * DialogContent so they don't duplicate this logic.
 */
export function useAnimationPreset<T extends TPresetWithCssAndName>(
	animate: T | false | null | undefined,
): T | null {
	const preset: T | null = animate != null && animate !== false ? animate : null;

	useInsertionEffect(() => {
		if (preset) {
			ensurePresetStyles({ preset });
		}
	}, [preset]);

	return preset;
}
