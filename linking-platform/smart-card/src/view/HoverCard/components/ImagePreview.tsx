import React, { useCallback, useRef, useState } from 'react';

import { JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import extractPreview, {
	extractSmartLinkPreviewImage,
} from '../../../extractors/flexible/extract-preview';
import { PreviewBlock } from '../../FlexibleCard/components/blocks';
import { type ImagePreviewProps } from '../types';

const ImagePreview = ({ fallbackElementHeight, response }: ImagePreviewProps) => {
	const transitionStarted = useRef<boolean>(false);
	const previewBlockRef = useRef<HTMLDivElement>(null);
	const [showPreview, setShowPreview] = useState<boolean>(true);
	const [dynamicStyles, setDynamicStyles] = useState<React.CSSProperties>({});

	const data = response?.data as JsonLd.Data.BaseData;

	// Set Preview to a fixed height to enable transitions
	const onPreviewRender = useCallback(() => {
		if (previewBlockRef.current) {
			const previewHeight = previewBlockRef.current?.getBoundingClientRect().height;
			setDynamicStyles({
				borderTopLeftRadius: token('border.radius.200'),
				borderTopRightRadius: token('border.radius.200'),
				marginBottom: fg('platform-linking-visual-refresh-v1') ? token('space.100') : '0.5rem',
				...(previewHeight ? { height: `${previewHeight}px` } : {}),
			});
		}
	}, []);

	// On error set Preview to Fallback height with transition
	const onPreviewError = useCallback(() => {
		if (transitionStarted.current === false) {
			setDynamicStyles({
				transition: 'height 300ms ease-in-out',
				height: `${fallbackElementHeight}px`,
			});
			transitionStarted.current = true;
		}
	}, [fallbackElementHeight]);

	const onPreviewTransitionEnd = useCallback(() => {
		setShowPreview(false);
	}, []);

	if (fg('smart_links_noun_support')) {
		return showPreview && extractSmartLinkPreviewImage(response) ? (
			<PreviewBlock
				onError={onPreviewError}
				ignoreContainerPadding={true}
				onTransitionEnd={onPreviewTransitionEnd}
				blockRef={previewBlockRef}
				onRender={onPreviewRender}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={dynamicStyles}
			/>
		) : null;
	}

	return showPreview && data && extractPreview(data) ? (
		<PreviewBlock
			onError={onPreviewError}
			ignoreContainerPadding={true}
			onTransitionEnd={onPreviewTransitionEnd}
			blockRef={previewBlockRef}
			onRender={onPreviewRender}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={dynamicStyles}
		/>
	) : null;
};

export default ImagePreview;
