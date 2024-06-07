import React from 'react';

import { type CreateUIAnalyticsEvent, withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
	ANALYTICS_MEDIA_CHANNEL,
	type MediaFeatureFlags,
	withMediaAnalyticsContext,
} from '@atlaskit/media-common';

import { LocalUploadComponentReact, type LocalUploadComponentBaseProps } from '../localUploadReact';

import { LocalFileSource, type LocalFileWithSource, type UploadService } from '../../service/types';

import { type ClipboardPastePayload, type ClipboardConfig } from '../../types';
import { getPackageAttributes } from '../../util/analytics';
import { appendTimestamp } from '../../util/appendTimestamp';
import ErrorFlagGroup from '../errorFlagGroup/ErrorFlagGroup';

export const getFilesFromClipboard = (files: FileList) => {
	return Array.from(files).map((file) => {
		if (file.type.indexOf('image/') === 0) {
			const name = appendTimestamp(file.name, (file as any).lastModified);
			return new File([file], name, {
				type: file.type,
			});
		} else {
			return file;
		}
	});
};

export interface ClipboardOwnProps {
	config: ClipboardConfig;
}

export type ClipboardProps = LocalUploadComponentBaseProps & {
	config: ClipboardConfig;
};

const defaultConfig: ClipboardConfig = { uploadParams: {} };
const COMPONENT_NAME = 'clipboard';

class ClipboardImpl {
	static instances: ClipboardImpl[] = [];

	constructor(
		private readonly uploadService: UploadService,
		private container?: HTMLElement,
		private onPaste?: (event: ClipboardEvent) => boolean | undefined,
		private readonly createAnalyticsEvent?: CreateUIAnalyticsEvent,
		public featureFlags?: MediaFeatureFlags,
	) {}

	static get latestInstance(): ClipboardImpl | undefined {
		return ClipboardImpl.instances[ClipboardImpl.instances.length - 1];
	}

	public activate(): void {
		this.deactivate();

		if (!this.container) {
			document.addEventListener('paste', ClipboardImpl.legacyHandleEvent);
			ClipboardImpl.instances.push(this);
		} else {
			this.container.addEventListener('paste', this.handleEvent);
		}
	}

	public deactivate(): void {
		if (!this.container) {
			const index = ClipboardImpl.instances.indexOf(this);
			if (index > -1) {
				ClipboardImpl.instances.splice(index, 1);
			} else {
				/**
				 * We want to remove the handleEvent only when there are no more instances.
				 * Since handleEvent is static, if we remove it right away, and there is still an active instance,
				 * we will loose the clipboard functionality.
				 */
				document.removeEventListener('paste', ClipboardImpl.legacyHandleEvent);
			}
		} else {
			this.container.removeEventListener('paste', this.handleEvent);
		}
	}

	public onFilesPasted(files: LocalFileWithSource[]) {
		this.uploadService.addFilesWithSource(files);
		this.fireAnalyticsEvent(files);
	}

	private fireAnalyticsEvent(files: LocalFileWithSource[]): void {
		if (this.createAnalyticsEvent) {
			const payload: ClipboardPastePayload = {
				eventType: 'ui',
				action: 'pasted',
				actionSubject: 'clipboard',
				attributes: {
					fileCount: files.length,
					fileAttributes: files.map(({ file: { type, size }, source }) => ({
						fileSource: source,
						fileMimetype: type,
						fileSize: size,
					})),
				},
			};

			const analyticsEvent = this.createAnalyticsEvent(payload);
			analyticsEvent.fire(ANALYTICS_MEDIA_CHANNEL);
		}
	}

	// The existing (semi)singleton (last in `instances`) event handler is proven to be problematic
	// Replaced with the new mechanism in https://product-fabric.atlassian.net/browse/MEX-2454
	// Remove after product adoption / rollout
	static legacyHandleEvent = (event: ClipboardEvent): void => {
		// From https://product-fabric.atlassian.net/browse/MEX-1281 ,disable the handler if event target is input
		if (event.target instanceof HTMLInputElement) {
			return;
		}

		// last in, first served to support multiple instances listening at once
		const instance = ClipboardImpl.latestInstance;
		if (instance) {
			/*
        Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
        @see https://hello.atlassian.net/wiki/spaces/FIL/pages/141485494/RFC+099+Clipboard+browser+inconsistency

        TODO https://product-fabric.atlassian.net/browse/BMPT-1285 Investigate implementation
      */
			const { clipboardData } = event;

			if (clipboardData && clipboardData.files) {
				const fileSource =
					clipboardData.types.length === 1
						? LocalFileSource.PastedScreenshot
						: LocalFileSource.PastedFile;

				const filesArray: LocalFileWithSource[] = getFilesFromClipboard(clipboardData.files).map(
					(file: File) => ({ file, source: fileSource }),
				);
				// only the latest instance gets the event

				if (filesArray.length > 0) {
					instance.onFilesPasted.call(instance, filesArray);
				}
			}
		}
	};

	private handleEvent = (event: ClipboardEvent): void => {
		const { clipboardData } = event;
		if (this.onPaste?.(event)) {
			return;
		}

		// From https://product-fabric.atlassian.net/browse/MEX-1281 ,disable the handler if event target is input
		if (event.target instanceof HTMLInputElement) {
			return;
		}

		if (clipboardData && clipboardData.files) {
			const fileSource =
				clipboardData.types.length === 1
					? LocalFileSource.PastedScreenshot
					: LocalFileSource.PastedFile;

			const filesArray: LocalFileWithSource[] = getFilesFromClipboard(clipboardData.files).map(
				(file: File) => ({ file, source: fileSource }),
			);
			if (filesArray.length > 0) {
				this.onFilesPasted(filesArray);
			}
		}
	};
}

export class ClipboardBase extends LocalUploadComponentReact<ClipboardProps> {
	clipboard: ClipboardImpl;

	constructor(props: ClipboardProps) {
		super(props, COMPONENT_NAME);

		this.clipboard = new ClipboardImpl(
			this.uploadService,
			this.props.config.container,
			this.props.config.onPaste,
			this.props.createAnalyticsEvent,
			props.featureFlags,
		);
	}

	static defaultProps = {
		config: defaultConfig,
	};

	componentDidMount() {
		this.clipboard.activate();
	}

	componentDidUpdate(prevProps: ClipboardProps) {
		if (prevProps.featureFlags !== this.props.featureFlags) {
			this.clipboard.featureFlags = this.props.featureFlags;
		}
		// refreshes uploadParams as only set once in parent constructor
		if (prevProps.config.uploadParams !== this.props.config.uploadParams) {
			this.setUploadParams(this.props.config.uploadParams);
		}
	}

	componentWillUnmount() {
		this.clipboard.deactivate();
	}

	render() {
		return (
			<ErrorFlagGroup flagData={this.state.errorFlags} onFlagDismissed={this.dismissErrorFlag} />
		);
	}
}

export default ClipboardBase;

export const Clipboard = withMediaAnalyticsContext(getPackageAttributes(COMPONENT_NAME))(
	withAnalyticsEvents()(ClipboardBase),
);
