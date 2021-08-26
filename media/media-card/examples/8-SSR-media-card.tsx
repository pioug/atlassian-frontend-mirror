import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import {
  defaultCollectionName,
  genericFileId,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
// Deep linking to CardSSRView here until we have a higher order component that is able to rehydreate
import { CardSSRView } from '../src/root/card/cardSSRView';
import { CardView } from '../src/root/cardView';

import { FileIdentifier, MediaClient } from '@atlaskit/media-client';
import {
  CardWrapper,
  CardFlowHeader,
  CardsWrapper,
} from '../example-helpers/styled';
import { MainWrapper } from '../example-helpers';

interface ComponentProps {}

const Example = (
  props: ComponentProps & {
    mediaClient: MediaClient;
    title: string;
    disableOverlay: boolean;
    dataURI?: string;
  },
) => {
  function renderCards() {
    const identifier: FileIdentifier = {
      id: genericFileId.id,
      mediaItemType: 'file',
      collectionName: defaultCollectionName,
    };
    return (
      <CardsWrapper>
        <CardWrapper key={identifier.id}>
          <div>
            <CardSSRView
              mediaClient={props.mediaClient}
              identifier={identifier}
              alt="alt text"
              resizeMode="fit"
              disableOverlay={props.disableOverlay}
            />
          </div>
        </CardWrapper>
        <CardWrapper key={identifier.id}>
          <div>
            <CardView
              mediaItemType="file"
              resizeMode="fit"
              disableOverlay={props.disableOverlay}
              selectable={false}
              selected={false}
              dataURI={props.dataURI}
            />
          </div>
        </CardWrapper>
      </CardsWrapper>
    );
  }

  return (
    <>
      <CardFlowHeader>
        <h1>{props.title}</h1>
      </CardFlowHeader>
      {renderCards()}
    </>
  );
};

export default () => {
  const resolvableImage =
    'https://atlaskit.atlassian.com/1d214c2e50eea39bd1e887298a0f272f.png';
  const notAnImage = 'https://notanimage';
  const mediaClientConfig = createUploadMediaClientConfig();
  const mediaClient = new MediaClient(mediaClientConfig);
  const alwaysFailingSyncImageUrlMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => {
      throw new Error('Forbidden');
    },
  } as Partial<MediaClient>;

  const alwaysHasASyncImageUrlMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => resolvableImage,
  } as Partial<MediaClient>;

  const alwaysHasASyncImageUrlThatIsntValidMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => notAnImage,
  } as Partial<MediaClient>;
  const [disableOverlay, setDisableOverlay] = useState(false);

  return (
    <MainWrapper>
      <Checkbox
        value="diableOverlay"
        label="Disable Overlay"
        isChecked={disableOverlay}
        onChange={() => setDisableOverlay(!disableOverlay)}
        name={'disableOverlay'}
      />
      ;
      <Example
        mediaClient={alwaysHasASyncImageUrlMediaClient as MediaClient}
        title="Successful Synchronous Load"
        disableOverlay={disableOverlay}
        dataURI={resolvableImage}
      />
      <Example
        mediaClient={
          alwaysHasASyncImageUrlThatIsntValidMediaClient as MediaClient
        }
        title="Failing to get image synchronously because of a bad url"
        disableOverlay={disableOverlay}
        dataURI={notAnImage}
      />
      <Example
        mediaClient={alwaysFailingSyncImageUrlMediaClient as MediaClient}
        title="Failing to get image URI Synchronously"
        disableOverlay={disableOverlay}
      />
    </MainWrapper>
  );
};

// We export the example without FFs dropdown for SSR test:
// packages/media/media-card/src/__tests__/unit/server-side-hydrate.tsx
// This requires a media client so calls to authetication can be mocked and fake image thumbnails can be provided.
export const SSR = (mediaClient: MediaClient) => {
  return () => (
    <Example
      mediaClient={mediaClient}
      title="SSR testing"
      disableOverlay={false}
    />
  );
};
