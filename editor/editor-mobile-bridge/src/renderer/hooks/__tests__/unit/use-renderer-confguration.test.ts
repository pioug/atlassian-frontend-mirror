import { renderHook } from '@testing-library/react-hooks';
import RendererConfiguration from '../../../renderer-configuration';
import RendererBridgeImplementation from '../../../native-to-web/implementation';
import useRendererConfiguration from '../../use-renderer-configuration';

describe('use render configuration', () => {
  it(`should return the initial bridge configuration`, () => {
    const bridge = new RendererBridgeImplementation();
    const initialConfig = bridge.getConfiguration();
    const hook = renderHook(() => useRendererConfiguration(bridge));
    expect(hook.result.current).toBe(initialConfig);
  });
  it(`should set the bridge with callbackToNotifyConfigChange`, () => {
    const bridge = new RendererBridgeImplementation();
    const setCallbackToNotifyConfigChangeSpy = jest.spyOn(
      bridge,
      'setCallbackToNotifyConfigChange',
    );
    renderHook(() => useRendererConfiguration(bridge));
    expect(setCallbackToNotifyConfigChangeSpy).toBeCalled();
  });
  it(`should return the new config when bridge is reconfigured`, () => {
    const defaultConfig = new RendererConfiguration();
    const newconfig = new RendererConfiguration(
      JSON.stringify({ disableActions: true }),
    );
    const bridge = new RendererBridgeImplementation();
    const { result } = renderHook(() => useRendererConfiguration(bridge));
    expect(result.current).toEqual(defaultConfig);

    bridge.configure(JSON.stringify({ disableActions: true }));
    expect(result.current).toEqual(newconfig);

    bridge.configure(JSON.stringify({ disableActions: false }));
    expect(result.current).toEqual(defaultConfig);
  });
});
