/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Viewport calculations require styles outside @atlaskit/css's schema.
import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

// Viewport clamping requires modifiers, which the top-layer adapter does not support.
import { Popper, type PopperChildrenProps } from '@atlaskit/popper/react-popper';
import { token } from '@atlaskit/tokens';

import type { QuickInsertPreview } from './preview';
import { QuickInsertPreviewContent } from './QuickInsertPreviewContent';

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
});

/** The selected item's description and attribution are announced through its aria-describedby. */
export const QuickInsertHoverPreview = ({
	description,
	icon,
	id,
	preview,
	popupsMountPoint,
	referenceElement,
	shouldClampText = true,
	title,
	titleContent,
	useViewportPositioning,
}: {
	description?: string;
	icon?: ReactNode;
	id: string;
	popupsMountPoint?: HTMLElement;
	preview: QuickInsertPreview;
	referenceElement: HTMLElement;
	shouldClampText?: boolean;
	title: string;
	/** Rich content rendered in place of the title. */
	titleContent?: ReactNode;
	useViewportPositioning: boolean;
}): React.JSX.Element => {
	const hasAccessibleContent = Boolean(description || preview.attribution);
	const portalTarget = popupsMountPoint ?? referenceElement.ownerDocument.body;

	return createPortal(
		<Popper
			placement="right-start"
			referenceElement={referenceElement}
			// A fixed slash preview can flip outside a scrolling panel while staying in its host portal.
			strategy={useViewportPositioning || !popupsMountPoint ? 'fixed' : 'absolute'}
			modifiers={PREVIEW_MODIFIERS}
		>
			{({ ref, style, update }) => (
				<div ref={ref} css={styles.positioner} style={style}>
					<QuickInsertPreviewPanel
						description={description}
						icon={icon}
						id={hasAccessibleContent ? id : undefined}
						preview={preview}
						popupsMountPoint={popupsMountPoint}
						referenceElement={referenceElement}
						shouldClampText={shouldClampText}
						title={title}
						titleContent={titleContent}
						update={update}
						useViewportPositioning={useViewportPositioning}
					/>
				</div>
			)}
		</Popper>,
		portalTarget,
	);
};

const QuickInsertPreviewPanel = ({
	description,
	icon,
	id,
	preview,
	popupsMountPoint,
	referenceElement,
	shouldClampText,
	title,
	titleContent,
	update,
	useViewportPositioning,
}: {
	description?: string;
	icon?: ReactNode;
	id?: string;
	popupsMountPoint?: HTMLElement;
	preview: QuickInsertPreview;
	referenceElement: HTMLElement;
	shouldClampText: boolean;
	title: string;
	titleContent?: ReactNode;
	update: PopperChildrenProps['update'];
	useViewportPositioning: boolean;
}): React.JSX.Element => {
	const [panelElement, setPanelElement] = useState<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		void update();
		const { ownerDocument } = referenceElement;
		const onScroll = () => void update();
		const unbindScrollListener = bind(ownerDocument, {
			type: 'scroll',
			listener: onScroll,
			options: true,
		});

		const MutationObserverConstructor = ownerDocument.defaultView?.MutationObserver;
		let mountPositionObserver: MutationObserver | undefined;
		if (useViewportPositioning && popupsMountPoint && MutationObserverConstructor) {
			// Panning can move a host mount without firing a scroll or resize event.
			mountPositionObserver = new MutationObserverConstructor(() => void update());
			mountPositionObserver.observe(popupsMountPoint, {
				attributes: true,
				attributeFilter: ['class', 'style'],
			});
		}

		const ResizeObserverConstructor = ownerDocument.defaultView?.ResizeObserver;
		let resizeObserver: ResizeObserver | undefined;
		if (panelElement && ResizeObserverConstructor) {
			resizeObserver = new ResizeObserverConstructor(() => void update());
			resizeObserver.observe(panelElement);
			resizeObserver.observe(referenceElement);
			if (popupsMountPoint) {
				resizeObserver.observe(popupsMountPoint);
			}
		}

		return () => {
			unbindScrollListener();
			resizeObserver?.disconnect();
			mountPositionObserver?.disconnect();
		};
	}, [panelElement, popupsMountPoint, referenceElement, update, useViewportPositioning]);

	return (
		<div
			ref={setPanelElement}
			id={id}
			role={id ? 'tooltip' : undefined}
			css={styles.panel}
			data-testid="quick-insert-preview-panel"
		>
			<QuickInsertPreviewContent
				description={description}
				icon={icon}
				preview={preview}
				shouldClampText={shouldClampText}
				title={titleContent ?? title}
			/>
		</div>
	);
};
