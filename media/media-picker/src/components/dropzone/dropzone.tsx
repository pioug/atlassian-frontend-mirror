import React from 'react';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL, withMediaAnalyticsContext } from '@atlaskit/media-common';
import { LocalUploadComponentReact, type LocalUploadComponentBaseProps } from '../localUploadReact';

import { getPackageAttributes } from '../../util/analytics';

import {
	type DropzoneConfig,
	type DropzoneEventAction,
	type DropzoneEventPayload,
} from '../../types';

import { type DropzoneDragEnterEventPayload, type DropzoneDragLeaveEventPayload } from '../types';
import ErrorFlagGroup from '../errorFlagGroup/ErrorFlagGroup';

export type DropzoneProps = LocalUploadComponentBaseProps & {
	//config
	config: DropzoneConfig;
	//Fired when a file is dropped on the drop zone
	onDrop?: () => void;
	//Fired when a file is dragged over the drop zone
	onDragEnter?: (payload: DropzoneDragEnterEventPayload) => void;
	//Fired when a file is dragged away from the drop zone after entering
	onDragLeave?: (payload: DropzoneDragLeaveEventPayload) => void;
	//Provides a callback which can be used to manually cancel an upload if required
	onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
};

function dragContainsFiles(event: DragEvent): boolean {
	if (!event.dataTransfer) {
		return false;
	}
	const { types } = event.dataTransfer;
	return Array.from(types).indexOf('Files') > -1;
}

const COMPONENT_NAME = 'dropzone';

export class DropzoneBase extends LocalUploadComponentReact<DropzoneProps> {
	private uiActive: boolean = false;

	constructor(props: DropzoneProps) {
		super(props, COMPONENT_NAME);
	}

	private getContainer(): HTMLElement {
		const {
			config: { container },
		} = this.props;
		return container || document.body;
	}

	public componentDidMount() {
		const { onCancelFn } = this.props;
		this.addContainerListeners(this.getContainer());
		if (onCancelFn) {
			onCancelFn(this.cancel);
		}
	}

	public componentWillUnmount(): void {
		this.removeContainerListeners(this.getContainer());
	}

	public UNSAFE_componentWillReceiveProps(nextProps: DropzoneProps): void {
		const {
			config: { container: newContainer },
		} = nextProps;

		const {
			config: { container: oldContainer },
		} = this.props;

		if (newContainer !== oldContainer) {
			this.removeContainerListeners(oldContainer);
			this.addContainerListeners(newContainer);
		}
	}

	private addContainerListeners = (container: HTMLElement | undefined) => {
		const target = container ?? this.getContainer();
		// TODO: migrate this file to Pragmatic drag and drop
		/* eslint-disable @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop */
		target.addEventListener('dragover', this.onDragOver, false);
		target.addEventListener('dragleave', this.onDragLeave, false);
		target.addEventListener('drop', this.onFileDropped);
		/* eslint-enable @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop */
	};

	private removeContainerListeners = (container: HTMLElement | undefined) => {
		const target = container ?? this.getContainer();
		target.removeEventListener('dragover', this.onDragOver, false);
		target.removeEventListener('dragleave', this.onDragLeave, false);
		target.removeEventListener('drop', this.onFileDropped);
	};

	private onDragOver = (event: DragEvent): void => {
		event.preventDefault();
		if (event.dataTransfer && dragContainsFiles(event)) {
			const dataTransfer = event.dataTransfer;
			let allowed;

			try {
				allowed = dataTransfer.effectAllowed;
			} catch (e) {} // the error is expected in IE11

			dataTransfer.dropEffect = 'move' === allowed || 'linkMove' === allowed ? 'move' : 'copy';
			const length = this.getDraggedItemsLength(dataTransfer);
			// [EDM-1636]: needed in order to make multiple dropzones in the page to work
			event.stopPropagation();
			this.emitDragOver({ length });
		}
	};

