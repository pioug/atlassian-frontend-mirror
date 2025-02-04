/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC } from 'react';

import type { MessageDescriptor } from 'react-intl-next';

// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarBehavior = 'push' | 'cover';
// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarPanelCloseOptions = {
	canClosePanel?: () => boolean; // Returns true if panel can be closed
	onPanelClose?: () => void;
};

// Below type is copied from confluence/next/packages/object-sidebar-api/src/useObjectSidebar.tsx
export type ObjectSidebarPanel = {
	id: string;
	headerComponentElements: {
		HeaderIcon?: FC | (() => React.ReactElement<any, any> | null);
		headerLabel: MessageDescriptor;
		HeaderAfterElement?: FC | (() => React.ReactElement<any, any> | null);
	};
	BodyComponent: FC | (() => React.ReactElement<any, any> | null);
	FooterComponent?: FC | (() => React.ReactElement<any, any> | null);
	closeOptions?: ObjectSidebarPanelCloseOptions;
};

export type ShowObjectSidebar = (
	panel: ObjectSidebarPanel,
	behavior?: ObjectSidebarBehavior,
	panelWidth?: number,
) => void;

export type HideObjectSidebar = () => void;
