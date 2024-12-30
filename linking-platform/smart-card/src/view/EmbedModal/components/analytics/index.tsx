import React, { type ErrorInfo, useCallback } from 'react';

import { CardDisplay } from '../../../../constants';
import {
	failUfoExperience,
	startUfoExperience,
	succeedUfoExperience,
} from '../../../../state/analytics';
import { type EmbedModalContext, type EmbedModalProps, EmbedModalSize } from '../../types';

import { type WithAnalytics } from './types';

const getResizeFrom = (size?: EmbedModalSize): EmbedModalSize =>
	size === EmbedModalSize.Small ? EmbedModalSize.Large : EmbedModalSize.Small;

const withAnalytics =
	(Component: React.ComponentType<EmbedModalProps>) => (props: EmbedModalProps & WithAnalytics) => {
		const { fireEvent, extensionKey, id, onClose, onOpen, onOpenFailed, onResize, origin } = props;

		const handleOnOpen = useCallback(
			(context: EmbedModalContext) => {
				fireEvent?.('screen.embedPreviewModal.viewed', {
					origin: origin ?? null,
					size: context.size,
				});

				succeedUfoExperience('smart-link-rendered', id || 'NULL', {
					extensionKey,
					display: CardDisplay.EmbedPreview,
				});

				// UFO will disregard this if authentication experience has not yet been started
				succeedUfoExperience('smart-link-authenticated', id || 'NULL', {
					display: CardDisplay.EmbedPreview,
				});

				fireEvent?.('ui.smartLink.renderSuccess', {
					display: CardDisplay.EmbedPreview,
				});

				if (onOpen) {
					onOpen(context);
				}
			},
			[fireEvent, extensionKey, id, onOpen, origin],
		);

		const handleOnOpenFailed = useCallback(
			(error: Error, errorInfo: ErrorInfo) => {
				startUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-authenticated', id || 'NULL');
				fireEvent?.('ui.smartLink.renderFailed', {
					display: CardDisplay.EmbedPreview,
					error: error as any,
					errorInfo: errorInfo as any,
					id: id ?? null,
				});

				if (onOpenFailed) {
					onOpenFailed(error, errorInfo);
				}
			},
			[fireEvent, id, onOpenFailed],
		);

		const handleOnClose = useCallback(
			(context: EmbedModalContext) => {
				fireEvent?.('ui.modal.closed.embedPreview', {
					origin: origin ?? null,
					previewTime: context.duration ?? null,
					size: context.size,
				});

				if (onClose) {
					onClose(context);
				}
			},
			[fireEvent, onClose, origin],
		);

		const handleOnResize = useCallback(
			(context: EmbedModalContext) => {
				fireEvent?.('ui.button.clicked.embedPreviewResize', {
					newSize: context.size,
					origin: origin ?? null,
					previousSize: getResizeFrom(context.size),
				});

				if (onResize) {
					onResize(context);
				}
			},
			[fireEvent, onResize, origin],
		);

		return (
			<Component
				{...props}
				onClose={handleOnClose}
				onOpen={handleOnOpen}
				onOpenFailed={handleOnOpenFailed}
				onResize={handleOnResize}
			/>
		);
	};

export default withAnalytics;
