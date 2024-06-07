// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import {
	defaultMediaPickerCollectionName,
	createUploadMediaClientConfig,
	createStorybookMediaClientConfig,
	fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/new';
import Toggle from '@atlaskit/toggle';
import Spinner from '@atlaskit/spinner';
import { type FileState } from '@atlaskit/media-client';

import {
	MainWrapper,
	UploadPreviews,
	DropzoneContainer,
	PopupHeader,
	PopupContainer,
	DropzoneContentWrapper,
	DropzoneItemsInfo,
} from '../example-helpers';
import { Dropzone } from '../src';
import { type DropzoneConfig, type UploadsStartEventPayload } from '../src/types';

export interface DropzoneWrapperState {
	isConnectedToUsersCollection: boolean;
	isActive: boolean;
	isFetchingLastItems: boolean;
	lastItems: any[];
	dropzoneContainer?: HTMLElement;
	fileIds: string[];
}
const mediaClientConfig = createUploadMediaClientConfig();
const nonUserMediaClientConfig = createStorybookMediaClientConfig({
	authType: 'asap',
});

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
	dropzoneContainer?: HTMLDivElement;

	state: DropzoneWrapperState = {
		isConnectedToUsersCollection: true,
		isActive: true,
		isFetchingLastItems: true,
		lastItems: [],
		fileIds: [],
	};

	onUploadsStart = (payload: UploadsStartEventPayload) => {
		const fileIds = payload.files.map(({ id }) => id);
		this.setState({ fileIds });
	};

	renderDragZone = () => {
		const { isConnectedToUsersCollection, isActive, dropzoneContainer } = this.state;

		if (!isActive || !dropzoneContainer) {
			return null;
		}

		const dropzoneMediaClient = isConnectedToUsersCollection
			? fakeMediaClient(mediaClientConfig)
			: fakeMediaClient(nonUserMediaClientConfig);

		dropzoneMediaClient.on('file-added', this.onFileUploaded);

		const config: DropzoneConfig = {
			container: this.state.dropzoneContainer,
			uploadParams: {
				collection: defaultMediaPickerCollectionName,
			},
		};

		return (
			<UploadPreviews>
				{({ onUploadsStart, onError, onPreviewUpdate }) => (
					<Dropzone
						mediaClientConfig={dropzoneMediaClient.config}
						config={config}
						onUploadsStart={(payload) => {
							this.onUploadsStart(payload);
							onUploadsStart(payload);
						}}
						onError={onError}
						onPreviewUpdate={onPreviewUpdate}
					/>
				)}
			</UploadPreviews>
		);
	};

	onFileUploaded = (fileState: FileState) => {
		console.log('onFileUploaded', fileState);
	};

	saveDropzoneContainer = async (element: HTMLDivElement) => {
		this.setState({ dropzoneContainer: element });
	};

	onConnectionChange = () => {
		const isConnectedToUsersCollection = !this.state.isConnectedToUsersCollection;
		this.setState({ isConnectedToUsersCollection });
	};

	onActiveChange = () => {
		const { isActive } = this.state;
		this.setState({ isActive: !isActive });
	};

	renderLastItems = () => {
		const { isFetchingLastItems, lastItems } = this.state;

		if (isFetchingLastItems) {
			return <Spinner size="large" />;
		}

		return lastItems.map((item, key) => {
			const { id, details } = item;

			// details are not always present in the response
			const name = details ? details.name : '<no-details>';
			const mediaType = details ? details.mediaType : '<no-details>';

			return (
				<div key={key}>
					{id} | {name} |{mediaType}
				</div>
			);
		});
	};

	render() {
		const { isConnectedToUsersCollection, isActive } = this.state;

		return (
			<MainWrapper>
				<PopupContainer>
					<PopupHeader>
						<Button appearance="danger">Cancel uploads</Button>
						Connected to users collection
						<Toggle
							defaultChecked={isConnectedToUsersCollection}
							onChange={this.onConnectionChange}
						/>
						Active
						<Toggle defaultChecked={isActive} onChange={this.onActiveChange} />
					</PopupHeader>
					<DropzoneContentWrapper>
						<DropzoneContainer isActive={isActive} ref={this.saveDropzoneContainer} />
						<DropzoneItemsInfo>
							{this.renderDragZone()}
							<h1>User collection items</h1>
							{this.renderLastItems()}
						</DropzoneItemsInfo>
					</DropzoneContentWrapper>
				</PopupContainer>
			</MainWrapper>
		);
	}
}

export default () => <DropzoneWrapper />;
