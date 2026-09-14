import React from 'react';

import { isValidUuid } from '@atlaskit/media-common/isValidUuid';

import { type BrowserConfig } from '../../types';
import ErrorFlagGroup from '../errorFlagGroup/ErrorFlagGroup';
import { LocalUploadComponentReact } from '../localUploadReact';
import type { BrowseFn, BrowserProps } from './browser';
import { COMPONENT_NAME } from './componentName';

const defaultConfig: BrowserConfig = { uploadParams: {} };

export class BrowserBase extends LocalUploadComponentReact<BrowserProps> {
	private browserRef = React.createRef<HTMLInputElement>();

	constructor(props: BrowserProps) {
		super(props, COMPONENT_NAME);
		const { config, onError } = props;

		const { replaceFileId } = config;
		if (replaceFileId && !isValidUuid(replaceFileId)) {
			this.createAndFireAnalyticsEvent({
				eventType: 'operational',
				action: 'failed',
				actionSubject: 'mediaUpload',
				actionSubjectId: 'localMedia',
				attributes: {
					status: 'fail',
					failReason: 'invalid_uuid',
					uuid: replaceFileId,
				},
			});
			onError &&
				onError({
					fileId: replaceFileId,
					error: {
						description: 'Invalid replaceFileId format',
						name: 'invalid_uuid',
						fileId: replaceFileId,
					},
				});
		}
	}

	static defaultProps: {
		config: BrowserConfig;
	} = {
		config: defaultConfig,
	};

	private onFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target) {
			return;
		}

		const { replaceFileId } = this.props.config;
		const filesArray = [].slice.call(event.target.files);

		// refreshes uploadParams as only set once in parent constructor
		this.setUploadParams(this.props.config.uploadParams);

		try {
			if (replaceFileId) {
				this.uploadService.addFile(filesArray[0], replaceFileId);
			} else {
				this.uploadService.addFiles(filesArray);
			}
		} finally {
			if (this.browserRef.current) {
				this.browserRef.current.value = '';
			}
		}
	};

	componentDidMount(): void {
		const { onBrowseFn, onCancelFn, isOpen } = this.props;

		if (onBrowseFn) {
			onBrowseFn(this.browse);
		}

		if (onCancelFn) {
			onCancelFn(this.cancel);
		}

		if (isOpen) {
			this.browse();
		}
	}

	componentDidUpdate(prevProps: BrowserProps): void {
		const { isOpen } = this.props;
		const { isOpen: prevIsOpen } = prevProps;

		if (isOpen && isOpen !== prevIsOpen) {
			this.browse();
		}
	}

	public browse: BrowseFn = () => {
		const { onClose } = this.props;
		if (!this.browserRef.current) {
			return;
		}

		this.browserRef.current.click();
		// Calling onClose directly since there is no dom api to notify us when
		// the native file picker is closed
		if (onClose) {
			onClose();
		}
	};

	render(): React.JSX.Element {
		const { config, children } = this.props;
		const { multiple, replaceFileId } = config;
		const fileExtensions = config.fileExtensions && config.fileExtensions.join(',');

		return (
			<>
				<input
					data-testid="media-picker-file-input"
					ref={this.browserRef}
					type="file"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ display: 'none' }}
					multiple={
						replaceFileId
							? false
							: multiple /* if the consumer passes the fileId we must work in single selection mode */
					}
					accept={fileExtensions}
					onChange={this.onFilePicked}
				/>
				{children ? children(this.browse) : null}
				<ErrorFlagGroup flagData={this.state.errorFlags} onFlagDismissed={this.dismissErrorFlag} />
			</>
		);
	}
}
