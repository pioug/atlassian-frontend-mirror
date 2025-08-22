/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC } from 'react';

import type { MessageDescriptor } from 'react-intl-next';

// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarBehavior = 'push' | 'cover';
// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarPanelCloseOptions = {
	canClosePanel?: () => Promise<boolean>; // Returns true if panel can be closed
	onPanelClose?: () => void;
};

type PanelElement = FC | (() => React.ReactElement<any, any> | null);

// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarPanel = {
	BodyComponent: PanelElement;
	closeOptions?: ObjectSidebarPanelCloseOptions;
	FooterComponent?: PanelElement;
	headerComponentElements: {
		HeaderAfterIconElement?: PanelElement;
		HeaderBeforeIconElement?: PanelElement;
		HeaderIcon?: PanelElement;
		headerLabel?: MessageDescriptor;
		HeaderRightAlignedElement?: PanelElement;
		headerStyles?: {
			setGrayBackground?: boolean;
		};
	};
	id: string;
};

export type ShowObjectSidebar = (
	panel: ObjectSidebarPanel,
	behavior?: ObjectSidebarBehavior,
	panelWidth?: number,
) => void;

export type HideObjectSidebar = () => void;

export type HideObjectSidebarById = (id: ObjectSidebarPanel['id']) => void;
