import React, { type ChangeEvent, useState } from 'react';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { smallImage } from '@atlaskit/media-common/test-helpers';
import { chunkinator, type Chunk, type ChunkinatorFile } from '../src';
import {
	transformAuthHeaders,
	createAuthSession,
	mediaBaseUrl,
	type AuthSessionHelper,
} from '../example-helpers/authProvider';
import { sha1Hasher } from '../example-helpers/Sha1Hasher';

const createUploadingFunction = (
	deferredUploadId: Promise<string>,
	authSession: AuthSessionHelper,
) => {
	return async (hashedBlob: Chunk) => {
		const uploadId = await deferredUploadId;
		await fetch(
			`${mediaBaseUrl}/chunk/${hashedBlob.hash}?uploadId=${uploadId}&partNumber=${hashedBlob.partNumber}`,
			{
				method: 'PUT',
				mode: 'cors',
				headers: new Headers({
					'Content-Type': 'binary/octet-stream',
					...transformAuthHeaders(authSession),
				}),
				body: hashedBlob.blob,
			},
		);
	};
};

const createUpload = async (authSession: AuthSessionHelper) => {
	const response = await fetch(`${mediaBaseUrl}/upload?createUpTo=1`, {
		method: 'POST',
		mode: 'cors',
		headers: new Headers({
			'Content-Type': 'application/json',
			...transformAuthHeaders(authSession),
		}),
	});
	const json = await response.json();
	return json.data[0].id;
};

const createProcessingFunction = (
	whenUploadId: Promise<string>,
	authSession: AuthSessionHelper,
) => {
	let chunkOffset = 0;
	return async (blobs: Chunk[]) => {
		const uploadId = await whenUploadId;
		await appendChunksToUpload(uploadId, blobs, chunkOffset, authSession);
		chunkOffset += blobs.length;
	};
};

const appendChunksToUpload = async (
	uploadId: string,
	chunks: Chunk[],
	offset: number,
	authSession: AuthSessionHelper,
) => {
	const body = JSON.stringify({
		chunks: chunks.map((chunk) => chunk.hash),
		offset,
	});

	return fetch(`${mediaBaseUrl}/upload/${uploadId}/chunks`, {
		method: 'PUT',
		mode: 'cors',
		body,
		headers: new Headers({
			'Content-Type': 'application/json',
			...transformAuthHeaders(authSession),
		}),
	}).then(() => {
		console.log(`${chunks.length} chunks has been appended`);
	});
};

const createFile = async (uploadId: string, authSession: AuthSessionHelper) => {
	const body = JSON.stringify({
		uploadId,
	});

	return fetch(`${mediaBaseUrl}/file/upload`, {
		method: 'POST',
		mode: 'cors',
		body,
		headers: new Headers({
			'Content-Type': 'application/json',
			...transformAuthHeaders(authSession),
		}),
	})
		.then((r) => r.json())
		.then((response) => {
			const fileId = response.data.id;

			return fileId;
		});
};

const fetchFile = async (id: string, authSession: AuthSessionHelper) => {
	return fetch(`${mediaBaseUrl}/file/${id}`, {
		method: 'GET',
		mode: 'cors',
		headers: new Headers({
			'Content-Type': 'application/json',
			...transformAuthHeaders(authSession),
		}),
	})
		.then((r) => r.json())
		.then((response) => {
			const { processingStatus } = response.data;
			console.log('processingStatus', id, processingStatus);

			if (processingStatus === 'pending') {
				setTimeout(() => fetchFile(id, authSession), 1000);
			} else {
				displayImage(id, authSession);
			}
		});
};

const displayImage = async (id: string, authSession: AuthSessionHelper) => {
	const img = document.createElement('img');
	img.src = `${mediaBaseUrl}/file/${id}/image?client=${authSession.clientId}&token=${authSession.token}&width=600`;

	document.body.appendChild(img);
};

const chunkinate = async (
	blob: ChunkinatorFile,
	cancelSubject: Subject<void>,
	batchSizeInput: string,
) => {
	const authSession = await createAuthSession();
	const deferredUploadId = createUpload(authSession);
	const processingBatchSize = parseInt(batchSizeInput);
	try {
		const chunkinatorObservable = chunkinator(
			blob,
			{
				hashingConcurrency: 5,
				chunkSize: 1024 * 1024 * 5,
				uploadingConcurrency: 3,
				uploadingFunction: createUploadingFunction(deferredUploadId, authSession),
				hashingFunction: sha1Hasher,
				processingBatchSize,
				processingFunction: createProcessingFunction(deferredUploadId, authSession),
			},
			{
				onProgress(progress) {
					console.log('progress: ', `${Math.round(progress * 10000) / 100}%`);
				},
			},
		);

		await chunkinatorObservable.pipe(takeUntil(cancelSubject)).toPromise();

		const uploadId = await deferredUploadId;
		const fileId = await createFile(uploadId, authSession);
		await fetchFile(fileId, authSession);
	} catch (e) {
		console.log('error', e);
	}
};

export default (): React.JSX.Element => {
	const [batchSizeInput, setBatchSizeInput] = useState('1000');
	const cancelSubject = new Subject<void>();

	const onChangeBatchSizeInput = (e: ChangeEvent<HTMLInputElement>) =>
		setBatchSizeInput(e.target.value);

	const onChangeUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
		const { currentTarget } = e;
		const files = currentTarget.files as FileList;

		return chunkinate(files[0], cancelSubject, batchSizeInput);
	};

	const onClickUploadString = () => chunkinate(smallImage, cancelSubject, batchSizeInput);

	const onClickCancel = () => cancelSubject.next();

	return (
		<div>
			<fieldset>
				<label>
					Processing Batch Size:{' '}
					<input
						id="processingBatchSizeInput"
						type="number"
						value={batchSizeInput}
						onChange={onChangeBatchSizeInput}
					/>
				</label>
			</fieldset>
			<div>
				Upload a file <input type="file" onChange={onChangeUploadFile} />
			</div>
			<div>
				or
				<button id="string-upload" onClick={onClickUploadString}>
					Upload a string
				</button>
				<button id="cancel-upload" onClick={onClickCancel}>
					Cancel
				</button>
			</div>
		</div>
	);
};
