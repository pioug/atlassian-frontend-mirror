// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import {
	mediaPickerAuthProvider,
	defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import Toggle from '@atlaskit/toggle';
import Spinner from '@atlaskit/spinner';
import { Clipboard } from '../src';
import {
	type ImagePreview,
	type UploadPreviewUpdateEventPayload,
	type UploadEndEventPayload,
	type UploadsStartEventPayload,
	type UploadErrorEventPayload,
} from '../src/types';
import {
	MainWrapper,
	PopupHeader,
	PopupContainer,
	DropzoneContentWrapper,
	DropzoneItemsInfo,
	ClipboardContainer,
	InfoContainer,
	PastedImage,
} from '../example-helpers';
import { fileToDataURI } from '@atlaskit/media-ui';

export interface ClipboardWrapperState {
	isConnectedToUsersCollection: boolean;
	isActive: boolean;
	isFetchingLastItems: boolean;
	lastItems: any[];
	isWindowFocused: boolean;
	pastedImgSrc?: string;
	pastedImgScaleFactor: number;
	pastedImgWidth: number;
	pastedImgHeight: number;
	isLoading: boolean;
}

class ClipboardWrapper extends Component<{}, ClipboardWrapperState> {
	dropzoneContainer?: HTMLDivElement;

	state: ClipboardWrapperState = {
		isConnectedToUsersCollection: true,
		isActive: true,
		isFetchingLastItems: true,
		lastItems: [],
		isWindowFocused: true,
		isLoading: false,
		pastedImgScaleFactor: 1,
		pastedImgWidth: -1,
		pastedImgHeight: -1,
	};

	onFocus = () => {
		this.setState({ isWindowFocused: true });
	};

	onBlur = () => {
		this.setState({ isWindowFocused: false });
	};

	async componentDidMount() {
		window.addEventListener('focus', this.onFocus);
		window.addEventListener('blur', this.onBlur);
	}

	componentWillUnmount() {
		window.removeEventListener('focus', this.onFocus);
		window.removeEventListener('blur', this.onBlur);
	}

	onConnectionChange = () => {
		const isConnectedToUsersCollection = !this.state.isConnectedToUsersCollection;
		this.setState({ isConnectedToUsersCollection });
	};

	onActiveChange = () => {
		this.setState({ isActive: !this.state.isActive });
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
					{id} | {name} | {mediaType}
				</div>
			);
		});
	};

	onCloseImg = () => {
		this.setState({
			isLoading: false,
			pastedImgSrc: undefined,
			pastedImgScaleFactor: 1,
			pastedImgWidth: -1,
			pastedImgHeight: -1,
		});
	};

	render() {
		const { isConnectedToUsersCollection, isActive, isWindowFocused } = this.state;

		return (
			<MainWrapper>
				<PopupContainer>
					<PopupHeader>
						Connected to users collection
						<Toggle
							defaultChecked={isConnectedToUsersCollection}
							onChange={this.onConnectionChange}
						/>
						Active
						<Toggle defaultChecked={isActive} onChange={this.onActiveChange} />
					</PopupHeader>
					<DropzoneContentWrapper>
						<ClipboardContainer isWindowFocused={isWindowFocused}>
							<h2>Clipboard example</h2>
							<p>
								Use CMD+C to copy an image from finder, followed by CMD+V to paste the image when
								this window is focused.
							</p>
							<p>
								You can also take a screenshot with SHIFT+CTRL+COMMAND+4 (Mac) and paste with CMD+V.
							</p>
							<p>If you paste an image you will see a preview.</p>
						</ClipboardContainer>
						<DropzoneItemsInfo>
							<h1>User collection items</h1>
							{this.renderLastItems()}
						</DropzoneItemsInfo>
					</DropzoneContentWrapper>
					{this.renderPastedImage()}
					{this.renderClipboard()}
				</PopupContainer>
			</MainWrapper>
		);
	}

	private renderClipboard() {
		const { isActive } = this.state;
		const mediaClientConfig = {
			authProvider: mediaPickerAuthProvider(),
		};
		const config = {
			uploadParams: {
				collection: defaultMediaPickerCollectionName,
			},
		};

		const onUploadsStart = (data: UploadsStartEventPayload) => {
			console.log('uploads started');
			console.log('uploads-start:', data);
			this.setState({
				isLoading: true,
			});
		};

		const onUploadEnd = (data: UploadEndEventPayload) => {
			console.log('upload finished');
			console.log('upload-end:', data);
		};

		const onUploadError = (mpError: UploadErrorEventPayload) => {
			console.log('upload-error:', mpError);
		};

		const onUploadPreviewUpdate = async (data: UploadPreviewUpdateEventPayload) => {
			console.log('upload-preview-update:', data);
			if (data.preview.file && data.preview.file.type.indexOf('image/') === 0) {
				const src = await fileToDataURI(data.preview.file);
				const imgPreview = data.preview as ImagePreview;
				const scaleFactor = imgPreview.scaleFactor;
				const width = imgPreview.dimensions.width;
				const height = imgPreview.dimensions.height;
				this.setState({
					pastedImgSrc: src,
					isLoading: false,
					pastedImgScaleFactor: scaleFactor,
					pastedImgWidth: width,
					pastedImgHeight: height,
				});
			}
		};

		return isActive ? (
			<Clipboard
				mediaClientConfig={mediaClientConfig}
				config={config}
				onUploadsStart={onUploadsStart}
				onEnd={onUploadEnd}
				onError={onUploadError}
				onPreviewUpdate={onUploadPreviewUpdate}
			/>
		) : null;
	}

	private renderPastedImage() {
		const { pastedImgSrc, pastedImgScaleFactor, pastedImgWidth, pastedImgHeight, isLoading } =
			this.state;

		const width = Math.round(pastedImgWidth / pastedImgScaleFactor);
		const height = Math.round(pastedImgHeight / pastedImgScaleFactor);

		return (
			<InfoContainer>
				{isLoading ? (
					<Spinner size="large" />
				) : pastedImgSrc ? (
					<>
						<PastedImage
							src={pastedImgSrc}
							style={{ width, height }}
							title="Click X button to close"
						/>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<div className="info">{`${width}x${height}`}</div>
						<Button
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className="close_button"
							appearance="primary"
							onClick={this.onCloseImg}
						>
							X
						</Button>
					</>
				) : null}
			</InfoContainer>
		);
	}
}

export default () => <ClipboardWrapper />;
