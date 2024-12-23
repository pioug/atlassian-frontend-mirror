/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { B400, B300, B500 } from '@atlaskit/theme/colors';
import type { LinkAttributes } from '@atlaskit/adf-schema';

import { getEventHandler } from '../../utils';
import { PLATFORM, MODE } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { MarkProps } from '../types';
import { fg } from '@atlaskit/platform-feature-flags';

import { token } from '@atlaskit/tokens';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { AnalyticsContext } from '@atlaskit/analytics-next';

const anchorStyles = css({
	color: token('color.link', B400),
	'&:hover': {
		color: token('color.link', B300),
		textDecoration: 'underline',
	},
	'&:active': {
		color: token('color.link.pressed', B500),
	},
});

interface LinkProps extends LinkAttributes {
	target?: string;
	isMediaLink?: boolean;
}

export default function Link(props: MarkProps<LinkProps>) {
	const { href, target, eventHandlers, fireAnalyticsEvent, isMediaLink, dataAttributes } = props;

	const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
		href,
		target,
		title: href,
	};

	if (target === '_blank') {
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
			<LinkUrl
				css={anchorStyles}
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
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...(fg('platform_editor_hyperlink_underline') && {
					isLinkComponent: true,
				})}
			>
				{props.children}
			</LinkUrl>
		</AnalyticsContext>
	);
}
