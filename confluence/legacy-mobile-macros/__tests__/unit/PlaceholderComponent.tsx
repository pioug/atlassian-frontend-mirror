import React from 'react';

import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { PlaceholderComponent } from '../../src/ui/MacroComponent/PlaceholderComponent';

describe('PlaceholderComponent', () => {
  const mockRenderFallback = jest.fn().mockReturnValue(null);
  const componentProps = {
    extension: {
      extensionKey: 'com.atlassian.confluence.macro.core',
      extensionType: 'drawio',
      parameters: {
        macroMetadata: {
          placeholder: [
            {
              type: 'image',
              data: {
                url: 'unauthenticated-placeholder-url',
              },
            },
          ],
        },
      },
    },
    renderFallback: mockRenderFallback,
  };

  it('should display placeholder url if it is returned from native call', async () => {
    const mockCreatePromise = () => {
      return {
        submit: jest.fn().mockResolvedValue({
          placeholderDataUrl: 'authenticated-placeholder-url',
        }),
      };
    };
    const props = {
      ...componentProps,
      createPromise: mockCreatePromise,
    };

    const { getByTestId } = render(<PlaceholderComponent {...props} />);
    await waitFor(async () => {
      const placeholderImage = getByTestId('placeholder-image');
      expect(placeholderImage).toHaveAttribute(
        'src',
        'authenticated-placeholder-url',
      );
    });
  });

  it('should display fallback url if placeholder url is not returned from native call', async () => {
    const mockCreatePromise = () => {
      return {
        submit: jest.fn().mockResolvedValue({
          placeholderDataUrl: '',
        }),
      };
    };
    const props = {
      ...componentProps,
      createPromise: mockCreatePromise,
    };

    render(<PlaceholderComponent {...props} />);
    await waitFor(async () => {
      expect(mockRenderFallback).toHaveBeenCalled();
    });
  });
});
