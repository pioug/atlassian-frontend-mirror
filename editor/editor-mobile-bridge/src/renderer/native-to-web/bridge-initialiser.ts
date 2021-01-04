import RendererConfiguration from '../renderer-configuration';
import RendererBridgeImplementation from './implementation';

const getBridge = (
  config?: RendererConfiguration,
): RendererBridgeImplementation => {
  if (!window.rendererBridge) {
    const bridge = new RendererBridgeImplementation(config);
    window.rendererBridge = bridge;
    return bridge;
  }
  return window.rendererBridge;
};

export default getBridge;
