import { Component, type ChangeEvent } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import { getRandomTelemetryId } from '@atlaskit/media-common';
import { tallImage } from '@atlaskit/media-common/test-helpers';

import { FileInput } from '../example-helpers/FileInput';
import { ImagePreview } from '../example-helpers/ImagePreview';
import { MetadataWrapper } from '../example-helpers/MetadataWrapper';
import { PreviewWrapper } from '../example-helpers/PreviewWrapper';
import { Wrapper } from '../example-helpers/Wrapper';
import { uploadFile, MediaStore, type UploadableFileUpfrontIds } from '../src';
import { defaultMediaPickerAuthProvider } from '../src/test-helpers';
import { type UploadableFile, type UploadFileCallbacks } from '../src/uploader';
import { convertBase64ToBlob } from '../src/utils/convertBase64ToBlob';

type UploaderExampleProps = {};
export interface UploaderExampleState {
	uploadingProgress: number;
	processingStatus?: string;
	fileURL?: string;
	fileMetadata?: any;
	error?: any;
	traceId?: string;
}

const store = new MediaStore({
	authProvider: defaultMediaPickerAuthProvider(),
});

class UploaderExample extends Component<UploaderExampleProps, UploaderExampleState> {
	state: UploaderExampleState = {
		uploadingProgress: 0,
	};

	fetchFile = (id: string, traceId: string) => {
		store.getFile(id, undefined, { traceId }).then(async (response) => {
			const fileMetadata = response.data;
			const { processingStatus } = fileMetadata;

			this.setState({ processingStatus });

			if (processingStatus === 'pending') {
				window.setTimeout(() => this.fetchFile(id, traceId), 1000);
			} else {
				const fileURL = await store.getFileImageURL(id);

				this.setState({
					fileMetadata,
					fileURL,
				});
			}
		});
	};

	render() {
		const { fileURL, uploadingProgress, processingStatus, traceId } = this.state;

		return (
			<Wrapper>
				<PreviewWrapper>
					<div>
						File <FileInput type="file" onChange={this.onChange} />
					</div>
					<div>
						String
						<button onClick={this.onUploadStringClick}>Upload</button>
					</div>
					<div>
						<progress value={uploadingProgress} max="1" aria-label="Upload progress" />
					</div>
					<div>Processing status: {processingStatus}</div>
					<div>TraceId: {traceId}</div>
					<div>{fileURL ? <ImagePreview src={fileURL} alt="preview" /> : null}</div>
				</PreviewWrapper>
				{this.renderMetadata()}
			</Wrapper>
		);
	}

	renderMetadata() {
		const { fileMetadata } = this.state;
		if (!fileMetadata) {
			return;
		}

		return <MetadataWrapper>{JSON.stringify(fileMetadata, null, 2)}</MetadataWrapper>;
	}

	onProgress = (uploadingProgress: number) => {
		this.setState({
			uploadingProgress,
		});
	};

	onUploadStringClick = () => {
		const uploadableFile: UploadableFile = {
			content: tallImage,
			// `content` is a data URI, so the byte size has to come from the decoded blob
			size: convertBase64ToBlob(tallImage).size,
		};

		this.uploadFile(uploadableFile);
	};

	onError = (error: any) => {
		this.setState({ error });
	};

	private readonly onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {
			currentTarget: { files },
		} = e;
		if (!files) {
			return;
		}
		const file = files[0];
		const uploadableFile: UploadableFile = {
			content: file,
			name: file.name,
			mimeType: file.type,
			size: file.size,
		};

		this.uploadFile(uploadableFile);
	};

	private uploadFile(uploadableFile: UploadableFile) {
		const mediaStore = new MediaStore({
			authProvider: defaultMediaPickerAuthProvider(),
		});
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const fileId = uuid();
		const traceId = getRandomTelemetryId();
		this.setState({ traceId });
		const deferredTouchedFiles = mediaStore.touchFiles(
			{
				descriptors: [
					{
						fileId,
					},
				],
			},
			{},
			{ traceId },
		);
		const deferredUploadId = deferredTouchedFiles.then(
			(touchedFiles) => touchedFiles.data.created[0].uploadId,
		);

		const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
			id: fileId,
			deferredUploadId,
		};
		const callbacks: UploadFileCallbacks = {
			onProgress: this.onProgress,
			onUploadFinish: (error) => (error ? this.onError(error) : this.fetchFile(fileId, traceId)),
		};

		uploadFile(uploadableFile, mediaStore, uploadableFileUpfrontIds, callbacks, { traceId });
	}
}

export default (): React.JSX.Element => <UploaderExample />;
