/** @jsx jsx */
import React, { useState, useEffect, useMemo } from 'react';
import { css, jsx } from '@emotion/core';
import { JsonLd } from 'json-ld-types';
import { Checkbox } from '@atlaskit/checkbox';
import Select from '@atlaskit/select';

import {
  ActionName,
  ElementItem,
  ElementName,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
  ActionItem,
} from '../../src';
import * as examples from '../../examples-helpers/_jsonLDExamples';
import {
  ElementDisplaySchema,
  ElementDisplaySchemaType,
} from '../../src/view/FlexibleCard/components/blocks/utils';
import Range from '@atlaskit/range/range';
import {
  CustomActionItem,
  NamedActionItem,
} from '../../src/view/FlexibleCard/components/blocks/types';
import LikeIcon from '@atlaskit/icon/glyph/like';
import PremiumIcon from '@atlaskit/icon/glyph/premium';

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
  onChange(e.currentTarget.value as T);
};

export const renderCheckbox = (
  onChange: Function,
  label: string,
  size?: 'small' | 'medium' | 'large' | 'xlarge',
) => (
  <Checkbox
    label={label}
    onChange={(e) => onChange(e.currentTarget.checked)}
    size={size}
  />
);

export const RenderActionOptions = ({
  setActionItems,
}: {
  setActionItems: Function;
}) => {
  const uniqueActionNames = useMemo(() => Object.values(ActionName), []);
  const [selectedItems, setSelectedItems] = useState<ActionName[]>([]);
  const [numberOfOptions, setNumberOfOptions] = useState(1);
  const [hideIcon, setHideIcon] = useState<boolean>(false);
  const [hideContent, setHideContent] = useState<boolean>(false);

  const options = uniqueActionNames.map((name) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    let actionNames: ActionName[] = [];
    if (selectedItems.length > 0) {
      if (numberOfOptions && numberOfOptions > 1) {
        for (let i = 0; i < numberOfOptions; i++) {
          actionNames.push(selectedItems[i % uniqueActionNames.length]);
        }
      } else {
        actionNames = uniqueActionNames;
      }
    }

    const items: ActionItem[] = actionNames.map((name) => ({
      onClick: () => {
        console.log(`You have clicked on ${name}`);
      },
      hideIcon,
      hideContent,
      ...(name === 'CustomAction'
        ? {
            name: ActionName.CustomAction,
            icon: <PremiumIcon label="magic" />,
            content: 'Magic!',
          }
        : {
            name,
          }),
    }));

    setActionItems(items);
  }, [
    selectedItems,
    numberOfOptions,
    setActionItems,
    uniqueActionNames,
    hideIcon,
    hideContent,
  ]);

  return (
    <div>
      <label>Unique actions to pick</label>
      <Select
        isMulti
        onChange={(values) => {
          const selectedItems: ActionName[] = values.map(
            ({ value }) => value as ActionName,
          );
          setSelectedItems(selectedItems);
        }}
        options={options}
        placeholder="Add actions"
      />
      <label>Number of actions ({numberOfOptions})</label>
      <Range
        step={1}
        value={numberOfOptions}
        max={6}
        onChange={(value) => setNumberOfOptions(value)}
      />
      {renderCheckbox(setHideIcon, 'Hide icon')}
      {renderCheckbox(setHideContent, 'Hide content')}
    </div>
  );
};

export const renderMetadataOptions = (
  elementItems: ElementItem[],
  setElementGroup: Function,
  display: ElementDisplaySchemaType = 'inline',
) => {
  const options = Object.values(ElementName)
    .filter(
      (name) =>
        name !== ElementName.Title &&
        name !== ElementName.LinkIcon &&
        ElementDisplaySchema[name].includes(display),
    )
    .map((name) => ({ label: name, value: name }));

  return (
    <Select
      isMulti
      onChange={(values) => {
        const items = values.map(({ value }) => ({ name: value }));
        setElementGroup(items);
      }}
      options={options}
      placeholder="Add metadata"
    />
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

export const blockOptionStyles = css`
  display: flex;
  margin-top: 1rem;
  > div {
    flex: 1 1 auto;
  }
  > div:first-of-type {
    flex: 0 1 15%;
  }
`;

export const makeDeleteActionItem = (
  options: Pick<NamedActionItem, 'hideContent' | 'hideIcon' | 'testId'> = {},
): NamedActionItem => ({
  name: ActionName.DeleteAction,
  onClick: () => console.log('Delete action!'),
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
