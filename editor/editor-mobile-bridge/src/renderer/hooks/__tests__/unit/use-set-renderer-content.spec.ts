import { useRendererContent } from '../../use-set-renderer-content';
import { renderHook } from '@testing-library/react-hooks';
import { doc, p, text } from '@atlaskit/adf-utils/builders';
import { EmitterEvents, eventDispatcher } from '../../../dispatcher';

describe('use renderer content', () => {
  let onEventDispatcherSpy: any;
  let offEventDispatcherSpy: any;
  const initialDoc = doc(p(text('foo')));
  beforeEach(() => {
    onEventDispatcherSpy = jest.spyOn(eventDispatcher, 'on');
    offEventDispatcherSpy = jest.spyOn(eventDispatcher, 'off');
    onEventDispatcherSpy.mockImplementation(jest.fn());
    offEventDispatcherSpy.mockImplementation(jest.fn());
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should register event dispatcher for SET_RENDERER_CONTENT', () => {
    renderHook(() => useRendererContent(JSON.stringify(initialDoc)));
    expect(onEventDispatcherSpy).toHaveBeenCalledWith(
      EmitterEvents.SET_RENDERER_CONTENT,
      expect.any(Function),
    );
  });

  it('should de-register event dispatcher for SET_RENDERER_CONTENT when unmounted', () => {
    const { unmount } = renderHook(() =>
      useRendererContent(JSON.stringify(initialDoc)),
    );
    unmount();
    expect(offEventDispatcherSpy).toHaveBeenCalledWith(
      EmitterEvents.SET_RENDERER_CONTENT,
      expect.any(Function),
    );
  });
});
