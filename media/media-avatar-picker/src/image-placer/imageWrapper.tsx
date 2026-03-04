/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

const imageWrapperStyles = css({
	position: 'absolute',
	transition:
		'margin-left 0.15s ease-out, margin-top 0.15s ease-out, left 0.15s ease-out, top 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out',
	userSelect: 'none',
	pointerEvents: 'none',
});

export const ImageWrapper = ({ x, y, width, height, transform, ...props }: any) => {
	const intl = useIntl();

	return (
		<img
			css={imageWrapperStyles}
			style={{
				left: `${x}px`,
				top: `${y}px`,
				width: `${width}px`,
				height: `${height}px`,
				transform: transform,
			}}
			alt={intl.formatMessage(messages.image_placer_img_alt)}
			{...props}
		/>
	);
};
