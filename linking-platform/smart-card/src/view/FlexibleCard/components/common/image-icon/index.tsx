/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';
import ImageLoader from 'react-render-image';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { LoadingSkeleton } from '../loading-skeleton';

import { type ImageIconProps } from './types';

const styles = cssMap({
	roundImg: {
		borderRadius: token('radius.full'),
	},
});

const messages = defineMessages({
	imageAltText: {
		id: 'smart-link.image-icon.altText',
		defaultMessage: 'Link Icon',
	},
});

const ImageIcon = ({
	label,
	defaultIcon,
	testId,
	url,
	width,
	height,
	appearance = 'square',
	onError,
	onLoad,
	hideLoadingSkeleton = false,
}: ImageIconProps) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);
	const { formatMessage } = useIntl();

	// If url changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [url]);

	if (hasImageErrored) {
		return defaultIcon;
	}

	if (hideLoadingSkeleton) {
		return (
			<img
				src={url}
				data-testid={`${testId}-image`}
				alt={fg('platform_navx_smart_link_icon_label_a11y') ? (label?.trim() ?? '') : ''}
				style={{
					width,
					height,
				}}
				css={appearance === 'round' && styles.roundImg}
				onError={() => setHasImageErrored(true)}
			/>
		);
	} else {
		return (
			<ImageLoader
				src={url}
				loading={<LoadingSkeleton testId={`${testId}-loading`} width={width} height={height} />}
				loaded={
					<img
						src={url}
						data-testid={`${testId}-image`}
						alt={
							fg('platform_navx_smart_link_icon_label_a11y')
								? (label?.trim() ?? '')
								: formatMessage(messages.imageAltText)
						}
						style={{
							width,
							height,
						}}
						css={appearance === 'round' && styles.roundImg}
					/>
				}
				errored={defaultIcon}
				onError={onError}
				onLoad={onLoad}
			/>
		);
	}
};

export default ImageIcon;
