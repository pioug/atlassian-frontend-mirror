/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ImageIcon from '../../common/image-icon';

import { type MediaProps } from './types';

/**
 * Media: Image
 * [aspect-ratio: 16 / 9] The context box is fixed to aspect ratio of 16:9.
 * [object-fit: cover] The replaced content is sized to maintain
 * its aspect ratio while filling the element's entire content box.
 * If the object's aspect ratio does not match the aspect ratio of its box,
 * then the object will be clipped to fit.
 * [object-position] Center alignment of the selected replaced element's
 * contents within the element's box.
 */
const styles = css({
	aspectRatio: '16 / 9',
	display: 'flex',
	width: '100%',
	height: 'fit-content',
	'@supports not (aspect-ratio: auto)': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
		paddingTop: '56.25%', // 16:9 ratio (9 / 16 = 0.5625)
		height: 0,
		position: 'relative',
		overflow: 'hidden',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img, > span': {
		minHeight: '100%',
		minWidth: '100%',
		maxHeight: '100%',
		maxWidth: '100%',
		objectFit: 'cover',
		objectPosition: 'center center',
		'@supports not (aspect-ratio: auto)': {
			position: 'absolute',
			transform: 'translate(-50%, -50%)',
			left: '50%',
			top: '50%',
			width: 'auto',
			height: 'auto',
		},
	},
});

/**
 * A base element that displays a Media.
 * @internal
 * @param {MediaProps} MediaProps - The props necessary for the Media element.
 * @see Preview
 */
const MediaOld = ({
	name,
	overrideCss,
	testId = 'smart-element-media',
	type,
	url,
	onLoad,
	onError,
}: MediaProps) => {
	if (!type || !url) {
		return null;
	}
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[styles, overrideCss]}
			data-smart-element={name}
			data-smart-element-media={type}
			data-testid={testId}
		>
			<ImageIcon
				testId={`${testId}-image`}
				url={url}
				onError={onError}
				onLoad={onLoad}
				defaultIcon={null}
			/>
		</div>
	);
};

export default MediaOld;
