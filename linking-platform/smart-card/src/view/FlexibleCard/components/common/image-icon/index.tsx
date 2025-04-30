/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import ImageLoader from 'react-render-image';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { LoadingSkeleton } from '../loading-skeleton';

import { type ImageIconProps } from './types';

const styles = cssMap({
	roundImg: {
		borderRadius: token('border.radius.circle'),
	},
});

const ImageIcon = ({
	defaultIcon,
	testId,
	url,
	width,
	height,
	appearance = 'square',
	onError,
	onLoad,
}: ImageIconProps) => (
	<ImageLoader
		src={url}
		loading={<LoadingSkeleton testId={`${testId}-loading`} width={width} height={height} />}
		loaded={
			<img
				src={url}
				data-testid={`${testId}-image`}
				alt=""
				style={{
					width,
					height,
				}}
				css={appearance === 'round' && fg('platform-linking-visual-refresh-v2') && styles.roundImg}
			/>
		}
		errored={defaultIcon}
		onError={onError}
		onLoad={onLoad}
	/>
);

export default ImageIcon;
