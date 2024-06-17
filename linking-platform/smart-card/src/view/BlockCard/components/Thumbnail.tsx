/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { gs, mq } from '../../common/utils';

export interface ImageProps {
	src: string;
	color?: string;
	testId?: string;
}

export const Thumbnail = (props: ImageProps) => {
	return props.color ? <ThumbnailWithBackground {...props} /> : <ThumbnailDefault {...props} />;
};

const sharedStyles = {
	// The dimensions of the image are set in this manner
	// in order for `flex` to respect this value.
	minWidth: [gs(13), gs(20)],
	maxWidth: [gs(13), gs(20)],
};

export const ThumbnailDefault = ({ src, testId }: ImageProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={mq({
				...sharedStyles,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: '50% 50%',
				backgroundImage: `url(${src})`,
			})}
			data-testid={testId}
			data-trello-do-not-use-override={testId}
		/>
	);
};

const thumbnailImgStyles = css({
	height: '90px',
	width: '90px',
});

export const ThumbnailWithBackground = ({ src, color, testId }: ImageProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={mq({
				...sharedStyles,
				backgroundColor: color,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			})}
			data-testid={testId}
			data-trello-do-not-use-override={testId}
		>
			<img src={src} css={thumbnailImgStyles} />
		</div>
	);
};
