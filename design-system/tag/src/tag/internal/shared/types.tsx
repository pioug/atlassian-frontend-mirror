import { type AriaRole, type ComponentType, type ReactNode } from 'react';

import { type TagSwatchBeforeTokenName } from '../../../tag-new/types';
import { type AppearanceType, type MigrationFallback, type TagColor } from '../../../types';

export interface SimpleTagProps {
	/**
	 * Set whether tags are rounded.
	 */
	appearance?: AppearanceType;
	/**
	 * The color theme to apply. This sets both the background and text color.
	 */
	color?: TagColor;
	/**
	 * The component to be rendered before the tag.
	 */
	elemBefore?: ReactNode;
	/**
	 * URI or path. If provided, the tag will be a link.
	 */
	href?: string;
	/**
	 * A link component to be used instead of our standard anchor.
	 * The styling of our link item will be applied to the link that is passed in.
	 */
	linkComponent?: ComponentType<any>;
	/**
	 * Maximum width of the tag text. When exceeded, text will be truncated with ellipsis.
	 * Accepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').
	 */
	maxWidth?: string | number;
	/**
	 * @internal
	 * **Temporary / Internal only for migration.**
	 *
	 * When set to `'lozenge'` and the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts`
	 * is OFF, renders as a Lozenge component instead of Tag. This enables safe, staged migration
	 * from Lozenge to Tag for large consumers.
	 *
	 * This prop will be removed via codemod after migration is complete.
	 */
	migration_fallback?: MigrationFallback;
	/**
	 *
	 * @internal
	 * **Temporary / Internal only for migration.**
	 *
	 * EXPERIMENTAL - Leading color swatch (12×12px), rendered before `elemBefore`.
	 * - `true`: uses `color.background.accent.<color>.subtle` for swatch color
	 * - Pass a design token (e.g. `token('color.background.accent.red.subtle')`)
	 */
	swatchBefore?: boolean | TagSwatchBeforeTokenName;
	/**
	 * Accessible label for the tag's leading color swatch.
	 * Paired with `role="img"` to convey the visual meaning of the swatch
	 * (e.g. `swatchBeforeLabel="Epic"` for an epic color swatch).
	 */
	swatchBeforeLabel?: string;
	/**
	 * The WAI-ARIA role applied to the tag's color swatch element.
	 * Use when the swatch conveys meaning through color alone (e.g. `role="img"`).
	 */
	swatchBeforeRole?: AriaRole;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Text to be displayed in the tag.
	 * Accepts a string or an ordered array of string chunks for migration use cases.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string | string[];
}
