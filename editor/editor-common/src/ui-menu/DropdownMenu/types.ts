import type React from 'react';

import type { ArrowKeyNavigationProviderOptions } from '../ArrowKeyNavigationProvider/types';

type SectionOptions = { hasSeparator?: boolean; title?: string };
export interface Props {
	// disabled by default to prevent new row insertion if enter pressed
	allowEnterDefaultBehavior?: boolean;
	arrowKeyNavigationProviderOptions: ArrowKeyNavigationProviderOptions;
	boundariesElement?: HTMLElement;
	children?: React.ReactNode;
	disableArrowKeyNavigation?: boolean;
	fitHeight?: number;
	fitWidth?: number;
	handleEscapeKeydown?: (e: KeyboardEvent) => void;
	isOpen?: boolean;
	items: Array<{
		items: MenuItem[];
	}>;
	mountTo?: HTMLElement;
	offset?: Array<number>;
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onMouseEnter?: (attrs: any) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onMouseLeave?: (attrs: any) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onOpenChange?: (attrs: any) => void;
	scrollableElement?: HTMLElement;
	section?: SectionOptions;
	shouldFocusFirstItem?: () => boolean;
	shouldUseDefaultRole?: boolean;
	zIndex?: number;
}

export interface MenuItem {
	'aria-expanded'?: React.AriaAttributes['aria-expanded'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	'aria-label'?: React.AriaAttributes['aria-label'];
	className?: string;
	content: string | React.ReactChild | React.ReactFragment;
	'data-testid'?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	elemAfter?: React.ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	elemBefore?: React.ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleRef?: any;
	isActive?: boolean;
	isDisabled?: boolean;
	key?: string;
	onClick?: () => void;
	shortcut?: string;
	tooltipDescription?: string;
	tooltipPosition?: string;
	value: {
		name: string;
	};
	wrapperTabIndex?: number | null;
}

export interface State {
	popupPlacement: [string, string];
	selectionIndex: number;
	target?: HTMLElement;
}
