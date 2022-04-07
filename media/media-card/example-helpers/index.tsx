// eslint-disable-line no-console

import React from 'react';
import { FileItem, Identifier } from '@atlaskit/media-client';
import {
  createPollingMaxAttemptsError,
  createRateLimitedError,
  createStorybookMediaClientConfig,
  FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';

import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { SelectableCard } from './selectableCard';
import { Card, CardAppearance, CardEvent, CardAction } from '../src';
import { getRelevantFeatureFlagNames } from '../src/root/card/cardAnalytics';
import { MediaCardError } from '../src/errors';
import DevelopmentUseMessage from './developmentUseMessage';

const mediaClientConfig = createStorybookMediaClientConfig();

export const clickHandler = (result: CardEvent) => {
  result.event.preventDefault();
  console.log('click', result.mediaItemDetails);
};

export const mouseEnterHandler = (result: CardEvent) => {
  result.event.preventDefault();
  console.log('mouseEnter', result.mediaItemDetails);
};

export const createApiCards = (
  appearance: CardAppearance,
  identifier: Identifier,
) => {
  // API methods
  const apiCards = [
    {
      title: 'not selectable',
      content: (
        <Card
          mediaClientConfig={mediaClientConfig}
          appearance={appearance}
          identifier={identifier}
          onClick={clickHandler}
          onMouseEnter={mouseEnterHandler}
        />
      ),
    },
  ];

  const selectableCard = {
    title: 'selectable',
    content: (
      <SelectableCard
        mediaClientConfig={mediaClientConfig}
        identifier={identifier}
      />
    ),
  };

  if (appearance === 'image') {
    return [...apiCards, selectableCard];
  }

  return apiCards;
};

export const openAction = {
  label: 'Open',
  handler: () => {
    console.log('open');
  },
};
export const closeAction = {
  label: 'Close',
  handler: () => {
    console.log('close');
  },
};
export const deleteAction = {
  label: 'Delete',
  handler: () => {
    console.log('delete');
  },
  icon: <CrossIcon size="small" label="delete" />,
};

export const annotateCardAction: CardAction = {
  label: 'Annotate',
  handler: () => {
    console.log('annotate');
  },
  icon: <AnnotateIcon size="small" label="annotate" />,
};

export const actions = [
  openAction,
  closeAction,
  annotateCardAction,
  deleteAction,
];

export const anotherAction: CardAction = {
  label: 'Some other action',
  handler: (item?: FileItem) => {
    console.log('Some other action', item);
  },
};

export const annotateAction: CardAction = {
  label: 'Annotate',
  handler: (item?: FileItem) => {
    console.log('annotate', item);
  },
};

export const cardsActions = [anotherAction, annotateAction];
export const wrongMediaClientConfig = createStorybookMediaClientConfig({
  authType: 'client',
});
export const wrongCollection = 'adfasdf';

export type MainWrapperProps = {
  developmentOnly?: boolean;
};

export const MainWrapper: React.FC<MainWrapperProps> = ({
  children,
  developmentOnly,
}) => (
  <>
    {developmentOnly && <DevelopmentUseMessage />}
    <FeatureFlagsWrapper filterFlags={getRelevantFeatureFlagNames()}>
      {children}
    </FeatureFlagsWrapper>
  </>
);

export const mediaCardErrorState = (
  error?: string,
): MediaCardError | undefined => {
  switch (error) {
    case 'rateLimitedError':
      return new MediaCardError('error-file-state', createRateLimitedError());
    case 'pollingMaxAttemptsError':
      return new MediaCardError(
        'error-file-state',
        createPollingMaxAttemptsError(),
      );
    case 'uploadError':
      return new MediaCardError('upload');
    default:
      return undefined;
  }
};

export const SSRAnalyticsWrapper: React.FC = ({ children }) => {
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
