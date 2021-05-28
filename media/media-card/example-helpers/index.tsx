// eslint-disable-line no-console

import React from 'react';
import { FileItem, Identifier } from '@atlaskit/media-client';
import {
  createStorybookMediaClientConfig,
  FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { SelectableCard } from './selectableCard';
import { Card, CardAppearance, CardEvent, CardAction } from '../src';
import { relevantFeatureFlagNames } from '../src/root/card/cardAnalytics';

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

export const MainWrapper: React.FC = ({ children }) => (
  <FeatureFlagsWrapper filterFlags={relevantFeatureFlagNames}>
    {children}
  </FeatureFlagsWrapper>
);
