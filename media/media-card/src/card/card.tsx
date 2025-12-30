import {
	isFileIdentifier,
	globalMediaEventEmitter,
	type AuthProviderSucceededEventPayload,
	type AuthProviderFailedEventPayload,
} from '@atlaskit/media-client';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import React, { useEffect } from 'react';
import { IntlProvider, type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { type CardProps } from '../types';
import { ExternalImageCard } from './externalImageCard';
import { FileCard } from './fileCard';
import {
	startResourceObserver,
	setAnalyticsContext,
} from '../utils/mediaPerformanceObserver/mediaPerformanceObserver';
import {
	fireMediaCardEvent,
	getAuthProviderSucceededPayload,
	getAuthProviderFailedPayload,
} from '../utils/analytics';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import UFOLabel from '@atlaskit/react-ufo/label';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type CardBaseProps = CardProps & Partial<WrappedComponentProps>;

export const CardBase = ({
	identifier,
	...otherProps
}: CardBaseProps & WrappedComponentProps): React.JSX.Element => {
	const innerContent = isFileIdentifier(identifier) ? (
		<UFOLabel name="media-card-file-card">
			<FileCard {...otherProps} identifier={identifier} key={identifier.id} />
		</UFOLabel>
	) : (
		<UFOLabel name="media-card-external-image">
			<ExternalImageCard {...otherProps} identifier={identifier} key={identifier.dataURI} />
		</UFOLabel>
	);
	return otherProps.intl ? innerContent : <IntlProvider locale="en">{innerContent}</IntlProvider>;
};

export const CardWithPerformanceObserver = (
	props: CardBaseProps & WrappedComponentProps,
): React.JSX.Element => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		startResourceObserver();
	}, []);

	useEffect(() => {
		setAnalyticsContext(createAnalyticsEvent);
	}, [createAnalyticsEvent]);

	// Auth provider analytics listener
	useEffect(() => {
		if (!fg('platform_media_auth_provider_analytics')) {
			return;
		}

		// Sample auth-provider-succeeded events at 10%
		const shouldSampleAuthProviderSucceeded = () => Math.random() < 0.1;

		const onAuthSuccess = (payload: AuthProviderSucceededEventPayload) => {
			if (shouldSampleAuthProviderSucceeded()) {
				fireMediaCardEvent(
					getAuthProviderSucceededPayload(payload.durationMs, payload.timeoutMs, payload.authContext),
					createAnalyticsEvent,
				);
			}
		};

		const onAuthFailed = (payload: AuthProviderFailedEventPayload) => {
			fireMediaCardEvent(
				getAuthProviderFailedPayload(
					payload.durationMs,
					payload.timeoutMs,
					payload.error,
					payload.authContext,
				),
				createAnalyticsEvent,
			);
		};

		globalMediaEventEmitter.on('auth-provider-succeeded', onAuthSuccess);
		globalMediaEventEmitter.on('auth-provider-failed', onAuthFailed);

		return () => {
			globalMediaEventEmitter.off('auth-provider-succeeded', onAuthSuccess);
			globalMediaEventEmitter.off('auth-provider-failed', onAuthFailed);
		};
	}, [createAnalyticsEvent]);

	return <CardBase {...props} />;
};

export const Card: React.ComponentType<CardBaseProps> = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'mediaCard',
	component: 'mediaCard',
})(
	injectIntl(CardWithPerformanceObserver, {
		enforceContext: false,
	}),
);
