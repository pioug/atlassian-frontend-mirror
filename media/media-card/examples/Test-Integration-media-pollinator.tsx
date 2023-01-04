/**@jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useState, useRef, useCallback, useMemo } from 'react';
import {
  defaultCollectionName,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import {
  Browser,
  BrowserConfig,
  UploadsStartEventPayload,
} from '@atlaskit/media-picker';
import Button from '@atlaskit/button/standard-button';
import { Card } from '../src';
import { FileIdentifier, MediaClient } from '@atlaskit/media-client';
import { cardFlowHeaderStyles } from '../example-helpers/styles';
import { MainWrapper } from '../example-helpers';
const env = sessionStorage.getItem('env') === 'staging' ? 'staging' : 'dev';
const mediaClientConfig = createUploadMediaClientConfig(undefined, env);
const mediaClient = new MediaClient(mediaClientConfig);

const cardWrapperStyles = css`
  border: 1px solid;
  padding: 10px;
  margin: 5px;
  overflow: auto;
  display: inline-block;
`;

const browseConfig: BrowserConfig = {
  multiple: true,
  uploadParams: {
    collection: defaultCollectionName,
  },
};

type FileId = {
  id: string;
};

export interface ComponentState {
  fileIds: FileId[];
}

const Example = () => {
  const initFileIds = sessionStorage.getItem(`${env}-fileIds`);
  const [fileIds, setFileIds] = useState<FileId[]>(
    initFileIds ? JSON.parse(initFileIds) : [],
  );

  const browseFnRef = useRef<Function>(() => {});

  const cards = useMemo(
    () =>
      fileIds.map(({ id }) => {
        const identifier: FileIdentifier = {
          id,
          mediaItemType: 'file',
          collectionName: defaultCollectionName,
        };
        return (
          <div css={cardWrapperStyles} key={id}>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={identifier}
              shouldOpenMediaViewer={true}
              testId={id}
            />
          </div>
        );
      }),
    [fileIds],
  );

  React.useEffect(() => {
    sessionStorage.setItem(`${env}-fileIds`, JSON.stringify(fileIds));
  }, [fileIds]);

  const onUploadsStart = useCallback((event: UploadsStartEventPayload) => {
    const { files } = event;
    const newFiles = files.map((file) => ({ id: file.id }));
    setFileIds((fileIds) => [...newFiles, ...fileIds]);
  }, []);

  const onOpen = useCallback(() => {
    if (browseFnRef.current) {
      browseFnRef.current();
    }
  }, []);

  const onBrowseFn = useCallback((browse: () => void) => {
    browseFnRef.current = browse;
  }, []);

  return (
    <React.Fragment>
      <div css={cardFlowHeaderStyles}>
        <Button appearance="primary" onClick={onOpen}>
          Open
        </Button>
        <Browser
          config={browseConfig}
          onBrowseFn={onBrowseFn}
          mediaClientConfig={mediaClient.config}
          onUploadsStart={onUploadsStart}
        />
      </div>
      {cards}
    </React.Fragment>
  );
};

export default () => (
  <MainWrapper developmentOnly>
    <Example />
  </MainWrapper>
);
