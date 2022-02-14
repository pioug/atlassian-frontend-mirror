import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Checkbox } from '@atlaskit/checkbox';

import {
  ActionItem,
  ActionName,
  ElementItem,
  ElementName,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../../src';
import * as examples from '../../examples-helpers/_jsonLDExamples';

export const mockUrls = Object.keys(examples).reduce(
  (acc, key) => ({ ...acc, [key]: `https://${key}` }),
  {},
);

export const statusUrls = {
  Errored: 'https://errored-url?s=something%20went%20wrong',
  Forbidden: 'https://forbidden-url?s=you%20shall%20not%20pass',
  NotFound: 'https://not-found-url?s=ruh%20roh%20its%20404%20error',
  Unauthorized: 'https://unauthorised-url?s=please%20give%20me%20access',
};

export const exampleUrls = { ...mockUrls, ...statusUrls };

const toRadioGroupOptions = (obj: Object, name: string) =>
  Object.entries(obj).map(([key, value]) => ({ name, value, label: key }));

export const sizeOptions = toRadioGroupOptions(SmartLinkSize, 'size');
export const themeOptions = toRadioGroupOptions(SmartLinkTheme, 'theme');
export const positionOptions = toRadioGroupOptions(
  SmartLinkPosition,
  'position',
);
export const directionOptions = toRadioGroupOptions(
  SmartLinkDirection,
  'direction',
);
export const envOptions = [
  { name: 'env', value: 'stg', label: 'Staging' },
  { name: 'env', value: 'mock', label: 'Mock' },
];

export const handleOnChange = <T extends string>(
  onChange: React.Dispatch<React.SetStateAction<T>>,
) => (e: React.ChangeEvent<HTMLInputElement>) => {
  onChange(e.target.value as T);
};

export const renderCheckbox = (onChange: Function, label: string) => (
  <Checkbox label={label} onChange={(e) => onChange(e.target.checked)} />
);

export const renderElementGroupCheckbox = (
  elementItems: ElementItem[],
  setElementGroup: Function,
  item: ElementItem,
) => {
  return (
    <Checkbox
      key={item.name}
      label={item.name}
      value={item.name}
      onChange={(e) => {
        const { checked, value } = e.target;
        const updated = checked
          ? [...elementItems, item]
          : elementItems.filter((d) => d.name !== value);
        setElementGroup(updated);
      }}
    />
  );
};

export const renderActionGroupCheckbox = (
  actionItems: ActionItem[],
  setActionGroup: Function,
  item: ActionItem,
) => {
  return (
    <Checkbox
      key={item.name}
      label={item.name}
      value={item.name}
      onChange={(e) => {
        const { checked, value } = e.target;
        const updated = checked
          ? [...actionItems, item]
          : actionItems.filter((d) => d.name !== value);
        setActionGroup(updated);
      }}
    />
  );
};

export const renderElementGroupOptions = (
  elementItems: ElementItem[],
  setElementGroup: Function,
) => {
  return Object.values(ElementName)
    .filter(
      (name) => name !== ElementName.Title && name !== ElementName.LinkIcon,
    )
    .map((name) =>
      renderElementGroupCheckbox(elementItems, setElementGroup, {
        name,
      } as ElementItem),
    );
};

export const generateResponse = (url: string, meta = {}, data = {}) =>
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

export const renderActionGroupOptions = (
  actionItems: ActionItem[],
  setActionItems: Function,
) => {
  return [
    {
      name: ActionName.DeleteAction,

      onClick: () => {
        console.log('This is a Delete Action');
      },
    },
  ].map((item, idx) =>
    renderActionGroupCheckbox(actionItems, setActionItems, item as ActionItem),
  );
};

export const responses = {
  [statusUrls.Errored]: { data: null } as any,
  [statusUrls.Forbidden]: generateResponse(statusUrls.Forbidden, {
    visibility: 'restricted',
    access: 'forbidden',
    auth: [
      {
        key: 'some-flow',
        displayName: 'Flow',
        url: 'https://outbound-auth/flow',
      },
    ],
  }),
  [statusUrls.NotFound]: generateResponse(statusUrls.NotFound, {
    visibility: 'not_found',
    access: 'forbidden',
  }),
  [statusUrls.Unauthorized]: generateResponse(statusUrls.Unauthorized, {
    visibility: 'restricted',
    access: 'unauthorized',
    auth: [
      {
        key: 'some-flow',
        displayName: 'Flow',
        url: 'https://outbound-auth/flow',
      },
    ],
  }),
};
