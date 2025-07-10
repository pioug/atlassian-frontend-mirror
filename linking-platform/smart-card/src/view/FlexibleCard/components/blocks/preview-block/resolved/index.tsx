/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { MediaPlacement } from '../../../../../../constants';
import { Preview } from '../../../elements';
import Block from '../../block';
import { type PreviewBlockProps } from '../types';

const previewBlockStyleCommon = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element-media='image']": {
		aspectRatio: 'unset',
		paddingTop: 'unset',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
});

const ignoreContainerPaddingStyle = css({
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
	placement,
	testId,
	overrideUrl,
	style,
	className,
	...blockProps
}: PreviewBlockProps) => {
	const [dynamicStyles, setDynamicStyles] = useState<React.CSSProperties>(style ?? {});

	const updateStyles = useCallback(() => {
		if (placement === MediaPlacement.Left || placement === MediaPlacement.Right) {
			const containerPadding = ignoreContainerPadding ? '0px' : 'var(--container-padding)';
			const newStyle: React.CSSProperties = {
				...style,
				position: 'absolute',
				top: containerPadding,
				bottom: containerPadding,
				width: `calc(var(--preview-block-width) - ${containerPadding})`,
				...(placement === MediaPlacement.Left ? { left: containerPadding } : {}),
				...(placement === MediaPlacement.Right ? { right: containerPadding } : {}),
			};
			setDynamicStyles(newStyle);
		} else {
			if (ignoreContainerPadding) {
				setDynamicStyles({ ...style });
			}
		}
	}, [ignoreContainerPadding, placement, style]);

	useEffect(() => {
		updateStyles();
	}, [ignoreContainerPadding, placement, updateStyles, className]);

	const handleOnLoad = useCallback(() => {
		updateStyles();
	}, [updateStyles]);

	const handleOnError = useCallback(() => {
		if (onError) {
			onError();
		}
	}, [onError]);

	return (
		<Block
			{...blockProps}
			testId={`${testId}-resolved-view`}
			css={[
				placement && previewBlockStyleCommon,
				!placement && ignoreContainerPadding && ignoreContainerPaddingStyle,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={dynamicStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			<Preview onError={handleOnError} onLoad={handleOnLoad} overrideUrl={overrideUrl} />
		</Block>
	);
};

export default PreviewBlockResolvedView;
