import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface HelpPanelHeader {
	// Title used in the header. This prop is optional, if is not defined, the default value is used ("Help")
	headerTitle?: string;
	// Content to render underneath the header title. This prop is optional
	headerContent?: React.ReactNode;
	// Event handler for the "Close" button. This prop is optional, if this function is not defined the close button will not be displayed
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler for the "Back" button. This prop is optional
	onBackButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// toogle the back button visibility. This prop is optional
	isBackbuttonVisible?: boolean;
	// AI implementation flag for new layout
	isAiEnabled?: boolean;
}
export interface HeaderContent {
	title: string;
	onNewChatButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

export interface SideNavTab {
	icon: React.ReactNode;
	label: string;
	content: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	header: HeaderContent;
}

export interface HelpLayout extends HelpPanelHeader {
	// Loading state. This prop is optional
	isLoading?: boolean;
	// Footer content. This prop is optional
	footer?: React.ReactNode;
	// Wrapped content
	children?: React.ReactNode;
	// Tabs
	sideNavTabs?: SideNavTab[];
}
