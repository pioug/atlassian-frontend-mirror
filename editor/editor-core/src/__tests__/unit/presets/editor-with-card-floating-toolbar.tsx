jest.mock('@atlaskit/editor-plugin-card/src/toolbar.tsx');

import React from 'react';

import { render } from '@testing-library/react';

import type { CardOptions } from '@atlaskit/editor-common/card';

import { Editor } from '../../../index';

describe('floatingToolbar is called with the right config', () => {
  jest.mock('@atlaskit/editor-plugin-card/src/toolbar.tsx');
  const {
    floatingToolbar,
  } = require('@atlaskit/editor-plugin-card/src/toolbar');
  const linkingCardOptions: CardOptions = {
    provider: Promise.resolve({} as any),
  };

  it('should initialise floatingToolbar to have lpLinkPicker false by default', async () => {
    render(
      <Editor
        appearance="full-page"
        linking={{ smartLinks: linkingCardOptions }}
      />,
    );
    expect(floatingToolbar).toHaveBeenCalledWith(
      expect.objectContaining({}),
      false,
      'web',
      undefined,
      expect.objectContaining({}),
      undefined,
    );
  });

  it('should initialise floatingToolbar to have lpLinkPicker false if lp-link-picker feature flag is false', async () => {
    render(
      <Editor
        appearance="full-page"
        linking={{ smartLinks: linkingCardOptions }}
        featureFlags={{
          'lp-link-picker': true,
        }}
      />,
    );
    expect(floatingToolbar).toHaveBeenCalledWith(
      expect.objectContaining({}),
      true,
      'web',
      undefined,
      expect.objectContaining({}),
      undefined,
    );
  });

  it('should initialise floatingToolbar to have lpLinkPicker true if lp-link-picker feature flag is true', async () => {
    render(
      <Editor
        appearance="full-page"
        linking={{ smartLinks: linkingCardOptions }}
        featureFlags={{
          'lp-link-picker': false,
        }}
      />,
    );
    expect(floatingToolbar).toHaveBeenCalledWith(
      expect.objectContaining({}),
      false,
      'web',
      undefined,
      expect.objectContaining({}),
      undefined,
    );
  });
});
