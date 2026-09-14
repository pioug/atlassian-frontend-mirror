/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
import type { Layers } from './types';

export const CHANNEL = '__ATLASKIT_THEME__';
export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODES: string[] = ['light', 'dark'];

/**
 * @deprecated {@link https://hello.atlassian.net/wiki/x/IsBnsQE Internal documentation for deprecation (no external access)}.
 * Use appropriate Design System components instead such as Tooltip, Modal dialog, Flag, Popup, Dropdown menu, Spotlight, Select, Date time picker, Inline dialog, Avatar group, and Popper
 */
export const layers: { [P in keyof Layers]: () => Layers[P] } = {
	card: () => 100,
	navigation: () => 200,
	dialog: () => 300,
	layer: () => 400,
	blanket: () => 500,
	modal: () => 510,
	flag: () => 600,
	spotlight: () => 700,
	tooltip: () => 9999,
};
