import { JsonLd } from 'json-ld-types';

import * as examples from '../../examples-helpers/_jsonLDExamples';
import { Client } from '../../src';
import { exceptionUrls, generateResponse, responses } from './utils';

const getExampleData = (url: string) => {
  const key = url.replace('https://', '');
  return examples[key as keyof typeof examples];
};

const getCustomResponse = (url: string): JsonLd.Response | undefined => {
  const data = getExampleData(url);
  if (data) {
    return generateResponse(url, undefined, data);
  }

  return responses[url];
};

export class ExampleClient extends Client {
  fetchData(url: string) {
    if (Object.values(exceptionUrls).indexOf(url) > -1) {
      throw responses[url];
    }
    const response = getCustomResponse(url);
    if (response) {
      return Promise.resolve(response);
    }
    return super.fetchData(url);
  }
}
