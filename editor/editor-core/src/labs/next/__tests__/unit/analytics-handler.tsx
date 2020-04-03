import { act } from 'react-test-renderer';
import { createEditorFactory } from './__create-editor-helper';
import { createDispatch } from '../../../../event-dispatcher';
import { analyticsEventKey } from '../../../../plugins/analytics/consts';

describe('next/Editor – Analytics', () => {
  const createEditor = createEditorFactory();

  it('should call handleAnalyticsEvent if present', () => {
    const onAnalyticsEvent = jest.fn();
    const payload = {};

    act(() => {
      createEditor({
        props: {
          onAnalyticsEvent,
          onMount(actions) {
            const dispatch = createDispatch(
              actions._privateGetEventDispatcher()!,
            );
            dispatch(analyticsEventKey, payload);
          },
        },
      });
    });

    expect(onAnalyticsEvent).toBeCalledWith(payload);
  });
});
