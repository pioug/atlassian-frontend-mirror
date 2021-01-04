import { renderHook } from '@testing-library/react-hooks';
import MobileEditorConfiguration from '../../../editor-configuration';
import { useEditorConfiguration } from '../../../hooks/use-editor-configuration';
import WebBridgeImpl from '../../../native-to-web';

describe('use editor configuration', () => {
  let bridge: WebBridgeImpl;
  let initialConfig: MobileEditorConfiguration;
  let mockedSetEditorConfigChangeHandler: jest.SpyInstance;
  let mockedSetEditorConfiguration: jest.SpyInstance;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
    initialConfig = new MobileEditorConfiguration();
    mockedSetEditorConfigChangeHandler = jest.spyOn(
      WebBridgeImpl.prototype,
      'setEditorConfigChangeHandler',
    );
    mockedSetEditorConfiguration = jest.spyOn(
      WebBridgeImpl.prototype,
      'setEditorConfiguration',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have default config created if config is not passed', () => {
    const { result } = renderHook(() => useEditorConfiguration(bridge));
    expect(result.current).toEqual(initialConfig);
  });

  it('should call setEditorConfigChangeHandler', () => {
    renderHook(() => useEditorConfiguration(bridge, initialConfig));
    expect(mockedSetEditorConfigChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('should call setEditorConfiguration with the passed config', () => {
    renderHook(() => useEditorConfiguration(bridge, initialConfig));
    expect(mockedSetEditorConfiguration).toHaveBeenCalledTimes(1);
    expect(mockedSetEditorConfiguration).toHaveBeenCalledWith(initialConfig);
  });

  it('should return valid editor configuration', () => {
    const { result } = renderHook(() =>
      useEditorConfiguration(bridge, initialConfig),
    );
    expect(result.current).toEqual(initialConfig);
  });
});
