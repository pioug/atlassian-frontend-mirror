import React from 'react';

import PropTypes from 'prop-types';
import {
	createPortal,
	unmountComponentAtNode,
	unstable_renderSubtreeIntoContainer,
} from 'react-dom';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { injectIntl, RawIntlProvider, useIntl } from 'react-intl-next';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import type { FireAnalyticsCallback } from '../../analytics';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';
import { EventDispatcher } from '../../event-dispatcher';
import IntlProviderIfMissingWrapper from '../IntlProviderIfMissingWrapper';

export type BasePortalProviderProps = {
	render: (portalProviderAPI: LegacyPortalProviderAPI) => React.ReactChild | JSX.Element | null;
	onAnalyticsEvent?: FireAnalyticsCallback;
	useAnalyticsContext?: boolean;
} & WrappedComponentProps;

export type Portals = Map<HTMLElement, React.ReactChild>;

export type PortalRendererState = {
	portals: Portals;
};

type MountedPortal = {
	key: string;
	children: () => React.ReactChild | null;
	hasAnalyticsContext: boolean;
	hasIntlContext: boolean;
};

export class LegacyPortalProviderAPI extends EventDispatcher {
	portals: Map<HTMLElement, MountedPortal> = new Map();
	context: any;
	intl: IntlShape;
	onAnalyticsEvent?: FireAnalyticsCallback;
	useAnalyticsContext?: boolean;

	constructor(
		intl: IntlShape,
		onAnalyticsEvent?: FireAnalyticsCallback,
		analyticsContext?: boolean,
	) {
		super();
		this.intl = intl;
		this.onAnalyticsEvent = onAnalyticsEvent;
		this.useAnalyticsContext = analyticsContext;
	}

	setContext = (context: any) => {
		this.context = context;
	};

	render(
		children: () => React.ReactChild | JSX.Element | null,
		container: HTMLElement,
		key: string,
		hasAnalyticsContext: boolean = false,
		hasIntlContext: boolean = false,
	) {
		this.portals.set(container, {
			key,
			children,
			hasAnalyticsContext,
			hasIntlContext,
		});
		let wrappedChildren = this.useAnalyticsContext ? (
			<AnalyticsContextWrapper>{children()}</AnalyticsContextWrapper>
		) : (
			(children() as JSX.Element)
		);
		if (hasIntlContext) {
			wrappedChildren = <RawIntlProvider value={this.intl}>{wrappedChildren}</RawIntlProvider>;
		}
		unstable_renderSubtreeIntoContainer(this.context, wrappedChildren, container);
	}

	// TODO: until https://product-fabric.atlassian.net/browse/ED-5013
	// we (unfortunately) need to re-render to pass down any updated context.
	// selectively do this for nodeviews that opt-in via `hasAnalyticsContext`
	forceUpdate({ intl }: { intl: IntlShape }) {
		this.intl = intl;

		this.portals.forEach((portal, container) => {
			if (!portal.hasAnalyticsContext && !this.useAnalyticsContext && !portal.hasIntlContext) {
				return;
			}

			let wrappedChildren = portal.children() as JSX.Element;

			if (portal.hasAnalyticsContext && this.useAnalyticsContext) {
				wrappedChildren = <AnalyticsContextWrapper>{wrappedChildren}</AnalyticsContextWrapper>;
			}

			if (portal.hasIntlContext) {
				wrappedChildren = <RawIntlProvider value={this.intl}>{wrappedChildren}</RawIntlProvider>;
			}

			unstable_renderSubtreeIntoContainer(this.context, wrappedChildren, container);
		});
	}

	remove(key: string, container: HTMLElement) {
		this.portals.delete(container);

		// There is a race condition that can happen caused by Prosemirror vs React,
		// where Prosemirror removes the container from the DOM before React gets
		// around to removing the child from the container
		// This will throw a NotFoundError: The node to be removed is not a child of this node
		// Both Prosemirror and React remove the elements asynchronously, and in edge
		// cases Prosemirror beats React
		try {
			unmountComponentAtNode(container);
		} catch (error) {
			if (this.onAnalyticsEvent) {
				this.onAnalyticsEvent({
					payload: {
						action: ACTION.FAILED_TO_UNMOUNT,
						actionSubject: ACTION_SUBJECT.EDITOR,
						actionSubjectId: ACTION_SUBJECT_ID.REACT_NODE_VIEW,
						attributes: {
							error: error as Error,
							domNodes: {
								container: container ? container.className : undefined,
								child: container.firstElementChild
									? container.firstElementChild.className
									: undefined,
							},
						},
						eventType: EVENT_TYPE.OPERATIONAL,
					},
				});
			}
		}
	}
}

class BasePortalProvider extends React.Component<BasePortalProviderProps> {
	static displayName = 'PortalProvider';

	portalProviderAPI: LegacyPortalProviderAPI;

	constructor(props: BasePortalProviderProps) {
		super(props);
		this.portalProviderAPI = new LegacyPortalProviderAPI(
			props.intl,
			props.onAnalyticsEvent,
			props.useAnalyticsContext,
		);
	}

	render() {
		return this.props.render(this.portalProviderAPI);
	}

	componentDidUpdate() {
		this.portalProviderAPI.forceUpdate({ intl: this.props.intl });
	}
}

export const PortalProvider = injectIntl(BasePortalProvider);

type PortalProviderWithThemeProvidersProps = Omit<BasePortalProviderProps, 'intl' | 'themeMode'>;

export const PortalProviderWithThemeProviders = ({
	onAnalyticsEvent,
	useAnalyticsContext,
	render,
}: PortalProviderWithThemeProvidersProps) => (
	<IntlProviderIfMissingWrapper>
		<PortalProviderWithThemeAndIntlProviders
			onAnalyticsEvent={onAnalyticsEvent}
			useAnalyticsContext={useAnalyticsContext}
			render={render}
		/>
	</IntlProviderIfMissingWrapper>
);

const PortalProviderWithThemeAndIntlProviders = ({
	onAnalyticsEvent,
	useAnalyticsContext,
	render,
}: PortalProviderWithThemeProvidersProps) => {
	const intl = useIntl();

	return (
		<BasePortalProvider
			intl={intl}
			onAnalyticsEvent={onAnalyticsEvent}
			useAnalyticsContext={useAnalyticsContext}
			render={render}
		/>
	);
};

export class PortalRenderer extends React.Component<
	{ portalProviderAPI: LegacyPortalProviderAPI },
	PortalRendererState
> {
	constructor(props: { portalProviderAPI: LegacyPortalProviderAPI }) {
		super(props);
		props.portalProviderAPI.setContext(this);
		props.portalProviderAPI.on('update', this.handleUpdate);
		this.state = { portals: new Map() };
	}

	handleUpdate = (portals: Portals) => this.setState({ portals });

	render() {
		const { portals } = this.state;
		return (
			<>
				{Array.from(portals.entries()).map(([container, children]) =>
					createPortal(children, container),
				)}
			</>
		);
	}
}

/**
 * Wrapper to re-provide modern analytics context to ReactNodeViews.
 */
const dummyAnalyticsContext = {
	getAtlaskitAnalyticsContext() {},
	getAtlaskitAnalyticsEventHandlers() {},
};

const AnalyticsContextWrapper = class extends React.Component<any> {
	static contextTypes = {
		contextAdapter: PropTypes.object,
	};

	render() {
		const { value } = (this.context as any).contextAdapter.analytics || {
			value: dummyAnalyticsContext,
		};
		return (
			<AnalyticsReactContext.Provider value={value}>
				{this.props.children}
			</AnalyticsReactContext.Provider>
		);
	}
};