	private onDragLeave = (e: DragEvent): void => {
		if (e.dataTransfer) {
			e.preventDefault();
			let length = 0;
			if (dragContainsFiles(e)) {
				const dataTransfer = e.dataTransfer;
				length = this.getDraggedItemsLength(dataTransfer);
			}
			this.emitDragLeave({ length });
		}
	};

	private readonly onFileDropped = async (dragEvent: DragEvent) => {
		if (!dragEvent.dataTransfer) {
			return;
		}

		dragEvent.preventDefault();
		dragEvent.stopPropagation();
		// refreshes uploadParams as only set once in parent constructor
		this.setUploadParams(this.props.config.uploadParams);
		this.onDrop(dragEvent);

		const files = Array.from(dragEvent.dataTransfer.files);

		this.uploadService.addFiles(files);
	};
	// Cross-browser way of getting dragged items length, we prioritize "items" if present
	// https://www.w3.org/TR/html51/editing.html#the-datatransfer-interface
	// This method is used on 'dragover' and we have no way to retrieve FileSystemFileEntry,
	// which contains info about if the dropped item is a file or directory. That info is only
	// available on 'drop'
	private getDraggedItemsLength(dataTransfer: DataTransfer): number {
		if (dataTransfer.items) {
			const items = Array.from(dataTransfer.items);
			return items.filter((i: DataTransferItem) => i.kind === 'file').length;
		}
		// This is required for IE11
		return dataTransfer.files.length;
	}

	private onDrop = (e: DragEvent): void => {
		if (e.dataTransfer && dragContainsFiles(e)) {
			const dataTransfer = e.dataTransfer;
			const fileCount = this.getDraggedItemsLength(dataTransfer);

			this.sendAnalyticsAndEmitDragLeave(fileCount);
		}
	};

	private sendAnalyticsAndEmitDragLeave = (fileCount: number): void => {
		this.fireAnalyticsEvent('droppedInto', fileCount);

		if (this.props.onDrop) {
			this.props.onDrop();
		}
		this.emitDragLeave({ length: fileCount });
	};

	private emitDragOver(payload: DropzoneDragEnterEventPayload): void {
		if (!this.uiActive) {
			const { onDragEnter } = this.props;
			this.uiActive = true;

			this.fireAnalyticsEvent('draggedInto', payload.length);

			if (onDragEnter) {
				onDragEnter(payload);
			}
		}
	}

	private emitDragLeave(payload: DropzoneDragLeaveEventPayload): void {
		if (this.uiActive) {
			this.uiActive = false;
			/*
       when drag over child elements, container will issue dragleave and then dragover immediately.
       The 50ms timeout will prevent from issuing that "false" dragleave event
       */
			window.setTimeout(() => {
				if (!this.uiActive) {
					const { onDragLeave } = this.props;

					this.fireAnalyticsEvent('draggedOut', payload.length);

					if (onDragLeave) {
						onDragLeave(payload);
					}
				}
			}, 50);
		}
	}

	private fireAnalyticsEvent(action: DropzoneEventAction, fileCount: number): void {
		const { createAnalyticsEvent } = this.props;

		if (createAnalyticsEvent) {
			const payload: DropzoneEventPayload = {
				eventType: 'ui',
				actionSubject: 'dropzone',
				action,
				attributes: {
					fileCount,
				},
			};

			const analyticsEvent = createAnalyticsEvent(payload);
			analyticsEvent.fire(ANALYTICS_MEDIA_CHANNEL);
		}
	}

	render(): React.JSX.Element {
		return (
			<ErrorFlagGroup flagData={this.state.errorFlags} onFlagDismissed={this.dismissErrorFlag} />
		);
	}
}
export default DropzoneBase;
export const Dropzone = withMediaAnalyticsContext(getPackageAttributes(COMPONENT_NAME))(
	withAnalyticsEvents()(DropzoneBase),
);
