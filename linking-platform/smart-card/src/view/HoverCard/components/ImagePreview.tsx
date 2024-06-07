import React, { useCallback, useState, useRef } from 'react';
import { type SerializedStyles } from '@emotion/react';
import extractPreview from '../../../extractors/flexible/extract-preview';
import { PreviewBlock } from '../../FlexibleCard/components/blocks';
import { getTransitionStyles, getPreviewBlockStyles } from '../styled';
import { type ImagePreviewProps } from '../types';

const ImagePreview: React.FC<ImagePreviewProps> = ({ data, fallbackElementHeight }) => {
	const transitionStarted = useRef<boolean>(false);
	const previewBlockRef = useRef<HTMLDivElement>(null);
	const [showPreview, setShowPreview] = useState<boolean>(true);
	const [previewCss, setPreviewCss] = useState<SerializedStyles>();

	// Set Preview to a fixed height to enable transitions
	const onPreviewRender = useCallback(() => {
		previewBlockRef.current &&
			setPreviewCss(getPreviewBlockStyles(previewBlockRef.current?.getBoundingClientRect().height));
	}, []);

	// On error set Preview to Fallback height with transition
	const onPreviewError = useCallback(() => {
		if (transitionStarted.current === false) {
			setPreviewCss(getTransitionStyles(fallbackElementHeight));
			transitionStarted.current = true;
		}
	}, [fallbackElementHeight]);

	const onPreviewTransitionEnd = useCallback(() => {
		setShowPreview(false);
	}, []);

	return showPreview && data && extractPreview(data) ? (
		<PreviewBlock
			onError={onPreviewError}
			ignoreContainerPadding={true}
			overrideCss={previewCss}
			onTransitionEnd={onPreviewTransitionEnd}
			blockRef={previewBlockRef}
			onRender={onPreviewRender}
		/>
	) : null;
};

export default ImagePreview;
