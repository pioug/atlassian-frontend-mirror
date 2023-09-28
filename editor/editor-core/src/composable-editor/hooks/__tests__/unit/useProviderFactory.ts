import { renderHook } from '@testing-library/react-hooks';

import EditorActions from '../../../../actions';
import * as handleProvidersUtils from '../../../utils/handleProviders';
import useProviderFactory from '../../useProviderFactory';

describe('useProviderFactory', () => {
  describe('should not render unnecessarily', () => {
    const handleProviderSpy = jest.spyOn(handleProvidersUtils, 'default');
    const actions = new EditorActions();
    const createAnalyticsAPI = jest.fn() as any;

    it('only runs once after a rerender with irrelevant props', () => {
      const { rerender } = renderHook(
        ({ props }) => useProviderFactory(props, actions, createAnalyticsAPI),
        { initialProps: { props: {} as any } },
      );
      rerender({ props: { appearance: 'full-page' } });

      expect(handleProviderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
