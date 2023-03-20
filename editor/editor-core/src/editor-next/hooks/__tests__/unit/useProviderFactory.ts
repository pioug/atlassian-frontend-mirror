import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { renderHook } from '@testing-library/react-hooks';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import useProviderFactory from '../../useProviderFactory';
import EditorActions from '../../../../actions';

describe('useProviderFactory', () => {
  const createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any> =
    createAnalyticsEventMock();
  it('is empty if it has no providers supplied', () => {
    const { result } = renderHook(() =>
      useProviderFactory({}, new EditorActions(), createAnalyticsEvent as any),
    );

    expect(result.current.isEmpty()).toBe(true);
  });

  it('should have an emoji provider if supplied', () => {
    const { result } = renderHook(() =>
      useProviderFactory(
        { emojiProvider: new Promise(() => ({})) },
        new EditorActions(),
        createAnalyticsEvent as any,
      ),
    );

    expect(result.current.isEmpty()).toBe(false);
    expect(result.current.hasProvider('emojiProvider')).toBe(true);
  });

  it('should be empty on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useProviderFactory(
        { emojiProvider: new Promise(() => ({})) },
        new EditorActions(),
        createAnalyticsEvent as any,
      ),
    );
    unmount();

    expect(result.current.isEmpty()).toBe(true);
    expect(result.current.hasProvider('emojiProvider')).toBe(false);
  });
});
