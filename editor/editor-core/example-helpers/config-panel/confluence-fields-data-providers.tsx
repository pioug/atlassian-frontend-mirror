import React from 'react';
import PersonIcon from '@atlaskit/icon/glyph/person';
import FolderFilledIcon from '@atlaskit/icon/glyph/folder-filled';
import PageIcon from '@atlaskit/icon/glyph/page';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import LabelIcon from '@atlaskit/icon/glyph/label';

const createFieldResolver = (
  items: {
    label: string;
    value: string;
    description?: string;
    icon?: string | React.ReactNode;
  }[],
) => (searchTerm?: string) => {
  if (searchTerm) {
    return Promise.resolve(
      items.filter(
        item =>
          item.label.search(new RegExp(searchTerm, 'i')) !== -1 ||
          item.value.search(new RegExp(searchTerm, 'i')) !== -1,
      ),
    );
  }

  return Promise.resolve(items);
};

export const spaceKeyFieldResolver = createFieldResolver([
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
]);

export const usernameFieldResolver = createFieldResolver([
  {
    label: 'Leandro Augusto Lemos',
    value: 'llemos',
    icon: <PersonIcon size="small" label="llemos" />,
  },
  {
    label: 'Rifat Nabi',
    value: 'rnabi',
    icon: <PersonIcon size="small" label="rnabi" />,
  },
]);

export const labelFieldResolver = createFieldResolver([
  {
    label: 'Meeting notes',
    value: 'meeting-notes',
    icon: <LabelIcon size="small" label="meeting-notes" />,
  },
  {
    label: 'Decision register',
    value: 'decision-register',
    icon: <LabelIcon size="small" label="decision-register" />,
  },
]);

export const confluenceContentFieldResolver = createFieldResolver([
  {
    label: 'How to populate custom fields?',
    value: '123456',
    description: 'Page',
    icon: <PageIcon size="medium" label="123456" />,
  },
  {
    label: 'What should we do with X?',
    value: '654321',
    description: 'Document',
    icon: <DocumentFilledIcon size="medium" label="654321" />,
  },
]);
