import React from 'react';
import { JsonLd } from 'json-ld-types';
import { css } from '@emotion/react';
import LikeIcon from '@atlaskit/icon/glyph/like';
import { token } from '@atlaskit/tokens';
import { CardType, CardState } from '@atlaskit/linking-common';
import extractFlexibleLinkContext from '../../src/extractors/flexible';
import { FlexibleUiDataContext } from '../../src/state/flexible-ui-context/types';
import { ActionName, ElementName } from '../../src';
import { ElementDisplaySchema } from '../../src/view/FlexibleCard/components/blocks/utils';
import {
  CustomActionItem,
  NamedActionItem,
  NamedDataActionItem,
} from '../../src/view/FlexibleCard/components/blocks/types';

export const getJsonLdResponse = (url: string, meta = {}, data = {}) =>
  ({
    meta: {
      visibility: 'public',
      access: 'granted',
      auth: [],
      definitionId: 'd1',
      key: 'object-provider',
      ...meta,
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ...data,
      url,
    },
  } as JsonLd.Response);

export const getCardState = (
  data = {},
  meta = {},
  status = 'resolved' as CardType,
): CardState => ({
  status,
  details: getJsonLdResponse('link-url', meta, {
    '@type': 'Object',
    generator: {
      '@type': 'Object',
      '@id': 'https://www.atlassian.com/#Confluence',
      name: 'Confluence',
    },
    url: 'link-url',
    name:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non elementum augue. Donec porttitor purus ut lacus blandit, quis hendrerit turpis pharetra. Etiam commodo lorem metus, eu eleifend tellus mattis sed. Suspendisse potenti. Duis metus quam, lacinia dapibus faucibus quis, laoreet quis turpis. Curabitur iaculis suscipit ligula ac commodo. Cras in metus enim. Duis sit amet turpis suscipit, ultricies odio sit amet, bibendum sem. Nunc consectetur diam vel elit pulvinar posuere. Maecenas neque mauris, tempor nec dolor nec, mollis laoreet nibh. Fusce mauris ante, scelerisque in tristique ut, ultrices sed eros. Cras imperdiet tellus nisl, in efficitur nibh rhoncus eget.',
    ...data,
  }),
});

export const getContext = (
  override: Partial<FlexibleUiDataContext> = {},
): FlexibleUiDataContext => {
  const cardState = getCardState();
  const context = extractFlexibleLinkContext(cardState.details);
  return {
    ...context,
    ...override,
  };
};

export const makeDeleteActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedActionItem => ({
  name: ActionName.DeleteAction,
  onClick: () => console.log('Delete action!'),
  ...options,
});

export const makePreviewActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedDataActionItem => ({
  name: ActionName.PreviewAction,
  onClick: () => console.log('Preview action!'),
  ...options,
});

export const makeViewActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedDataActionItem => ({
  name: ActionName.ViewAction,
  onClick: () => console.log('View action!'),
  ...options,
});

export const makeDownloadActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedDataActionItem => ({
  name: ActionName.DownloadAction,
  onClick: () => console.log('Download action!'),
  ...options,
});

export const makeEditActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedActionItem => ({
  name: ActionName.EditAction,
  onClick: () => console.log('Edit action!'),
  ...options,
});

export const makeCustomActionItem = (
  options: Pick<CustomActionItem, 'icon' | 'content' | 'testId'> = {},
): CustomActionItem => ({
  name: ActionName.CustomAction,
  onClick: () => console.log('Custom action!'),
  icon: <LikeIcon label="like" />,
  iconPosition: 'before',
  content: 'Like',
  ...options,
});

export const exampleTokens = {
  backgroundColor: token('color.background.neutral', '#091E420F'),
  iconBackgroundColor: token('color.icon.brand', '#0C66E4'),
  iconColor: token('color.text.inverse', '#FFFFFF'),
  overrideColor: token('color.background.accent.blue.subtle', '#579DFF'),
};

export const blockOverrideCss = css`
  background-color: ${exampleTokens.overrideColor};
  border-radius: 0.5rem;
  padding: 1rem;
`;

export const metadataElements = Object.values(ElementName).filter(
  (name) =>
    name !== ElementName.Title &&
    name !== ElementName.LinkIcon &&
    ElementDisplaySchema[name].includes('inline'),
);

export const actionNames: Exclude<
  ActionName,
  ActionName.CustomAction
>[] = (Object.values(ActionName).filter(
  (name) => name !== ActionName.CustomAction,
) as unknown) as Exclude<ActionName, ActionName.CustomAction>[];
