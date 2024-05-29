import MediaCardV2 from '../src/card/v2/cardV2Loader';
import React, { useEffect, useState, useMemo } from 'react';

import Loadable from 'react-loadable';
import { type SSR } from '@atlaskit/media-common';
import {
  type FileIdentifier,
  type MediaApi,
  type MediaClientConfig,
} from '@atlaskit/media-client';
import {
  generateItemWithBinaries,
  type GeneratedItemWithBinaries,
  type ItemWithBinaries,
} from '@atlaskit/media-test-data';

import { MainWrapper } from '../example-helpers';
import { SimulateSsr } from '../example-helpers/ssrHelpers';
import { createMockedMediaClientProviderWithBinaries } from '../src/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 20,
} as const;

const dummyMediaClientConfig = {} as MediaClientConfig;

let items: GeneratedItemWithBinaries[] = [];
let initialItemsWithBinaries: ItemWithBinaries[] = [];

const prepareMediaState = async () => {
  items = await Promise.all(
    // Create n items with different Id
    Array.from(Array(6)).map(() =>
      generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
    ),
  );
  initialItemsWithBinaries = items.map(([item]) => item);
};

type ThrowMediaApiError = 'getFileImageURLSync' | 'dataURI';
const throwMediaApiError = (mediaApi: MediaApi, error: ThrowMediaApiError) => {
  if (error === 'getFileImageURLSync') {
    mediaApi.getFileImageURLSync = () => {
      throw new Error('something really bad happened in getFileImageURLSync');
    };
  }
  if (error === 'dataURI') {
    mediaApi.getFileImageURLSync = () => {
      return 'http://broken-data-uri';
    };
  }
};

const Page = ({
  ssr,
  title,
  mediaGroup,
  identifier,
  error,
}: {
  ssr: SSR;
  title: string;
  mediaGroup?: boolean;
  identifier: FileIdentifier;
  error?: ThrowMediaApiError;
}) => {
  const { MockedMediaClientProvider, mediaApi } =
    createMockedMediaClientProviderWithBinaries({ initialItemsWithBinaries });

  error && throwMediaApiError(mediaApi, error);

  return (
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
};

const SimulateSsrPage = ({
  title,
  identifier,
  mediaGroup,
  serverError,
  hydrationError,
}: {
  title: string;
  identifier: FileIdentifier;
  mediaGroup?: boolean;
  serverError?: ThrowMediaApiError;
  hydrationError?: ThrowMediaApiError;
}) => {
  const serverPage = useMemo(
    () => (
      <Page
        ssr="server"
        title={'SSR Only'}
        identifier={identifier}
        mediaGroup={mediaGroup}
        error={serverError}
      />
    ),
    [identifier, mediaGroup, serverError],
  );
  const hydratePage = useMemo(
    () => (
      <Page
        ssr="client"
        title={'Hydrated'}
        identifier={identifier}
        mediaGroup={mediaGroup}
        error={hydrationError}
      />
    ),
    [identifier, mediaGroup, hydrationError],
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
    Loadable.preloadAll().then(async () => {
      setAreModulesReady(true);
    });
  }, []);

  if (!areModulesReady || !isMediaStateReady) {
    return <MainWrapper developmentOnly>LOADING MODULES</MainWrapper>;
  }

  return (
    <MainWrapper developmentOnly>
      <SimulateSsrPage
        title="Server dataURI error"
        identifier={items[0][1]}
        serverError={'dataURI'}
      />
      <SimulateSsrPage
        title="Hydration dataURI error"
        identifier={items[1][1]}
        hydrationError={'dataURI'}
      />
      <SimulateSsrPage
        title="Sever + Hydration dataURI error"
        identifier={items[2][1]}
        serverError={'dataURI'}
        hydrationError={'dataURI'}
      />
      <SimulateSsrPage
        title="Server getFileImageURLSync error"
        identifier={items[3][1]}
        serverError={'getFileImageURLSync'}
      />
      <SimulateSsrPage
        title="Hydration getFileImageURLSync error"
        identifier={items[4][1]}
        hydrationError={'getFileImageURLSync'}
      />
      <SimulateSsrPage
        title="Server + Hydration getFileImageURLSync error"
        identifier={items[5][1]}
        hydrationError={'getFileImageURLSync'}
        serverError={'getFileImageURLSync'}
      />
    </MainWrapper>
  );
};
