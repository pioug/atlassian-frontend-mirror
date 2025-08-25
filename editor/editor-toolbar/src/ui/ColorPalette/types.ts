import { type ReactElement } from 'react';

import { type MessageDescriptor } from 'react-intl-next';

/**
 * Represents a single color in the palette
 */
export interface PaletteColor {
	/** Border color for the color swatch */
	border: string;
	/** Optional decorator element to display instead of checkmark */
	decorator?: ReactElement;
	/** Display label for the color */
	label: string;
	/** Optional internationalization message */
	message?: MessageDescriptor;
	/** The color value (hex, token, etc.) */
	value: string;
}

/**
 * Array of palette colors
 */
export type Palette = Array<PaletteColor>;

/**
 * Tooltip messages for different themes
 */
export type PaletteTooltipMessages = {
	dark: Record<string, MessageDescriptor>;
	light: Record<string, MessageDescriptor>;
};

/**
 * Configuration options for the color palette
 */
export interface PaletteOptions {
	/**
	 * Function to convert hex codes to design system tokens
	 * Different color palettes may use different mapping functions
	 */
	hexToPaletteColor?: (hexColor: string) => string | undefined;
	/** Array of colors to display */
	palette: PaletteColor[];
	/**
	 * Tooltip messages for different color themes
	 * Consumer determines which tooltip messages to use
	 */
	paletteColorTooltipMessages?: PaletteTooltipMessages;
}

/**
 * Props for the main ColorPalette component
 */
export interface ColorPaletteProps {
	/** Optional CSS class name */
	className?: string;
	/** Number of columns in the palette grid */
	cols?: number;
	/** Callback when a color is clicked */
	onClick: (value: string, label: string) => void;
	/** Optional callback for keyboard navigation */
	onKeyDown?: (value: string, label: string, event: React.KeyboardEvent) => void;
	/** Palette configuration options */
	paletteOptions: PaletteOptions;
	/** Currently selected color value */
	selectedColor: string | null;
}

/**
 * Props for individual color palette items
 */
export interface ColorProps {
	/** Whether to auto-focus this item */
	autoFocus?: boolean;
	/** Border color for the swatch */
	borderColor: string;
	/** Color for the checkmark icon */
	checkMarkColor?: string;
	/** Optional decorator element */
	decorator?: ReactElement;
	/** Function to convert hex to palette color */
	hexToPaletteColor?: (hexColor: string) => string | undefined;
	/** Whether this color is currently selected */
	isSelected?: boolean;
	/** Display label for accessibility */
	label: string;
	/** Click handler */
	onClick: (value: string, label: string) => void;
	/** Keyboard event handler */
	onKeyDown?: (value: string, label: string, event: React.KeyboardEvent) => void;
	/** Tab index for keyboard navigation */
	tabIndex?: number;
	/** The color value */
	value: string;
}
