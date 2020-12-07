import { renderHook } from '@testing-library/react-hooks';
import MobileEditorConfiguration from '../../../editor-configuration';
import { useEditorConfiguration } from '../../../hooks/use-editor-configuration';
import WebBridgeImpl from '../../../native-to-web';

describe('use editor configuration', () => {
  it('should call setEditorConfigChangeHandler', () => {
    const mockedSetEditorConfigChangeHandler = jest.fn();
    WebBridgeImpl.prototype.setEditorConfigChangeHandler = mockedSetEditorConfigChangeHandler;
    const bridge = new WebBridgeImpl();
    const config = new MobileEditorConfiguration();
    renderHook(() => useEditorConfiguration(bridge, config));
    expect(mockedSetEditorConfigChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('should call setEditorConfiguration with the passed config', () => {
    const mockedSetEditorConfiguration = jest.fn();
    WebBridgeImpl.prototype.setEditorConfiguration = mockedSetEditorConfiguration;
    const bridge = new WebBridgeImpl();
    const config = new MobileEditorConfiguration();
    renderHook(() => useEditorConfiguration(bridge, config));
    expect(mockedSetEditorConfiguration).toHaveBeenCalledTimes(1);
    expect(mockedSetEditorConfiguration).toHaveBeenCalledWith(config);
  });

  it('should return valid editor configuration', () => {
    const mockedSetEditorConfigChangeHandler = jest.fn();
    WebBridgeImpl.prototype.setEditorConfigChangeHandler = mockedSetEditorConfigChangeHandler;
    const bridge = new WebBridgeImpl();
    const initialConfig = new MobileEditorConfiguration();
    const hook = renderHook(() =>
      useEditorConfiguration(bridge, initialConfig),
    );
    expect(hook.result.current).toEqual(initialConfig);
  });
});
