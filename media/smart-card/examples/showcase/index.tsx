import React, { useState, useEffect, useCallback } from 'react';

import { Provider, Client } from '../../src';
import { IntlProvider } from 'react-intl';
import { N200 } from '@atlaskit/theme/colors';
import { ProviderCategory } from './ProviderCategory';
import { ShowcaseMenu } from './Menu';
import { exampleSpinner } from './Spinner';
import { ExampleUIConfig, ExampleUrls, ExampleUrl } from './types';
import { getConfig, exampleUrlsJsonPath } from './config';

export const SmartLinksShowcase = () => {
  const [urls, setUrls] = useState<ExampleUrls>([]);
  const [entities, setEntities] = useState<string[]>([]);
  const [urlsByCategory, setUrlsByCategory] = useState<
    Record<string, ExampleUrl[]>
  >({});
  const [config, setConfig] = useState<ExampleUIConfig>(getConfig());

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
    },
    [setConfig],
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
          client={new Client(config.environment)}
          authFlow={config.authFlow}
        >
          <div style={{ padding: '60px', paddingBottom: '120px' }}>
            <div
              style={{
                textAlign: 'center',
                paddingTop: '24px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <h1>✨ Smart Links Showcase ✨</h1>
              <h3 style={{ paddingBottom: '60px', color: N200 }}>
                {entitiesSupported} entities supported across{' '}
                {providersSupported} providers.
              </h3>
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
