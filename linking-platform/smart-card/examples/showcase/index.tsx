/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { Provider, Client } from '../../src';
import { IntlProvider } from 'react-intl-next';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { ProviderCategory } from './ProviderCategory';
import { ShowcaseMenu } from './Menu';
import { exampleSpinner } from './Spinner';
import { type ExampleUIConfig, type ExampleUrls, type ExampleUrl } from './types';
import { getConfig, exampleUrlsJsonPath } from './config';
import { type EnvironmentsKeys } from '@atlaskit/link-provider';

import Tooltip from '@atlaskit/tooltip';

const START_PROD_URL = 'https://start.atlassian.com/gateway/api';
const START_STG_URL = 'https://start.stg.atlassian.com/gateway/api';

export const SmartLinksShowcase = () => {
  const EnvOverrides: Record<EnvironmentsKeys, string> = useMemo(() => {
    return {
      stg: START_STG_URL,
      staging: START_STG_URL,
      prd: START_PROD_URL,
      prod: START_PROD_URL,
      production: START_PROD_URL,
      dev: '',
      development: '',
    };
  }, []);

  const [urls, setUrls] = useState<ExampleUrls>([]);
  const [entities, setEntities] = useState<string[]>([]);
  const [urlsByCategory, setUrlsByCategory] = useState<
    Record<string, ExampleUrl[]>
  >({});
  const [config, setConfig] = useState<ExampleUIConfig>(getConfig());
  const [envUrl, setEnvUrl] = useState<string>(
    EnvOverrides[config.environment],
  );

  useEffect(() => {
    fetch(exampleUrlsJsonPath)
      .then((r) => r.json())
      .then((exampleUrls) => setUrls(exampleUrls as ExampleUrls));
  }, []);

  useEffect(() => {
    const urlsByCategory: Record<string, ExampleUrl[]> = {};
    const entitiesMap: Record<string, boolean> = {};
    for (const example of urls) {
      if (!urlsByCategory[example.category]) {
        urlsByCategory[example.category] = [];
      }
      urlsByCategory[example.category].push(example);
      for (const resourceType of example.examples) {
        entitiesMap[resourceType.displayName] = true;
      }
    }
    setUrlsByCategory(urlsByCategory);
    setEntities(Object.keys(entitiesMap).sort());
  }, [urls]);

  const handleConfigChange = useCallback(
    (newConfig: ExampleUIConfig) => {
      localStorage.setItem('__SMART_LINKS_CONFIG__', JSON.stringify(newConfig));
      setConfig(newConfig);
      setEnvUrl(EnvOverrides[newConfig.environment]);
    },
    [EnvOverrides, setConfig],
  );

  const helpMessageUrl = useMemo(
    () => (
      <Tooltip
        content={
          <div>
            <p>
              We know it's not a usual "log in" but we need to acquire
              ASAP-signed JWT token through a micros static server for our
              Atlaskit examples.{' '}
              <a
                href="https://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3057025945"
                target="_blank"
              >
                Read more about that here.
              </a>
            </p>
            <p>
              To access the links login to start. Atlassian products' production
              links including hello and product fabric will not resolve on
              staging environment.
            </p>
          </div>
        }
      >
        {(tooltipProps) => (
          <a href={envUrl} target="_blank" {...tooltipProps}>
            To load links, please login to start
          </a>
        )}
      </Tooltip>
    ),
    [envUrl],
  );

  if (urls) {
    const providersSupported = urls.length;
    const entitiesSupported = urls.reduce((sum, provider) => {
      sum += provider.examples.length;
      return sum;
    }, 0);
    return (
      <IntlProvider locale="en">
        <Provider
          client={new Client(config.environment, envUrl)}
          authFlow={config.authFlow}
        >
          <div
            style={{
              padding: token('space.800', '64px'),
              // we hardcode the padding bottom to account for the spacing of the floating bar on the example page
              paddingBottom: '120px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                paddingTop: token('space.300', '24px'),
                paddingBottom: token('space.1000', '80px'),
                position: 'relative',
                zIndex: 1,
              }}
            >
              <h1>✨ Smart Links Showcase ✨</h1>
              <h3
                style={{
                  color: token('color.text.subtlest', N200),
                }}
              >
                {entitiesSupported} entities supported across{' '}
                {providersSupported} providers.
              </h3>
              {helpMessageUrl}
            </div>
            <div style={{ zIndex: 1, position: 'relative' }}>
              {Object.entries(urlsByCategory)
                .sort(([categoryA], [categoryB]) =>
                  categoryA.localeCompare(categoryB),
                )
                .map(([category, examples]) => (
                  <ProviderCategory
                    key={category}
                    category={category}
                    examples={examples}
                    config={config}
                  />
                ))}
            </div>
          </div>
          <ShowcaseMenu
            config={config}
            onViewTypeChange={(appearance) =>
              handleConfigChange({ ...config, appearance })
            }
            onAuthFlowChange={(authFlow) => setConfig({ ...config, authFlow })}
            onEnvironmentChange={(environment) =>
              handleConfigChange({ ...config, environment })
            }
            entities={entities}
            onEntityChange={(selectedEntities) =>
              handleConfigChange({ ...config, selectedEntities })
            }
          />
        </Provider>
      </IntlProvider>
    );
  } else {
    return exampleSpinner;
  }
};
