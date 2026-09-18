// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import { type FileState, MediaClient } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import {
	defaultCollectionName,
	defaultMediaPickerCollectionName,
	mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import { MainWrapper } from '../example-helpers/mainWrapper';
import { PopupContainer } from '../example-helpers/PopupContainer';
import { PopupHeader } from '../example-helpers/PopupHeader';
import type { AuthEnvironment } from '../example-helpers/types';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { BrowserLoader as Browser } from '../src/components/browser';
import { type UploadParams, type BrowserConfig } from '../src/types';

export interface BrowserWrapperState {
	collectionName: string;
	authEnvironment: AuthEnvironment;
	mediaClient?: MediaClient;
	browseConfig?: BrowserConfig;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
	dropzoneContainer?: HTMLDivElement;
	private browseFn: Function = () => {};

	state: BrowserWrapperState = {
		authEnvironment: 'client',
		collectionName: defaultMediaPickerCollectionName,
	};

	componentDidMount() {
		const mediaClientConfig: MediaClientConfig = {
			authProvider: mediaPickerAuthProvider(),
		};
		const uploadParams: UploadParams = {
			collection: this.state.collectionName,
		};
		const browseConfig: BrowserConfig = {
			multiple: true,
			fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
			uploadParams,
		};

		const mediaClient = new MediaClient(mediaClientConfig);
		mediaClient.on('file-added', this.onFileAdded);

		this.setState({
			mediaClient,
			browseConfig,
		});
	}

	onFileAdded = (fileState: FileState) => {
		console.log('onFileAdded', fileState);
	};

	onOpen = () => {
		if (this.browseFn) {
			this.browseFn();
		}
	};

	onCollectionChange = (
		e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
	) => {
		if (!(e.currentTarget instanceof HTMLElement)) {
			return;
		}
		const { innerText: collectionName } = e.currentTarget;
		const { browseConfig } = this.state;
		if (!browseConfig) {
			return;
		}

		const uploadParams: UploadParams = {
			collection: collectionName,
		};

		this.setState({
			collectionName,
			browseConfig: {
				...browseConfig,
				uploadParams,
			},
		});
	};

	onAuthTypeChange = (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
		if (!(e.currentTarget instanceof HTMLElement)) {
			return;
		}
		const { innerText: authEnvironment } = e.currentTarget;

		this.setState({ authEnvironment: authEnvironment as AuthEnvironment });
	};

	onBrowseFn = (browse: () => void) => {
		this.browseFn = browse;
	};

	render() {
		const { collectionName, authEnvironment, mediaClient, browseConfig } = this.state;
		if (!browseConfig || !mediaClient) {
			return null;
		}

		return (
			<MainWrapper>
				<PopupContainer>
					<PopupHeader>
						<Button appearance="primary" onClick={this.onOpen}>
							Open
						</Button>
						<DropdownMenu trigger={collectionName} shouldRenderToParent>
							<DropdownItem onClick={this.onCollectionChange}>
								{defaultMediaPickerCollectionName}
							</DropdownItem>
							<DropdownItem onClick={this.onCollectionChange}>{defaultCollectionName}</DropdownItem>
						</DropdownMenu>
						<DropdownMenu trigger={authEnvironment} shouldRenderToParent>
							<DropdownItem onClick={this.onAuthTypeChange}>client</DropdownItem>
							<DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
						</DropdownMenu>
					</PopupHeader>
					<UploadPreviews>
						{({ onUploadsStart, onError, onPreviewUpdate }) => (
							<Browser
								onBrowseFn={this.onBrowseFn}
								mediaClientConfig={mediaClient.config}
								config={browseConfig}
								onUploadsStart={onUploadsStart}
								onError={onError}
								onPreviewUpdate={onPreviewUpdate}
							/>
						)}
					</UploadPreviews>
				</PopupContainer>
			</MainWrapper>
		);
	}
}

export default (): React.JSX.Element => <BrowserWrapper />;
