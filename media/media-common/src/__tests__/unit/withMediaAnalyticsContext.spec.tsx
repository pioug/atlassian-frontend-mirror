import React, { forwardRef, useEffect } from 'react';
import { render } from '@atlassian/testing-library';

import {
	type AnalyticsEventPayload,
	AnalyticsListener,
	createAndFireEvent,
	type CreateUIAnalyticsEvent,
	type WithAnalyticsEventsProps,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';

import { ANALYTICS_MEDIA_CHANNEL } from '../../analytics/constants';
import { type ContextPublicAttributes, type ContextStaticProps } from '../../analytics/types';
import { withMediaAnalyticsContext } from '../../analytics/withMediaAnalyticsContext';

import { type MediaFeatureFlags } from '../../mediaFeatureFlags';

describe('withMediaAnalyticsContext()', () => {
	const setup = (analyticsEventPayload: AnalyticsEventPayload = {}) => {
		const fireAnalyticsEvent = (createAnalyticsEvent: CreateUIAnalyticsEvent) =>
			createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(analyticsEventPayload)(createAnalyticsEvent);

		const MediaComponentFiringAnalyticsEvent = ({
			createAnalyticsEvent,
		}: ContextStaticProps & WithAnalyticsEventsProps) => {
			useEffect(() => {
				if (!createAnalyticsEvent) {
					return expect(createAnalyticsEvent).toBeDefined();
				}
				fireAnalyticsEvent(createAnalyticsEvent);
			});

			return <div></div>;
		};

		const someContextData: ContextPublicAttributes = {
			packageName: 'packageName',
			packageVersion: 'packageVersion',
			componentName: 'componentName',
			component: 'component',
		};

		return {
			MediaComponentFiringAnalyticsEvent: withAnalyticsEvents()(MediaComponentFiringAnalyticsEvent),
			someContextData,
		};
	};

	it('should capture and report a11y violations', async () => {
		const { someContextData } = setup();
		const SimpleComponent = (_props: ContextStaticProps) => (
			<button type="button" aria-label="example">
				Example
			</button>
		);
		const WrappedSimpleComponent = withMediaAnalyticsContext(someContextData)(SimpleComponent);

		const { container } = render(<WrappedSimpleComponent />);
		await expect(container).toBeAccessible();
	});

	it('should create MediaAnalyticsContext containing package infos and feature flags', () => {
		const analyticsEventPayload = { test: 'ok' };
		const someFeatureFlags: MediaFeatureFlags = {
			someFlag: true,
			someOtherFlag: true,
		} as MediaFeatureFlags;
		const onEvent = jest.fn();

		const { MediaComponentFiringAnalyticsEvent, someContextData } = setup(analyticsEventPayload);

		const MediaComponentFiringAnalyticsEventWithContext = withMediaAnalyticsContext(
			someContextData,
		)(MediaComponentFiringAnalyticsEvent);

		render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
				<MediaComponentFiringAnalyticsEventWithContext featureFlags={someFeatureFlags} />
			</AnalyticsListener>,
		);

		expect(onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				context: expect.arrayContaining([
					{
						...someContextData,
						[MEDIA_CONTEXT]: {
							featureFlags: someFeatureFlags,
						},
					},
				]),
				payload: analyticsEventPayload,
				hasFired: true,
			}),
			ANALYTICS_MEDIA_CHANNEL,
		);
	});

	it('should allow passing React refs', () => {
		const { someContextData } = setup();
		const someRef = React.createRef<HTMLButtonElement>();

		const FancyButton = forwardRef<HTMLButtonElement, React.PropsWithChildren<ContextStaticProps>>(
			(props, ref) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				<button ref={ref} className="FancyButton" aria-label="fancy button">
					{props.children}
				</button>
			),
		);

		const WrappedFancyButton = withMediaAnalyticsContext(someContextData)(FancyButton);

		render(<WrappedFancyButton ref={someRef} />);

		expect(someRef.current).toBeInstanceOf(HTMLButtonElement);
	});
});
