import MediaCardV2 from '../src/card/v2/cardV2Loader';
import React, { useEffect, useState, useMemo } from 'react';

import Loadable from 'react-loadable';
import { SSR } from '@atlaskit/media-common';
import { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';

import { MainWrapper } from '../example-helpers';
import { SimulateSsr } from '../example-helpers/ssrHelpers';
import { createMockedMediaClientProviderWithBinaries } from '../src/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 20,
} as const;

const dummyMediaClientConfig = {} as MediaClientConfig;

const [videoFileItem, videoFileId] =
  generateItemWithBinaries.workingVideo.videoFire();
const [imageFileItem, imageFileId] =
  generateItemWithBinaries.workingImgWithRemotePreview.jpgCat();
const [pdfFileItem, pdfFileId] =
  generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy();

const { MockedMediaClientProvider } =
  createMockedMediaClientProviderWithBinaries({
    initialItemsWithBinaries: [videoFileItem, imageFileItem, pdfFileItem],
  });

const Page = ({
  ssr,
  title,
  mediaGroup,
  identifier,
}: {
  ssr: SSR;
  title: string;
  mediaGroup?: boolean;
  identifier: FileIdentifier;
}) => (
  <MockedMediaClientProvider>
    <h3>{title}</h3>
    <MediaCardV2
      mediaClientConfig={dummyMediaClientConfig}
      identifier={identifier}
      dimensions={{ width: 300, height: 200 }}
      ssr={ssr}
      useInlinePlayer={true}
      shouldOpenMediaViewer={true}
      resizeMode={!mediaGroup ? 'stretchy-fit' : undefined}
      disableOverlay={!mediaGroup ? true : false}
    />
  </MockedMediaClientProvider>
);

const SimulateSsrPage = ({
  title,
  identifier,
  mediaGroup,
}: {
  title: string;
  identifier: FileIdentifier;
  mediaGroup?: boolean;
}) => {
  const serverPage = useMemo(
    () => (
      <Page
        ssr="server"
        title={'SSR Only'}
        identifier={identifier}
        mediaGroup={mediaGroup}
      />
    ),
    [identifier, mediaGroup],
  );
  const hydratePage = useMemo(
    () => (
      <Page
        ssr="client"
        title={'Hydrated'}
        identifier={identifier}
        mediaGroup={mediaGroup}
      />
    ),
    [identifier, mediaGroup],
  );

  return (
    <>
      <h2>{title}</h2>
      <div style={rowStyle}>
        <SimulateSsr serverPage={serverPage} style={{ marginRight: 20 }} />
        <SimulateSsr
          serverPage={serverPage}
          hydratePage={hydratePage}
          style={{ marginRight: 20 }}
        />
      </div>
    </>
  );
};

export default () => {
  const [areModulesReady, setAreModulesReady] = useState(false);
  useEffect(() => {
    Loadable.preloadAll().then(async () => {
      setAreModulesReady(true);
    });
  }, []);

  if (!areModulesReady) {
    return <MainWrapper developmentOnly>LOADING MODULES</MainWrapper>;
  }

  return (
    <MainWrapper developmentOnly>
      <SimulateSsrPage title="Image" identifier={imageFileId} />
      <SimulateSsrPage title="Video" identifier={videoFileId} />
      <SimulateSsrPage title="Doc" identifier={pdfFileId} mediaGroup />
    </MainWrapper>
  );
};
