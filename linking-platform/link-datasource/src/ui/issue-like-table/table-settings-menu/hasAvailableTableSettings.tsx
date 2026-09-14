/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { TableSettingsMenuProps } from './TableSettingsMenu';

export const hasAvailableTableSettings = ({ wrapTextSetting }: TableSettingsMenuProps): boolean =>
	Boolean(wrapTextSetting);
