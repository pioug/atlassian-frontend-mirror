import React from 'react';
import { FileIdentifier } from '@atlaskit/media-client';
import { NumericalCardDimensions } from '@atlaskit/media-common';
import { printFunctionCall, printScript } from '../printScript';
import { MediaCardErrorInfo } from '../../utils/analytics';
import { MediaCardSsr } from './types';

// ----- WARNING -----
// This is a very sensitive fraction of code.
// Any changes to this file must be tested directly in product before merging.
// The scripts printed here might differ from what we observe in our internal tests
// due to minimification, for example.

export const GLOBAL_MEDIA_CARD_SSR = 'mediaCardSsr';
export const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';

export type MediaGlobalScope = {
  [GLOBAL_MEDIA_CARD_SSR]?: MediaCardSsr;
};

export function getMediaGlobalScope(
  globalScope: any = window,
): MediaGlobalScope {
  // Must match GLOBAL_MEDIA_NAMESPACE. Can't reference the constant from here.
  const namespace = '__MEDIA_INTERNAL';
  if (!globalScope[namespace]) {
    globalScope[namespace] = {};
  }
  return globalScope[namespace];
}

export function getMediaCardSSR(globalScope: any = window): MediaCardSsr {
  const globalMedia = getMediaGlobalScope(globalScope);
  // Must match GLOBAL_MEDIA_CARD_SSR. Can't reference the constant from here.
  const key = 'mediaCardSsr';
  if (!globalMedia[key]) {
    globalMedia[key] = {};
  }
  return globalMedia[key] as MediaCardSsr;
}

const dashed = (param?: string) => (param ? `-${param}` : '');

export const getKey = ({ id, collectionName, occurrenceKey }: FileIdentifier) =>
  `${id}${dashed(collectionName)}${dashed(occurrenceKey)}`;

export const storeDataURI = (
  key: string,
  dataURI?: string,
  dimensions?: Partial<NumericalCardDimensions>,
  error?: MediaCardErrorInfo,
  globalScope: any = window,
) => {
  const mediaCardSsr = getMediaCardSSR(globalScope);
  mediaCardSsr[key] = { dataURI, dimensions, error };
};

const generateScript = (
  identifier: FileIdentifier,
  dataURI?: string,
  dimensions?: Partial<NumericalCardDimensions>,
  error?: MediaCardErrorInfo,
) => {
  const functionCall = printFunctionCall(
    storeDataURI,
    getKey(identifier),
    dataURI,
    dimensions,
    error,
  );
  return printScript([
    getMediaCardSSR.toString(),
    getMediaGlobalScope.toString(),
    functionCall,
  ]);
};

export const generateScriptProps = (
  identifier: FileIdentifier,
  dataURI?: string,
  dimensions?: Partial<NumericalCardDimensions>,
  error?: MediaCardErrorInfo,
): React.ScriptHTMLAttributes<HTMLScriptElement> => ({
  dangerouslySetInnerHTML: {
    __html: generateScript(identifier, dataURI, dimensions, error),
  },
});
