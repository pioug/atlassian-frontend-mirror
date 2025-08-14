import { type ReactElement } from 'react';

import { type MessageDescriptor } from 'react-intl-next';

/**
 * Represents a single color in the palette
 */
export interface PaletteColor {
	/** The color value (hex, token, etc.) */
	value: string;
	/** Display label for the color */
	label: string;
	/** Border color for the color swatch */
	border: string;
	/** Optional internationalization message */
	message?: MessageDescriptor;
	/** Optional decorator element to display instead of checkmark */
	decorator?: ReactElement;
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
	/** Array of colors to display */
	palette: PaletteColor[];
	/**
	 * Function to convert hex codes to design system tokens
	 * Different color palettes may use different mapping functions
	 */
	hexToPaletteColor?: (hexColor: string) => string | undefined;
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
	/** Currently selected color value */
	selectedColor: string | null;
	/** Callback when a color is clicked */
	onClick: (value: string, label: string) => void;
	/** Optional callback for keyboard navigation */
	onKeyDown?: (value: string, label: string, event: React.KeyboardEvent) => void;
	/** Number of columns in the palette grid */
	cols?: number;
	/** Optional CSS class name */
	className?: string;
	/** Palette configuration options */
	paletteOptions: PaletteOptions;
}

/**
 * Props for individual color palette items
 */
export interface ColorProps {
	/** The color value */
	value: string;
	/** Display label for accessibility */
	label: string;
	/** Tab index for keyboard navigation */
	tabIndex?: number;
	/** Whether this color is currently selected */
	isSelected?: boolean;
	/** Click handler */
	onClick: (value: string, label: string) => void;
	/** Keyboard event handler */
	onKeyDown?: (value: string, label: string, event: React.KeyboardEvent) => void;
	/** Border color for the swatch */
	borderColor: string;
	/** Color for the checkmark icon */
	checkMarkColor?: string;
	/** Whether to auto-focus this item */
	autoFocus?: boolean;
	/** Function to convert hex to palette color */
	hexToPaletteColor?: (hexColor: string) => string | undefined;
	/** Optional decorator element */
	decorator?: ReactElement;
}
