import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { MediaClientConfig } from '@atlaskit/media-core';
import { SSR } from '@atlaskit/media-common';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import CardLoader from '../src/root/card/cardLoader';
import ReactDOMServer from 'react-dom/server';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { MainWrapper, SSRAnalyticsWrapper } from '../example-helpers';

const dimensions = { width: 300, height: 200 };

const getMediaClientConfig = async () => {
  const mediaClientConfig = createStorybookMediaClientConfig();
  const initialAuth = await mediaClientConfig.authProvider();
  return {
    ...mediaClientConfig,
    initialAuth,
  };
};

const modes = {
  single: {
    resizeMode: 'stretchy-fit' as const,
    disableOverlay: true,
  },
  group: {
    disableOverlay: false,
  },
};

const Page = ({
  ssr,
  title,
  mode,
  mediaClientConfig,
}: {
  ssr: SSR;
  title: string;
  mode: 'single' | 'group';
  mediaClientConfig: MediaClientConfig;
}) => {
  return (
    <SSRAnalyticsWrapper>
      <h3>{title}</h3>
      <CardLoader
        mediaClientConfig={mediaClientConfig}
        identifier={imageFileId}
        dimensions={dimensions}
        ssr={ssr}
        shouldOpenMediaViewer={true}
        {...modes[mode]}
      />
    </SSRAnalyticsWrapper>
  );
};

const runSSR = async (
  containerId: string,
  mode: 'single' | 'group',
  hydrate?: boolean,
) => {
  const mediaClientConfig = await getMediaClientConfig();
  const txt = ReactDOMServer.renderToString(
    <Page
      ssr="server"
      title={'SSR Only'}
      mode={mode}
      mediaClientConfig={mediaClientConfig}
    />,
  );
  const elem = document.querySelector(`#${containerId}`);

  if (elem) {
    elem.innerHTML = txt;
    hydrate &&
      ReactDOM.hydrate(
        <Page
          ssr="client"
          title={'SSR + Hydration'}
          mode={mode}
          mediaClientConfig={mediaClientConfig}
        />,
        elem,
      );
  }
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 20,
} as const;

export default () => {
  const serverOnlySingleId = 'container-ssr-single';
  const serverOnlyGroupId = 'container-ssr-group';
  const hydrationSingleId = 'container-hydration-single';
  const hydrationGroupId = 'container-hydration-group';
  useEffect(() => {
    Loadable.preloadAll().then(() => {
      runSSR(serverOnlySingleId, 'single');
      runSSR(hydrationSingleId, 'single', true);
      runSSR(serverOnlyGroupId, 'group');
      runSSR(hydrationGroupId, 'group', true);
    });
  }, []);

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: 'auto',
        marginTop: 20,
      }}
    >
      <MainWrapper>
        <h2>Media Single</h2>
        <div style={rowStyle}>
          <div style={{ marginRight: 20 }} id={serverOnlySingleId}></div>
          <div style={{ marginRight: 20 }} id={hydrationSingleId}></div>
        </div>
        <hr />
        <h2>Media Group</h2>
        <div style={rowStyle}>
          <div style={{ marginRight: 20 }} id={serverOnlyGroupId}></div>
          <div style={{ marginRight: 20 }} id={hydrationGroupId}></div>
        </div>
      </MainWrapper>
    </div>
  );
};
