import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { MediaClientConfig } from '@atlaskit/media-core';
import { SSR } from '@atlaskit/media-common';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import ReactDOMServer from 'react-dom/server';
import { default as Renderer } from '../src/ui/Renderer';
import doc from './helper/ssr-media-adf.json';

const getMediaClientConfig = async () => {
  const mediaClientConfig = createStorybookMediaClientConfig();
  const initialAuth = await mediaClientConfig.authProvider();
  return {
    ...mediaClientConfig,
    initialAuth,
  };
};

type PageProps = {
  ssr: SSR;
  title: string;
  mediaClientConfig: MediaClientConfig;
};

const Page = ({ ssr, title, mediaClientConfig }: PageProps) => {
  const rendererProps = {
    media: {
      ssr: {
        mode: ssr,
        config: mediaClientConfig, // TODO: update example to use Media Mock https://product-fabric.atlassian.net/browse/MEX-1260
      },
      featureFlags: { newCardExperience: true },
    },
  };
  return (
    <div style={{ width: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h3>{title}</h3>
      </div>
      <IntlProvider locale="en">
        <Renderer
          document={doc}
          schema={defaultSchema}
          appearance="full-page"
          enableSsrInlineScripts={true}
          {...rendererProps}
        />
      </IntlProvider>
    </div>
  );
};

const runSSR = async (containerId: string, hydrate?: boolean) => {
  const mediaClientConfig = await getMediaClientConfig();
  const txt = ReactDOMServer.renderToString(
    <Page
      ssr="server"
      title={'Renderer SSR Only'}
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
          title={'Renderer SSR + Hydration'}
          mediaClientConfig={mediaClientConfig}
        />,
        elem,
      );
  }
};

export default () => {
  const serverOnlyId = 'container-ssr';
  const hydrationId = 'container-hydration';
  useEffect(() => {
    Loadable.preloadAll().then(() => {
      runSSR(serverOnlyId);
      runSSR(hydrationId, true);
    });
  }, []);

  return (
    <div>
      <div id={serverOnlyId}></div>
      <div id={hydrationId}></div>
    </div>
  );
};
