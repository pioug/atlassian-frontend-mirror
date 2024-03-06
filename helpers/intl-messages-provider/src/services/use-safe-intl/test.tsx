import React from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import { DEFAULT_LOCALE_STATE } from '../../common/constants';

import { useSafeIntl } from './index';

describe('useSafeIntl()', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const translated = { foo: 'Translated string' };

  it('should return deafult Intl shape when no Intl Context', () => {
    const { result } = renderHook(() => {
      return useSafeIntl();
    });

    waitFor(() => {
      expect(result.current).toEqual(DEFAULT_LOCALE_STATE);
    });
  });

  it('should return Intl context when a provider is present', () => {
    const testWrapper = ({ children }: { children?: React.ReactNode }) => (
      <IntlProvider locale="es-ES" messages={translated}>
        {children}
      </IntlProvider>
    );

    const wrapper = (props: {}) => testWrapper(props);

    const { result } = renderHook(
      () => {
        return useSafeIntl();
      },
      { wrapper },
    );

    waitFor(() => {
      expect(result.current.messages).toEqual(translated);
    });
  });
});
