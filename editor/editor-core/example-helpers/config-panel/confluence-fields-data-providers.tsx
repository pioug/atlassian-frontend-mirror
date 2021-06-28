import React from 'react';
import FolderFilledIcon from '@atlaskit/icon/glyph/folder-filled';
import LabelIcon from '@atlaskit/icon/glyph/label';
import PageIcon from '@atlaskit/icon/glyph/page';
import PersonIcon from '@atlaskit/icon/glyph/person';
import { Option, Parameters } from '@atlaskit/editor-common/extensions';

const createCustomFieldResolver = (items: Option[], lazyItems?: Option[]) => (
  searchTerm?: string,
  defaultValue?: string[] | string,
  _parameters?: Parameters,
): Promise<Option[]> => {
  const filter = (term?: string | string[], items?: Option[]): Option[] => {
    if (!Array.isArray(items)) {
      return [];
    }

    const filterByTerm = (term?: string): Option[] => {
      if (!term) {
        return items;
      }
      return items.filter(
        (item) =>
          item.label.search(new RegExp(term, 'i')) !== -1 ||
          item.value.search(new RegExp(term, 'i')) !== -1,
      );
    };

    if (Array.isArray(term)) {
      return ([] as Option[]).concat(...term.map(filterByTerm));
    }
    return filterByTerm(term);
  };

  if (searchTerm) {
    return Promise.resolve(filter(searchTerm, items));
  }
  if (defaultValue) {
    return Promise.resolve([...items, ...filter(defaultValue, lazyItems)]);
  }
  return Promise.resolve(items);
};

export const mockFieldResolver = createCustomFieldResolver([
  {
    label: 'XRay',
    value: 'XR',
    icon: <FolderFilledIcon size="small" label="XR" />,
  },
  {
    label: 'Feature Flags',
    value: 'FF',
    icon: <FolderFilledIcon size="small" label="FF" />,
  },
  {
    label: 'Sunny days',
    value: 'SD',
    icon: <FolderFilledIcon size="small" label="SD" />,
  },
  {
    label: 'Bushfires',
    value: 'BF',
    icon: <FolderFilledIcon size="small" label="BF" />,
  },
  {
    label: 'Meeting notes',
    value: 'meeting-notes',
    icon: <LabelIcon size="small" label="meeting-notes" />,
  },
  {
    label: 'How to populate custom fields?',
    value: '123456',
    description: 'A page that is missing',
    icon: <PageIcon size="medium" label="123456" />,
  },
  {
    label: 'The User',
    value: 'myuser',
    icon: <PersonIcon size="small" label="The User" />,
  },
]);
