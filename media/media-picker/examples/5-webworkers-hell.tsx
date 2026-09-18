// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';

import Button from '@atlaskit/button/default/button';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import {
	defaultMediaPickerCollectionName,
	mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import { MainWrapper } from '../example-helpers/mainWrapper';
import { PopupContainer } from '../example-helpers/PopupContainer';
import { PopupHeader } from '../example-helpers/PopupHeader';
import { PreviewsTitle } from '../example-helpers/PreviewsTitle';
import { PreviewsWrapper } from '../example-helpers/PreviewsWrapper';
import { UploadPreview } from '../example-helpers/upload-preview';
import { BrowserLoader as Browser } from '../src/components/browser';
import { type BrowserConfig, type UploadPreviewUpdateEventPayload } from '../src/types';

export interface BrowserWrapperState {
	previewsData: any[];
	isOpen: boolean;
}

const mediaClientConfig: MediaClientConfig = {
	authProvider: mediaPickerAuthProvider(),
};

const browseConfig: BrowserConfig = {
	multiple: true,
	fileExtensions: ['image/jpeg', 'image/png'],
	uploadParams: {
		collection: defaultMediaPickerCollectionName,
	},
};

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
	dropzoneContainer?: HTMLDivElement;

	state: BrowserWrapperState = {
		previewsData: [],
		isOpen: false,
	};

	renderBrowser = (key: number) => {
		const { isOpen } = this.state;

		return (
			<Browser
				key={key}
				mediaClientConfig={mediaClientConfig}
				config={browseConfig}
				isOpen={isOpen}
				onClose={this.onClose}
				onPreviewUpdate={this.onUploadPreviewUpdate}
			/>
		);
	};

	onUploadPreviewUpdate = (data: UploadPreviewUpdateEventPayload) => {
		this.setState({ previewsData: [...this.state.previewsData, data] });
	};

	onOpen = () => () => {
		this.setState({
			isOpen: true,
		});
	};

	onClose = () => {
		this.setState({ isOpen: false });
	};

	private renderPreviews = () => {
		const { previewsData } = this.state;

		return previewsData.map((previewsData, index) => (
			<UploadPreview key={`${index}`} fileId={previewsData.fileId} />
		));
	};

	render() {
		const array = Array.from({ length: 5 });
		const buttons = array.map((_: any, key: number) => {
			return (
				<Button key={key} appearance="primary" onClick={this.onOpen}>
					Open
				</Button>
			);
		});
		const browsers = array.map((_: any, key: number) => this.renderBrowser(key));

		return (
			<MainWrapper>
				<PopupContainer>
					<PopupHeader>{buttons}</PopupHeader>
					<PreviewsWrapper>
						<PreviewsTitle>Upload previews</PreviewsTitle>
						{this.renderPreviews()}
						{browsers}
					</PreviewsWrapper>
				</PopupContainer>
			</MainWrapper>
		);
	}
}

export default (): React.JSX.Element => <BrowserWrapper />;
