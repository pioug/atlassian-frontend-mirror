import React, { ChangeEvent } from 'react';
import { smallImage } from '@atlaskit/media-test-helpers';
import { chunkinator, Chunk, ChunkinatorFile } from '../src';
import config from '../example-helpers/config';

const authHeaders = {
  Authorization: `Bearer ${config.token}`,
  'X-Client-Id': config.clientId,
};

const processingBatchSizeInput = document.getElementById(
  'processingBatchSizeInput',
) as HTMLInputElement;
const cancelButton = document.getElementById('cancel-upload');

const probingFunction = async (hashedBlobs: Chunk[]) => {
  const body = JSON.stringify({
    chunks: hashedBlobs.map(hashedBlob => `${hashedBlob.hash}`),
  });

  const response = await fetch(`${config.host}/chunk/probe`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
    }),
    body,
  });
  const json = await response.json();
  const results = json.data.results;
  return (Object as any).values(results).map((result: any) => result.exists);
};

const uploadingFunction = async (hashedBlob: Chunk) => {
  await fetch(`${config.host}/chunk/${hashedBlob.hash}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'binary/octet-stream',
      ...authHeaders,
    }),
    body: hashedBlob.blob,
  });
};

const createUpload = async () => {
  const response = await fetch(`${config.host}/upload?createUpTo=1`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
    }),
  });
  const json = await response.json();
  return json.data[0].id;
};

const createProcessingFunction = (whenUploadId: Promise<string>) => {
  let chunkOffset = 0;
  return async (probedBlobs: Chunk[]) => {
    const uploadId = await whenUploadId;
    await appendChunksToUpload(uploadId, probedBlobs, chunkOffset);
    chunkOffset += probedBlobs.length;
  };
};

const appendChunksToUpload = (
  uploadId: string,
  chunks: Chunk[],
  offset: number,
) => {
  const body = JSON.stringify({
    chunks: chunks.map(chunk => chunk.hash),
    offset,
  });

  return fetch(`${config.host}/upload/${uploadId}/chunks`, {
    method: 'PUT',
    mode: 'cors',
    body,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
    }),
  }).then(() => {
    console.log(`${chunks.length} chunks has been appended`);
  });
};

const createFile = (uploadId: string) => {
  const body = JSON.stringify({
    uploadId,
  });

  return fetch(`${config.host}/file/upload`, {
    method: 'POST',
    mode: 'cors',
    body,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
    }),
  })
    .then(r => r.json())
    .then(response => {
      const fileId = response.data.id;

      return fileId;
    });
};

const fetchFile = (id: string) => {
  return fetch(`${config.host}/file/${id}`, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
    }),
  })
    .then(r => r.json())
    .then(response => {
      const { processingStatus } = response.data;
      console.log('processingStatus', id, processingStatus);

      if (processingStatus === 'pending') {
        setTimeout(() => fetchFile(id), 1000);
      } else {
        displayImage(id);
      }
    });
};

const displayImage = (id: string) => {
  const img = document.createElement('img');

  img.src = `${config.host}/file/${id}/image?client=${config.clientId}&token=${config.token}&width=600`;

  document.body.appendChild(img);
};

const chunkinate = async (blob: ChunkinatorFile) => {
  const deferredUploadId = createUpload();
  const processingBatchSize = +processingBatchSizeInput!.value;
  try {
    const { response, cancel } = chunkinator(
      blob,
      {
        hashingConcurrency: 5,
        probingBatchSize: 10,
        chunkSize: 10000,
        uploadingConcurrency: 3,
        uploadingFunction,
        probingFunction,
        processingBatchSize,
        processingFunction: createProcessingFunction(deferredUploadId),
      },
      {
        onProgress(progress) {
          console.log('progress: ', `${Math.round(progress * 10000) / 100}%`);
        },
      },
    );
    cancelButton!.addEventListener('click', () => {
      cancel();
    });
    await response;

    const uploadId = await deferredUploadId;
    const fileId = await createFile(uploadId);
    await fetchFile(fileId);
  } catch (e) {
    console.log('error', e);
  }
};

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { currentTarget } = e;
  const files = currentTarget.files as FileList;

  return chunkinate(files[0]);
};

const onUploadStringClick = () => chunkinate(smallImage);

export default () => (
  <div>
    <fieldset>
      <label>
        Processing Batch Size:{' '}
        <input id="processingBatchSizeInput" type="number" value="1000" />
      </label>
    </fieldset>
    <div>
      Upload a file <input type="file" onChange={onChange} />
    </div>
    <div>
      or
      <button id="string-upload" onClick={onUploadStringClick}>
        Upload a string
      </button>
      <button id="cancel-upload">Cancel</button>
    </div>
  </div>
);
