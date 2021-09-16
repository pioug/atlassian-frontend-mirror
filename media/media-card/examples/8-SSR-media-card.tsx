import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import {
  defaultCollectionName,
  genericFileId,
  createUploadMediaClientConfig,
  tallImage,
  atlassianLogoUrl,
  externaBrokenlIdentifier,
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
    isLazy?: boolean;
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
          <h3>SSR Card</h3>
          <div>
            <CardSSRView
              mediaClient={props.mediaClient}
              identifier={identifier}
              alt="alt text"
              resizeMode="fit"
              disableOverlay={props.disableOverlay}
              isLazy={!!props.isLazy}
            />
          </div>
        </CardWrapper>
        <CardWrapper key={identifier.id}>
          <h3>
            {props.isLazy
              ? 'This space intentionally left blank'
              : 'Media Card'}
          </h3>
          <div>
            {props.isLazy ? (
              <p>CardView does not support lazy loading</p>
            ) : (
              <CardView
                mediaItemType="file"
                resizeMode="fit"
                disableOverlay={props.disableOverlay}
                selectable={false}
                selected={false}
                dataURI={props.dataURI}
              />
            )}
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
  const mediaClientConfig = createUploadMediaClientConfig();
  const mediaClient = new MediaClient(mediaClientConfig);
  const alwaysFailingSyncImageUrlMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => {
      throw new Error('Forbidden');
    },
  } as Partial<MediaClient>;

  const alwaysHasASyncImageUrlForLazyisLazyMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => atlassianLogoUrl,
  } as Partial<MediaClient>;

  const alwaysHasASyncImageUrlMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => tallImage,
  } as Partial<MediaClient>;

  const alwaysHasASyncImageUrlThatIsntValidMediaClient = {
    ...mediaClient,
    getImageUrlSync: () => externaBrokenlIdentifier.dataURI,
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
        dataURI={tallImage}
      />
      <Example
        mediaClient={
          alwaysHasASyncImageUrlThatIsntValidMediaClient as MediaClient
        }
        title="Failing to get image synchronously because of a bad url"
        disableOverlay={disableOverlay}
        dataURI={externaBrokenlIdentifier.dataURI}
      />
      <Example
        mediaClient={alwaysFailingSyncImageUrlMediaClient as MediaClient}
        title="Failing to get image URI Synchronously"
        disableOverlay={disableOverlay}
      />
      <Example
        mediaClient={
          alwaysHasASyncImageUrlForLazyisLazyMediaClient as MediaClient
        }
        title="Successful Lazy Load"
        disableOverlay={disableOverlay}
        isLazy={true}
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
