import React from 'react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import { LinkPicker as LinkPickerType } from '../../../';

describe('<ComposedLinkPicker />', () => {
  const setupLinkPicker = ({ url = '' }: { url?: string } = {}) => {
    jest.isolateModules(() => {
      const LinkPicker: typeof LinkPickerType = require('../../..').LinkPicker;
      render(
        <LinkPicker
          url={url}
          onSubmit={jest.fn()}
          plugins={[]}
          onCancel={jest.fn()}
        />,
      );
    });

    return {
      testIds: {
        urlInputField: 'link-url',
        errorBoundary: 'link-picker-root-error-boundary-ui',
        loaderBoundary: 'link-picker-root-loader-boundary-ui',
      },
    };
  };

  describe('lazy load', () => {
    it('after resolving it should load the LinkPicker component', async () => {
      const { testIds } = setupLinkPicker();

      await waitForElementToBeRemoved(() =>
        screen.getByTestId(testIds.loaderBoundary),
      );

      expect(screen.getByTestId(testIds.urlInputField)).toBeInTheDocument();
    });

    it('should render loader-fallback', () => {
      const { testIds } = setupLinkPicker();

      expect(screen.getByTestId(testIds.loaderBoundary)).toBeInTheDocument();
    });
  });

  describe('error boundary', () => {
    it('renders a fallback ui if the inner link picker component throws an error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Provide an invalid initial prop to throw an error
      const { testIds } = setupLinkPicker({
        url: new URL('https://atlassian.com') as any,
      });

      await waitForElementToBeRemoved(() =>
        screen.getByTestId(testIds.loaderBoundary),
      );

      expect(screen.getByTestId(testIds.errorBoundary)).toBeInTheDocument();
    });
  });
});
