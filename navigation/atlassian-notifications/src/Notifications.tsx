/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { useEffect, useState, useRef, type SyntheticEvent } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';

import { type NotificationsProps } from './types';
import { getNotificationsSrc } from './utils';

const iframeStyles = css({
	borderWidth: 0,
	borderStyle: 'solid',
	borderColor: 'transparent',
	flex: '1 0 100%',
	height: '100%',
	width: '100%',
});

const iframeVisibilityStyles = cssMap({
	loading: {
		display: 'none',
	},
	loaded: {
		display: 'block',
	},
});

export const Notifications = (props: NotificationsProps): React.JSX.Element => {
	const { _url, locale, product, subproduct, testId, isNewExperience, title, ...iframeProps } =
		props;
	const ref = useRef<HTMLIFrameElement>(null);
	const [loading, setLoading] = useState(true);

	const onMessage = (event: MessageEvent) => {
		if (!ref.current || !event.source) {
			return;
		}

		if (
			(event.source as WindowProxy).window === ref.current.contentWindow &&
			event.data === 'readyForUser'
		) {
			setLoading(false);
		}
	};

	useEffect(() => {
		window.addEventListener('message', onMessage);

		return () => {
			window.removeEventListener('message', onMessage);
		};
	}, []);

	const onLoad = (...args: [SyntheticEvent<HTMLIFrameElement>]) => {
		setLoading(false);
		if (iframeProps.onLoad) {
			iframeProps.onLoad(...args);
		}
	};

	return (
		<iframe
			{...iframeProps}
			css={[iframeStyles, iframeVisibilityStyles[loading ? 'loading' : 'loaded']]}
			data-testid={testId}
			onLoad={onLoad}
			ref={ref}
			src={getNotificationsSrc({
				_url,
				locale,
				product,
				subproduct,
				isNewExperience,
			})}
			title={title ?? 'Notifications'}
		/>
	);
};
