import type React from 'react';

import type { ArrowKeyNavigationProviderOptions } from '../ArrowKeyNavigationProvider/types';

type SectionOptions = { hasSeparator?: boolean; title?: string };
export interface Props {
	mountTo?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	isOpen?: boolean;
	onOpenChange?: (attrs: any) => void;
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
	onMouseEnter?: (attrs: any) => void;
	onMouseLeave?: (attrs: any) => void;
	fitWidth?: number;
	fitHeight?: number;
	offset?: Array<number>;
	zIndex?: number;
	items: Array<{
		items: MenuItem[];
	}>;
	shouldUseDefaultRole?: boolean;
	disableArrowKeyNavigation?: boolean;
	shouldFocusFirstItem?: () => boolean;
	arrowKeyNavigationProviderOptions: ArrowKeyNavigationProviderOptions;
	section?: SectionOptions;
	children?: React.ReactNode;
	// disabled by default to prevent new row insertion if enter pressed
	allowEnterDefaultBehavior?: boolean;
	handleEscapeKeydown?: (e: KeyboardEvent) => void;
}

export interface MenuItem {
	key?: string;
	content: string | React.ReactChild | React.ReactFragment;
	value: {
		name: string;
	};
	shortcut?: string;
	elemBefore?: React.ReactElement<any>;
	elemAfter?: React.ReactElement<any>;
	tooltipDescription?: string;
	tooltipPosition?: string;
	isActive?: boolean;
	isDisabled?: boolean;
	handleRef?: any;
	className?: string;
	'aria-label'?: React.AriaAttributes['aria-label'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	'data-testid'?: string;
	onClick?: () => void;
	'aria-expanded'?: React.AriaAttributes['aria-expanded'];
	wrapperTabIndex?: number | null;
}

export interface State {
	target?: HTMLElement;
	popupPlacement: [string, string];
	selectionIndex: number;
}
