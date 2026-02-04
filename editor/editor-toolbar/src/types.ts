import { type NewCoreIconProps } from '@atlaskit/icon';

export type IconComponent = (props: NewCoreIconProps) => JSX.Element;

export type ToolbarKeyboardNavigationProviderConfig = {
	ariaControls?: string;
	ariaLabel?: string;
	childComponentSelector: string;
	dom?: HTMLElement;
	handleEscape: (event: KeyboardEvent) => void;
	handleFocus: (event: KeyboardEvent) => void;
	isShortcutToFocusToolbar: (event: KeyboardEvent) => boolean;
};

export type DataAttributes = {
	[K in `data-${string}`]?: string | number | boolean | undefined;
  };