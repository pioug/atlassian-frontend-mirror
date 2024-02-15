// Loom SDK mock - Non-functional, but acts like it is, just like me
jest.mock('@loomhq/record-sdk', () => ({
  isSupported: jest
    .fn()
    .mockResolvedValue({ supported: true, error: undefined }),
  setup: jest.fn().mockResolvedValue({
    configureButton: ({ element }: { element: HTMLElement | undefined }) => {
      if (!element) {
        return undefined;
      }

      // @ts-ignore
      element.on = () => {};

      return element;
    },
  }),
}));

import React from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import Editor from '../../../editor';

describe('Universal preset', () => {
  describe('Loom plugin', () => {
    describe('should insert video links as embed smart link if smart links are enabled', () => {
      ffTest(
        'platform.editor.loom-integration',
        async () => {
          // When feature flag is on there should be a Loom toolbar button
          render(<Editor />);

          const mainToolbar = await waitFor(() =>
            screen.getByRole('toolbar', { name: 'Editor' }),
          );
          await waitFor(() =>
            expect(
              within(mainToolbar).getByRole('button', { name: 'Record video' }),
            ).toBeEnabled(),
          );
        },
        async () => {
          // When feature flag is off there is no Loom toolbar button
          render(<Editor />);

          const mainToolbar = await waitFor(() =>
            screen.getByRole('toolbar', { name: 'Editor' }),
          );
          await waitFor(() =>
            expect(
              within(mainToolbar).queryByRole('button', {
                name: 'Record video',
              }),
            ).not.toBeInTheDocument(),
          );
        },
      );
    });
  });
});
