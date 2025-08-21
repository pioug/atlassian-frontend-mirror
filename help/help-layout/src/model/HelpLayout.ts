import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface HelpPanelHeader {
	// Content to render underneath the header title. This prop is optional
	headerContent?: React.ReactNode;
	// Title used in the header. This prop is optional, if is not defined, the default value is used ("Help")
	headerTitle?: string;
	// AI implementation flag for new layout
	isAiEnabled?: boolean;
	// toogle the back button visibility. This prop is optional
	isBackbuttonVisible?: boolean;
	// Event handler for the "Back" button. This prop is optional
	onBackButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler for the "Close" button. This prop is optional, if this function is not defined the close button will not be displayed
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}
export interface HeaderContent {
	isBackButtonVisible?: boolean;
	newChatButtonDisabled?: boolean;
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onGoBackToHistoryList?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onNewChatButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	title: string;
}

export interface SideNavTab {
	contentRender: () => React.ReactNode;
	header: HeaderContent;
	icon: React.ReactNode;
	label: string;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface HelpLayout extends HelpPanelHeader {
	// Wrapped content
	children?: React.ReactNode;
	// Footer content. This prop is optional
	footer?: React.ReactNode;
	// Loading state. This prop is optional
	isLoading?: boolean;
	onLoad?: () => void;
	// Tabs
	sideNavTabs?: SideNavTab[];
}
