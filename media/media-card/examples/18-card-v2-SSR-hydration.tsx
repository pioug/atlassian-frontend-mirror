import MediaCardV2 from '../src/card/v2/cardV2Loader';
import React, { useEffect, useState, useMemo } from 'react';

import Loadable from 'react-loadable';
import { type SSR } from '@atlaskit/media-common';
import { type FileIdentifier, type MediaClientConfig } from '@atlaskit/media-client';
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

let MockedMediaClientProvider: any;
let identifiers: FileIdentifier[] = [];

const prepareMediaState = async () => {
  const items = await Promise.all([
    generateItemWithBinaries.workingVideo.videoFire(),
    generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
    generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
  ]);

  const initialItemsWithBinaries = items.map(
    ([itemWithBinaries]) => itemWithBinaries,
  );
  identifiers = items.map(([, identifier]) => identifier);

  const { MockedMediaClientProvider: localMockedMediaClientProvider } =
    createMockedMediaClientProviderWithBinaries({ initialItemsWithBinaries });

  MockedMediaClientProvider = localMockedMediaClientProvider;
};

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
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={rowStyle}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <SimulateSsr serverPage={serverPage} style={{ marginRight: 20 }} />
        <SimulateSsr
          serverPage={serverPage}
          hydratePage={hydratePage}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          style={{ marginRight: 20 }}
        />
      </div>
    </>
  );
};

export default () => {
  const [areModulesReady, setAreModulesReady] = useState(false);
  const [isMediaStateReady, setIsMediaStateReady] = useState(false);
  useEffect(() => {
    prepareMediaState().then(() => setIsMediaStateReady(true));
    Loadable.preloadAll().then(() => setAreModulesReady(true));
  }, []);

  if (!areModulesReady || !isMediaStateReady) {
    return <MainWrapper developmentOnly>LOADING MODULES</MainWrapper>;
  }

  const [videoFileId, imageFileId, pdfFileId] = identifiers;

  return (
    <MainWrapper developmentOnly>
      <SimulateSsrPage title="Image" identifier={imageFileId} />
      <SimulateSsrPage title="Video" identifier={videoFileId} />
      <SimulateSsrPage title="Doc" identifier={pdfFileId} mediaGroup />
    </MainWrapper>
  );
};
