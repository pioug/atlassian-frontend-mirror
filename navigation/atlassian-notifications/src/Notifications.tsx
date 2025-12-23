/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useEffect, useState, useRef, type SyntheticEvent } from 'react';

import { iframeCSS } from './styles';
import { type NotificationsProps } from './types';
import { getNotificationsSrc } from './utils';

export const Notifications = (props: NotificationsProps): React.JSX.Element => {
	const { _url, locale, product, subproduct, testId, isNewExperience, ...iframeProps } = props;
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
		// eslint-disable-next-line @atlassian/a11y/iframe-has-title
		<iframe
			{...iframeProps}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={iframeCSS({ loading })}
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
		/>
	);
};
