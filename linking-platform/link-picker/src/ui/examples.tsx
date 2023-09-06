import React from 'react';

import { MockLinkPickerPromisePlugin } from '../__tests__/__helpers/mock-plugins';

import { ComposedLinkPicker as LinkPicker } from './index';

const NOOP = () => {};

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'confluence',
    tabTitle: 'Confluence',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'jira',
    tabTitle: 'Jira',
  }),
];

const createExample = (
  props?: Partial<React.ComponentProps<typeof LinkPicker>>,
) => {
  return () => (
    <div
      style={{
        border: '1px solid red',
        boxSizing: 'border-box',
      }}
    >
      <LinkPicker onSubmit={NOOP} onCancel={NOOP} {...props} />
    </div>
  );
};

export const DefaultExample = () => (
  <LinkPicker onSubmit={NOOP} onCancel={NOOP} />
);

export const DisableWidthExample = createExample({
  plugins: undefined,
  disableWidth: true,
});

export const DisableWidthWithPluginsExample = createExample({
  plugins,
  disableWidth: true,
});

export const DisableWidth500Example = () => {
  return (
    <div style={{ width: 500 }}>
      <h1>Width: 500</h1>
      <h2>Without plugins</h2>
      <DisableWidthExample />
      <h2>With plugins</h2>
      <DisableWidthWithPluginsExample />
    </div>
  );
};

export const DisableWidth300Example = () => {
  return (
    <div style={{ width: 300 }}>
      <h1>Width: 300</h1>
      <h2>Without plugins</h2>
      <DisableWidthExample />
      <h2>With plugins</h2>
      <DisableWidthWithPluginsExample />
    </div>
  );
};
