/**
 * Development use only
 * The purpose of this example is to explore on edge cases for this component's
 * feature. Some ways of using the component in here might not be the standard
 * way. It is discouraged to use this code as a base for consumers.
 */
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import {
  FileIdentifier,
  MediaClient,
  MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { tallImage } from '@atlaskit/media-test-helpers';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { SSR } from '@atlaskit/media-common';
import { MediaImage } from '../src';
import Spinner from '@atlaskit/spinner';
import { MediaClientContext } from '@atlaskit/media-client-react';
import { imageFileId } from '@atlaskit/media-test-helpers';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import DevelopmentUseMessage from '../example-helpers/developmentUseMessage';

const dimensions = { width: 100, height: 150 };

const createMediaClient = ({
  throwError,
}: {
  throwError?: 'getImageUrlSync' | 'dataURI';
} = {}) => {
  const mediaClientConfig = createStorybookMediaClientConfig();
  const mediaClient = new MediaClient(mediaClientConfig);
  const dataURI =
    throwError === 'dataURI' ? 'http://broken-data-uri' : tallImage;
  mediaClient.getImageUrlSync = () => {
    if (throwError === 'getImageUrlSync') {
      throw new Error('something really bad happened');
    }
    return dataURI;
  };

  return mediaClient;
};

const SSRAnalyticsWrapper = ({ children }: PropsWithChildren<{}>) => {
  const mockClient: AnalyticsWebClient = {
    sendUIEvent: (e) => console.debug('UI event', e),
    sendOperationalEvent: (e) => console.debug('Operational event', e),
    sendTrackEvent: (e) => console.debug('Track event', e),
    sendScreenEvent: (e) => console.debug('Screen event', e),
  };

  return (
    <FabricAnalyticsListeners client={mockClient}>
      {children}
    </FabricAnalyticsListeners>
  );
};

const Image = ({
  identifier,
  apiConfig,
  ssr,
}: {
  identifier: FileIdentifier;
  apiConfig?: MediaStoreGetFileImageParams;
  ssr: SSR;
}) => {
  return (
    <MediaImage
      identifier={identifier}
      mediaClientConfig={{} as any}
      apiConfig={apiConfig}
      ssr={ssr}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }

        if (error) {
          console.error(error);
          return <div>Error :(</div>;
        }

        if (!data) {
          return null;
        }

        return <img src={data.src} />;
      }}
    </MediaImage>
  );
};

const Page = ({
  ssr,
  title,
  throwError,
}: {
  ssr: SSR;
  title: string;
  throwError?: 'getImageUrlSync' | 'dataURI';
}) => (
  <SSRAnalyticsWrapper>
    <h3>{title}</h3>
    <MediaClientContext.Provider value={createMediaClient({ throwError })}>
      <Image identifier={imageFileId} apiConfig={dimensions} ssr={ssr} />
    </MediaClientContext.Provider>
  </SSRAnalyticsWrapper>
);

type RunSSRParams = {
  containerId: string;
  hydrate?: boolean;
  throwError?: 'getImageUrlSync' | 'dataURI';
};
const runSSR = ({ containerId, hydrate, throwError }: RunSSRParams) => {
  const title = !!throwError ? `Error ${throwError}` : 'Success';

  const txt = ReactDOMServer.renderToString(
    <Page ssr="server" title={title} throwError={throwError} />,
  );
  const elem = document.querySelector(`#${containerId}`);
  if (elem) {
    elem.innerHTML = txt;
    hydrate &&
      ReactDOM.hydrate(
        <Page ssr="client" title={title} throwError={throwError} />,
        elem,
      );
  }
};

type Scenario = [string, () => void];
type ScenarioLabel = 'media-image-server' | 'media-image-hydration';
type Scenarios = Record<ScenarioLabel, Scenario[]>;
const createScenarios = (): Scenarios => {
  const createScenario = ({
    hydrate,
    throwError,
  }: Omit<RunSSRParams, 'containerId'>): Scenario => {
    const containerId = `${hydrate ? 'client' : 'server'}-${
      throwError || 'success'
    }`;
    return [containerId, () => runSSR({ containerId, hydrate, throwError })];
  };
  return {
    'media-image-server': (
      [
        {},
        { throwError: 'getImageUrlSync' },
        { throwError: 'dataURI' },
      ] as const
    ).map(createScenario),
    'media-image-hydration': (
      [
        { hydrate: true },
        { hydrate: true, throwError: 'getImageUrlSync' },
        { hydrate: true, throwError: 'dataURI' },
      ] as const
    ).map(createScenario),
  };
};

const runScenarios = (scenarios: Scenarios) => {
  Object.entries(scenarios).map(([, collection]) =>
    collection.map(([, runSSR]) => runSSR()),
  );
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 20,
} as const;

const ScenariosComponent = ({ scenarios }: { scenarios: Scenarios }) => (
  <>
    {Object.entries(scenarios).map(([label, collection]) => (
      <React.Fragment key={label}>
        <h2>{label}</h2>
        <div style={rowStyle}>
          {collection.map(([id]) => (
            <div key={id} style={{ marginRight: 20 }} id={id}></div>
          ))}
        </div>
      </React.Fragment>
    ))}
  </>
);

export default () => {
  const scenarios = useMemo(() => createScenarios(), []);
  useEffect(() => {
    runScenarios(scenarios);
  }, [scenarios]);

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: 'auto',
        marginTop: 20,
      }}
    >
      <DevelopmentUseMessage />
      <ScenariosComponent scenarios={scenarios} />
    </div>
  );
};
