/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Viewport calculations and multiline clamping require styles outside @atlaskit/css's schema.
import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

// Viewport clamping requires modifiers, which the top-layer adapter does not support.
import { Popper, type PopperChildrenProps } from '@atlaskit/popper/react-popper';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

import { messages } from './messages';
import type { QuickInsertPreview } from './preview';

const PREVIEW_MODIFIERS = [
	{ name: 'offset', options: { offset: [0, 4] } },
	{
		name: 'flip',
		options: {
			fallbackPlacements: ['left-start'],
			// Choose the side by horizontal space; vertical overflow is shifted into view.
			altAxis: false,
			padding: 8,
			rootBoundary: 'viewport',
		},
	},
	{
		name: 'preventOverflow',
		options: {
			mainAxis: true,
			altAxis: true,
			tether: false,
			padding: 8,
			rootBoundary: 'viewport',
		},
	},
];

const styles = cssMap({
	positioner: {
		maxHeight: 'calc(100vh - 16px)',
		maxWidth: 'calc(100vw - 16px)',
		// Keep the preview above the editor's floating menu layer.
		zIndex: 510,
	},
	panel: {
		boxSizing: 'border-box',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		maxHeight: 'inherit',
		maxWidth: '100%',
		overflow: 'hidden',
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		width: '264px',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
	title: {
		color: token('color.text.subtle'),
		font: token('font.heading.xsmall'),
		overflow: 'hidden',
		overflowWrap: 'anywhere',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
	description: {
		color: token('color.text'),
		display: '-webkit-box',
		font: token('font.body'),
		overflow: 'hidden',
		overflowWrap: 'anywhere',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 4,
	},
	imageArea: {
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.small'),
		height: '120px',
		marginBlockEnd: token('space.100'),
		maxWidth: '100%',
		overflow: 'hidden',
		width: '240px',
	},
	image: {
		display: 'block',
		height: '100%',
		objectFit: 'contain',
		width: '100%',
	},
	imageHidden: {
		visibility: 'hidden',
	},
	attribution: {
		alignItems: 'center',
		color: token('color.text.subtle'),
		display: 'flex',
		font: token('font.body.small'),
		gap: token('space.050'),
		overflowWrap: 'anywhere',
	},
	attributionIcon: {
		alignItems: 'center',
		display: 'flex',
		flex: '0 0 16px',
		height: '16px',
		justifyContent: 'center',
		width: '16px',
	},
});

/** The selected item's description and attribution are announced through its aria-describedby. */
export const QuickInsertHoverPreview = ({
	description,
	id,
	preview,
	referenceElement,
	title,
}: {
	description?: string;
	id: string;
	preview: QuickInsertPreview;
	referenceElement: HTMLElement;
	title: string;
}): React.JSX.Element => {
	const { colorMode } = useThemeObserver();
	const imageUrl = preview.image
		? colorMode === 'dark' && preview.image.dark
			? preview.image.dark
			: preview.image.light
		: undefined;
	const hasAccessibleContent = Boolean(description || preview.attribution);

	return createPortal(
		<Popper
			placement="right-start"
			referenceElement={referenceElement}
			strategy="fixed"
			modifiers={PREVIEW_MODIFIERS}
		>
			{({ ref, style, update }) => (
				<div ref={ref} css={styles.positioner} style={style}>
					<QuickInsertPreviewPanel
						description={description}
						id={hasAccessibleContent ? id : undefined}
						imageUrl={imageUrl}
						preview={preview}
						referenceElement={referenceElement}
						title={title}
						update={update}
					/>
				</div>
			)}
		</Popper>,
		referenceElement.ownerDocument.body,
	);
};

const QuickInsertPreviewPanel = ({
	description,
	id,
	imageUrl,
	preview,
	referenceElement,
	title,
	update,
}: {
	description?: string;
	id?: string;
	imageUrl?: string;
	preview: QuickInsertPreview;
	referenceElement: HTMLElement;
	title: string;
	update: PopperChildrenProps['update'];
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const [panelElement, setPanelElement] = useState<HTMLDivElement | null>(null);
	const AttributionIcon = preview.attribution?.icon;

	useLayoutEffect(() => {
		void update();
		const ResizeObserverConstructor = referenceElement.ownerDocument.defaultView?.ResizeObserver;
		if (!panelElement || !ResizeObserverConstructor) {
			return;
		}

		const observer = new ResizeObserverConstructor(() => void update());
		observer.observe(panelElement);
		return () => observer.disconnect();
	}, [panelElement, referenceElement, update]);

	return (
		<div
			ref={setPanelElement}
			id={id}
			role={id ? 'tooltip' : undefined}
			css={styles.panel}
			data-testid="quick-insert-preview-panel"
		>
			{imageUrl && <PreviewImage key={imageUrl} imageUrl={imageUrl} />}
			<div css={styles.content}>
				<div aria-hidden="true" css={styles.title}>
					{title}
				</div>
				{description && <div css={styles.description}>{description}</div>}
				{preview.attribution && (
					<div css={styles.attribution}>
						{AttributionIcon && (
							<span aria-hidden="true" css={styles.attributionIcon}>
								<AttributionIcon />
							</span>
						)}
						<Text size="small" color="color.text.subtle">
							{AttributionIcon
								? preview.attribution.name
								: formatMessage(messages.previewAttributionBy, { name: preview.attribution.name })}
						</Text>
					</div>
				)}
			</div>
		</div>
	);
};

const PreviewImage = ({ imageUrl }: { imageUrl: string }): React.JSX.Element => {
	const [hasFailed, setHasFailed] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	return (
		<div css={styles.imageArea} aria-hidden="true" data-testid="quick-insert-preview-image-area">
			{!hasFailed && (
				<img
					css={[styles.image, !hasLoaded && styles.imageHidden]}
					aria-hidden="true"
					data-testid="quick-insert-hover-preview"
					src={imageUrl}
					alt=""
					onLoad={() => setHasLoaded(true)}
					onError={() => setHasFailed(true)}
				/>
			)}
		</div>
	);
};
