import React, { Fragment } from 'react';
import type { LinkAttributes } from '@atlaskit/adf-schema';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';

import { getEventHandler } from '../../utils';
import { PLATFORM, MODE } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { MarkProps } from '../types';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { AnalyticsContext } from '@atlaskit/analytics-next';

import { LinkUrlCompiled } from './link-compiled';
import { LinkUrlEmotion } from './link-emotion';

const LinkUrlMigration = componentWithCondition(
	() => expValEquals('platform_editor_renderer_static_css', 'isEnabled', true),
	LinkUrlCompiled,
	LinkUrlEmotion,
);

interface LinkProps extends LinkAttributes {
	isMediaLink?: boolean;
	onSetLinkTarget?: (url: string) => '_blank' | undefined;
	target?: string;
}

/**
 * Render an ADF link mark in renderer.
 */
export default function Link(props: MarkProps<LinkProps>): React.JSX.Element {
	const {
		href,
		target,
		onSetLinkTarget,
		eventHandlers,
		fireAnalyticsEvent,
		isMediaLink,
		dataAttributes,
	} = props;

	let actualTarget = target;

	if (onSetLinkTarget && href) {
		try {
			actualTarget = onSetLinkTarget(href) ?? actualTarget;
		} catch (error) {
			// eslint-disable-line no-unused-vars
			// If URL parsing fails, use the original target
		}
	}

	const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
		href,
		target: actualTarget,
		title: href,
	};

	if (actualTarget === '_blank') {
		anchorProps.rel = 'noreferrer noopener';
	}

	const handler = getEventHandler(eventHandlers, 'link');

	if (isMediaLink) {
		return <Fragment>{props.children}</Fragment>;
	}

	const analyticsData = {
		attributes: {
			location: 'renderer',
		},
		// Below is added for the future implementation of Linking Platform namespaced analytic context
		location: 'renderer',
	};

	return (
		<AnalyticsContext data={analyticsData}>
			<LinkUrlMigration
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onClick={(e) => {
					if (fireAnalyticsEvent) {
						fireAnalyticsEvent({
							action: ACTION.VISITED,
							actionSubject: ACTION_SUBJECT.LINK,
							eventType: EVENT_TYPE.TRACK,
							attributes: {
								platform: PLATFORM.WEB,
								mode: MODE.RENDERER,
							},
						});
					}

					if (handler) {
						handler(e, href);
					}
				}}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...anchorProps}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...dataAttributes}
				isLinkComponent
				enableResolve={true}
			>
				{props.children}
			</LinkUrlMigration>
		</AnalyticsContext>
	);
}
