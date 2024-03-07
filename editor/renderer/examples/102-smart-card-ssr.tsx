import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import ReactDOMServer from 'react-dom/server';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';
import { token } from '@atlaskit/tokens';
import { default as Renderer } from '../src/ui/Renderer';
import smartCardAdf from './helper/ssr-smart-card.json';
import type { RendererProps } from '../src/ui/renderer-props';

type PageProps = {
  title: string;
};

const Page = ({ title }: PageProps) => {
  const rendererProps: Partial<RendererProps> = {
    smartLinks: {
      ssr: true,
    },
  };
  const storeOptions = {
    initialState: {
      [url]: cardState,
    },
  };
  return (
    <div
      style={{
        width: 1200,
        border: '1px solid',
        margin: token('space.150', '12px'),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h3>{title}</h3>
      </div>
      <IntlProvider locale="en">
        <SmartCardProvider
          storeOptions={storeOptions}
          client={new CardClient('staging')}
        >
          <Renderer
            document={smartCardAdf}
            schema={defaultSchema}
            appearance="full-page"
            enableSsrInlineScripts={true}
            {...rendererProps}
          />
        </SmartCardProvider>
      </IntlProvider>
    </div>
  );
};

const runSSR = async (containerId: string, hydrate?: boolean) => {
  const txt = ReactDOMServer.renderToString(<Page title="Renderer SSR Only" />);
  const container = document.querySelector(`#${containerId}`);

  if (container) {
    container.innerHTML = txt;
    hydrate &&
      ReactDOM.hydrate(<Page title="Renderer SSR + Hydration" />, container);
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
      <div>
        <Page title="SPA" />
      </div>
    </div>
  );
};
