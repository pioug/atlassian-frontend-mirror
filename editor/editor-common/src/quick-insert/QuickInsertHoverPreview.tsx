/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { cssMap, jsx } from '@atlaskit/css';
import { Popper } from '@atlaskit/popper/main';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

const PREVIEW_WIDTH = 294;
const PREVIEW_OFFSET: [number, number] = [-4, 4];
const PREVIEW_MODIFIERS = [{ name: 'preventOverflow', options: { mainAxis: false } }];

const styles = cssMap({
	image: {
		display: 'block',
		// Match the editor's floating dialog layer (the slash-command menu).
		zIndex: 510,
	},
	hidden: {
		visibility: 'hidden',
	},
	visible: {
		visibility: 'visible',
	},
});

/** A non-interactive visual preview: keep focus and keyboard handling in the editor. */
export const QuickInsertHoverPreview = ({
	previewImageUrls,
	referenceElement,
}: {
	previewImageUrls: { dark?: string; light: string };
	referenceElement: HTMLElement;
}): React.JSX.Element => {
	const { colorMode } = useThemeObserver();
	const previewImageUrl =
		colorMode === 'dark' && previewImageUrls.dark ? previewImageUrls.dark : previewImageUrls.light;

	return (
		<QuickInsertHoverPreviewImage
			key={previewImageUrl}
			previewImageUrl={previewImageUrl}
			referenceElement={referenceElement}
		/>
	);
};

const QuickInsertHoverPreviewImage = ({
	previewImageUrl,
	referenceElement,
}: {
	previewImageUrl: string;
	referenceElement: HTMLElement;
}): React.JSX.Element | null => {
	const [hasFailed, setHasFailed] = useState(false);
	const [dimensions, setDimensions] = useState<{ height: number; width: number }>();

	if (hasFailed) {
		return null;
	}

	// Unlike a dialog popup, this decorative preview must not introduce focus or ARIA ownership.
	return createPortal(
		<Popper
			offset={PREVIEW_OFFSET}
			placement="right-start"
			referenceElement={referenceElement}
			strategy="fixed"
			shouldFitViewport
			modifiers={PREVIEW_MODIFIERS}
		>
			{({ ref, style }) => (
				<img
					ref={ref}
					css={[styles.image, dimensions ? styles.visible : styles.hidden]}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Popper positioning and intrinsic image dimensions are runtime values.
						...style,
						height: dimensions?.height,
						width: dimensions?.width,
					}}
					aria-hidden="true"
					data-testid="quick-insert-hover-preview"
					src={previewImageUrl}
					alt=""
					onLoad={(event) => {
						const { naturalHeight, naturalWidth } = event.currentTarget;
						if (naturalWidth === 0) {
							return;
						}
						setDimensions({
							height: (naturalHeight / naturalWidth) * PREVIEW_WIDTH,
							width: PREVIEW_WIDTH,
						});
					}}
					onError={() => setHasFailed(true)}
				/>
			)}
		</Popper>,
		referenceElement.ownerDocument.body,
	);
};
