/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Preview } from '../../../elements';
import Block from '../../block';
import { type PreviewBlockProps } from '../types';

/**
 * Due to its placement on the left/right and ignoreContainerPadding prop
 * rely on its parent container styling, css variables are declared in
 * <Container /> to preset the base values for the preview block styling.
 *
 * `--container-padding` is the padding of the Container. This value is based
 *   on size and hidePadding.
 * `--container-gap-left` and `--container-gap-right` are the gap or padding of
 *   the Container depending on whether the container has other preview blocks
 *   with left/right positioning.
 * `--preview-block-width` is the size of the preview image in relation to
 *   the Container width when the placement is left/right.
 * @param placement
 * @param ignoreContainerPadding
 */
const previewBlockStyles = cssMap({
	left: {
		position: 'absolute',
		top: '0rem',
		bottom: '0rem',
		width: 'calc(var(--preview-block-width))',
		left: '0rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"[data-smart-element-media='image']": {
			aspectRatio: 'unset',
			paddingTop: 'unset',
			width: '100%',
			height: '100%',
			objectFit: 'cover',
		},
	},
	right: {
		position: 'absolute',
		top: '0rem',
		bottom: '0rem',
		width: 'calc(var(--preview-block-width))',
		right: '0rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"[data-smart-element-media='image']": {
			aspectRatio: 'unset',
			paddingTop: 'unset',
			width: '100%',
			height: '100%',
			objectFit: 'cover',
		},
	},
	ignoreContainerPadding: {
		marginLeft: 'calc(var(--container-gap-left) * -1)',
		marginRight: 'calc(var(--container-gap-right) * -1)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:first-of-type': {
			marginTop: 'calc(var(--container-padding) * -1)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:last-of-type': {
			marginBottom: 'calc(var(--container-padding) * -1)',
		},
	},
});

/**
 * Represents a resolved PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlock} PreviewBlock
 * @see Block
 */
const PreviewBlockResolvedView = ({
	ignoreContainerPadding = false,
	onError,
	className,
	placement,
	testId,
	overrideUrl,
	...blockProps
}: PreviewBlockProps) => {
	const handleOnError = useCallback(() => {
		if (onError) {
			onError();
		}
	}, [onError]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<Block
			{...blockProps}
			css={[
				placement && previewBlockStyles[placement],
				!placement && ignoreContainerPadding && previewBlockStyles.ignoreContainerPadding,
			]}
			testId={`${testId}-resolved-view`}
		>
			<Preview onError={handleOnError} overrideUrl={overrideUrl} />
		</Block>
	);
};

export default PreviewBlockResolvedView;
