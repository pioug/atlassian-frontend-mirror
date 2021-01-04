import RendererConfiguration from '../../../renderer-configuration';
import getBridge from '../../bridge-initialiser';
import RendererBridgeImplementation from '../../implementation';

describe('initialise bridge', () => {
  beforeEach(() => {
    delete window.rendererBridge;
  });

  it('Should create a bridge and return', () => {
    const bridge = getBridge();
    expect(bridge).toBeInstanceOf(RendererBridgeImplementation);
  });

  it('should expose bridge on window', () => {
    const bridge = getBridge();
    expect(window.rendererBridge).toBe(bridge);
  });

  it('should not initialise if the renderer bridge is already present', () => {
    const bridge1 = getBridge();
    const bridge2 = getBridge();

    expect(bridge1).toBe(bridge2);
  });

  it('should initialise the bridge with the given config', () => {
    const config = new RendererConfiguration('{}');
    const bridge = getBridge(config);

    expect(bridge.getConfiguration()).toBe(config);
  });
});
