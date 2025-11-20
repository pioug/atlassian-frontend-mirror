import React, { type PropsWithChildren } from 'react';
import { type WithMediaClientConfigProps } from '@atlaskit/media-client-react';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import { type MediaInlineCardProps } from './mediaInlineCard';
import { AnalyticsContext } from '@atlaskit/analytics-next';

export type MediaInlineCardWithMediaClientConfigProps =
	WithMediaClientConfigProps<MediaInlineCardProps>;

type MediaInlineCardWithMediaClientConfigComponent =
	React.ComponentType<MediaInlineCardWithMediaClientConfigProps>;

type ErrorBoundaryComponent = React.ComponentType<
	PropsWithChildren<{
		data?: { [k: string]: any };
		isSelected?: boolean;
	}>
>;

export interface MediaInlineCardLoaderState {
	MediaInlineCard?: MediaInlineCardWithMediaClientConfigComponent;
	ErrorBoundary?: ErrorBoundaryComponent;
}

export default class MediaInlineCardLoader extends React.PureComponent<
	MediaInlineCardWithMediaClientConfigProps & MediaInlineCardLoaderState,
	MediaInlineCardLoaderState
> {
	static displayName = 'MediaInlineCardLoader';
	static MediaInlineCard?: MediaInlineCardWithMediaClientConfigComponent;
	static ErrorBoundary?: ErrorBoundaryComponent;
	mounted = false;

	state: MediaInlineCardLoaderState = {
		MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
		ErrorBoundary: MediaInlineCardLoader.ErrorBoundary,
	};

	async componentDidMount() {
		this.mounted = true;
		if (!this.state.MediaInlineCard) {
			try {
				const [mediaClient, cardModule, mediaInlineErrorBoundaryModule] = await Promise.all([
					import(
						/* webpackChunkName: "@atlaskit-internal_media-client-react" */ '@atlaskit/media-client-react'
					),
					import(
						/* webpackChunkName: "@atlaskit-internal_inline-media-card" */ './mediaInlineCard'
					),
					import(
						/* webpackChunkName: "@atlaskit-internal_media-inline-error-boundary" */ './mediaInlineAnalyticsErrorBoundary'
					),
				]);

				MediaInlineCardLoader.MediaInlineCard = mediaClient.withMediaClient(
					cardModule.MediaInlineCard,
				);
				MediaInlineCardLoader.ErrorBoundary = mediaInlineErrorBoundaryModule.default;

				if (this.mounted) {
					this.setState({
						MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
						ErrorBoundary: MediaInlineCardLoader.ErrorBoundary,
					});
				}
			} catch (error) {}
		}
	}

	async componentWillUnmount() {
		this.mounted = false;
	}

	render(): React.JSX.Element {
		const { MediaInlineCard, ErrorBoundary } = this.state;
		const analyticsContext = {
			packageVersion: process.env._PACKAGE_NAME_ as string,
			packageName: process.env._PACKAGE_VERSION_ as string,
			componentName: 'mediaInlineCard',
			component: 'mediaInlineCard',
		};

		if (!MediaInlineCard || !ErrorBoundary) {
			return <MediaInlineCardLoadingView message="" />;
		}

		return (
			<AnalyticsContext data={analyticsContext}>
				<ErrorBoundary isSelected={this.props.isSelected}>
					<MediaInlineCard {...this.props} />
				</ErrorBoundary>
			</AnalyticsContext>
		);
	}
}
