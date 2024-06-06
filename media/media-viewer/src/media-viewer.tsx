import React from 'react';
import { type SyntheticEvent } from 'react';
import { type MediaClient, type Identifier } from '@atlaskit/media-client';
import { type MediaFeatureFlags, withMediaAnalyticsContext } from '@atlaskit/media-common';
import { IntlProvider, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { Shortcut } from '@atlaskit/media-ui';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { packageName, packageVersion, component, componentName, fireAnalytics } from './analytics';
import { createModalEvent } from './analytics/events/screen/modal';
import { createClosedEvent } from './analytics/events/ui/closed';
import { List } from './list';
import { Content } from './content';
import { Blanket, SidebarWrapper } from './styleWrappers';
import { start } from 'perf-marks';
import { type MediaViewerExtensions } from './components/types';
import { mediaViewerPopupClass } from './classnames';
import ScrollLock from 'react-scrolllock';
import FocusLock from 'react-focus-lock';

export type Props = {
	onClose?: () => void;
	selectedItem?: Identifier;
	featureFlags?: MediaFeatureFlags;
	mediaClient: MediaClient;
	items: Identifier[];
	extensions?: MediaViewerExtensions;
	contextId?: string;
	innerRef?: React.Ref<HTMLDivElement>;
} & WithAnalyticsEventsProps;

export interface State {
	isSidebarVisible: boolean;
	selectedIdentifier?: Identifier;
}

export class MediaViewerComponent extends React.Component<Props & WrappedComponentProps, State> {
	state: State = {
		isSidebarVisible: false,
	};

	UNSAFE_componentWillMount() {
		fireAnalytics(createModalEvent(), this.props.createAnalyticsEvent);
		start('MediaViewer.SessionDuration');
	}

	onShortcutClosed = () => {
		const { onClose, createAnalyticsEvent } = this.props;
		fireAnalytics(createClosedEvent('escKey'), createAnalyticsEvent);
		if (onClose) {
			onClose();
		}
	};

	onContentClose = (_e?: SyntheticEvent, analyticsEvent?: UIAnalyticsEvent) => {
		const { onClose, createAnalyticsEvent } = this.props;
		if (
			analyticsEvent &&
			analyticsEvent.payload &&
			analyticsEvent.payload.actionSubject === 'button'
		) {
			fireAnalytics(createClosedEvent('button'), createAnalyticsEvent);
		}
		if (onClose) {
			onClose();
		}
	};

	private toggleSidebar = () => {
		this.setState({
			isSidebarVisible: !this.state.isSidebarVisible,
		});
	};

	private get defaultSelectedItem(): Identifier | undefined {
		const { items, selectedItem } = this.props;

		const firstItem = items[0];

		return selectedItem || firstItem;
	}

	renderSidebar = () => {
		const { extensions } = this.props;
		const { isSidebarVisible, selectedIdentifier } = this.state;
		const sidebardSelectedIdentifier = selectedIdentifier || this.defaultSelectedItem;

		if (sidebardSelectedIdentifier && isSidebarVisible && extensions && extensions.sidebar) {
			return (
				<SidebarWrapper data-testid="media-viewer-sidebar-content">
					{extensions.sidebar.renderer(sidebardSelectedIdentifier, {
						close: this.toggleSidebar,
					})}
				</SidebarWrapper>
			);
		}
	};

	render() {
		const { mediaClient, onClose, items, extensions, contextId, featureFlags, innerRef } =
			this.props;
		const { isSidebarVisible } = this.state;
		const content = (
			<div ref={innerRef}>
				<Blanket
					data-testid="media-viewer-popup"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={mediaViewerPopupClass}
				>
					<Shortcut code={'Escape'} handler={this.onShortcutClosed} eventType={'keyup'} />
					<Content isSidebarVisible={isSidebarVisible} onClose={this.onContentClose}>
						<List
							defaultSelectedItem={this.defaultSelectedItem || items[0]}
							items={items}
							mediaClient={mediaClient}
							onClose={onClose}
							extensions={extensions}
							onNavigationChange={this.onNavigationChange}
							onSidebarButtonClick={this.toggleSidebar}
							isSidebarVisible={isSidebarVisible}
							contextId={contextId}
							featureFlags={featureFlags}
						/>
					</Content>
					{this.renderSidebar()}
				</Blanket>
			</div>
		);

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}

	private onNavigationChange = (selectedIdentifier: Identifier) => {
		this.setState({ selectedIdentifier });
	};
}

const MediaViewerWithRef = React.forwardRef<HTMLDivElement, Props & WrappedComponentProps>(
	(props, ref) => {
		return <MediaViewerComponent {...props} innerRef={ref} />;
	},
);

const MediaViewerWithScrollLock = (props: Props & WrappedComponentProps) => {
	return (
		<FocusLock autoFocus>
			<ScrollLock />

			<MediaViewerWithRef {...props} />
		</FocusLock>
	);
};

export const MediaViewer: React.ComponentType<Props> = withMediaAnalyticsContext({
	packageName,
	packageVersion,
	component,
	componentName,
})(withAnalyticsEvents()(injectIntl(MediaViewerWithScrollLock, { enforceContext: false })));
