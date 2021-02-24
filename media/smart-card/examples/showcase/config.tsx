import { ExampleUIConfig } from './types';
const CONFIG_KEY = '__SMART_LINKS_CONFIG__';

export const exampleUrlsJsonPath =
  'https://statlas.prod.atl-paas.net/forge-smart-links/urls.json';
export const getConfig = (): ExampleUIConfig => {
  const fromLocalStorage = localStorage.getItem(CONFIG_KEY);
  if (fromLocalStorage) {
    return JSON.parse(fromLocalStorage) as ExampleUIConfig;
  }
  return {
    appearance: 'inline',
    authFlow: 'oauth2',
    environment: 'stg',
    selectedEntities: [],
  };
};
