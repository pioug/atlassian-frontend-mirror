import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { Browser } from '@atlaskit/webdriver-runner/runner';
import RendererBridgeImpl from '../../../renderer/native-to-web/implementation';
import WebBridgeImpl from '../../../editor/native-to-web';

// FIXME Ideally these would be mobile browsers
// Safari & Chrome should suffice for now.
export const skipBrowsers: Browser[] = ['firefox', 'edge'];

export const navigateOrClear = async (browser: any, path: string) => {
  await browser.goto(path);
};

export const getDocFromElement = (el: any) => el.pmViewDesc.node.toJSON();
export const editable = '.ProseMirror';

export const editor = {
  name: 'editor',
  path: getExampleUrl('editor', 'editor-mobile-bridge', 'editor'),
  placeholder: editable,
};

export const renderer = {
  name: 'renderer',
  path: getExampleUrl('editor', 'editor-mobile-bridge', 'renderer'),
  placeholder: '#examples', // FIXME lets add something better to renderer
};

export const clipboardHelper = {
  name: 'editor-with-copy-paste',
  path: getExampleUrl(
    'editor',
    'editor-mobile-bridge',
    'editor-with-copy-paste',
  ),
  placeholder: editable,
};

export const selectionPluginHelper = {
  name: 'editor-with-selection-plugin',
  path: getExampleUrl('editor', 'editor-mobile-bridge', 'editor', undefined, {
    selectionObserverEnabled: true,
  }),
};

export const clipboardInput = 'textarea[data-id=clipboardInput]';
export const copyButton = 'button[aria-label="copy"]';

type WebBridgeMethods = keyof typeof WebBridgeImpl['prototype'];

export const callNativeBridge = async (
  browser: any,
  bridgeFn: WebBridgeMethods,
  ...args: any[]
) => {
  return await browser.execute(
    (bridgeFn: WebBridgeMethods, args: any[]) => {
      if (window.bridge && window.bridge[bridgeFn]) {
        (window.bridge[bridgeFn] as any).apply(window.bridge, args);
      }
    },
    bridgeFn,
    args || [],
  );
};

type RenderBridgeMethods = keyof typeof RendererBridgeImpl['prototype'];

export const callRendererBridge = async (
  browser: any,
  bridgeFn: RenderBridgeMethods,
  ...args: any[]
) => {
  return await browser.execute(
    (bridgeFn: RenderBridgeMethods, args: any[]) => {
      let bridge = window.rendererBridge || ({} as RendererBridgeImpl);
      if (bridgeFn in bridge) {
        return (bridge as any)[bridgeFn].apply(bridge, args);
      }
    },
    bridgeFn,
    args || [],
  );
};

export const clearBridgeOutput = async (browser: any) => {
  await browser.execute(() => {
    window.logBridge = [];
  });
};

export const getBridgeOutput = async (
  browser: any,
  bridge: string,
  bridgeFn: string,
) => {
  const logs = await browser.execute(
    (bridge: string, bridgeFn: string) => {
      let logs = window.logBridge;

      if (logs[`${bridge}:${bridgeFn}`]) {
        return logs[`${bridge}:${bridgeFn}`];
      }

      return logs;
    },
    bridge,
    bridgeFn,
  );
  return logs;
};

export const clearEditor = async (browser: any) => {
  await browser.execute(() => {
    const dom = document.querySelector('.ProseMirror') as HTMLElement;
    dom.innerHTML = '<p><br /></p>';
  });
};

export const getDummyBridgeCalls = (browser: any, name: string) => {
  return browser.execute((name: string) => {
    // @ts-ignore
    const callsFromDummy = window.callsFromDummyBridge;
    return callsFromDummy.get(name);
  }, name);
};

export async function configureEditor(page: any, config: string) {
  return page.execute(
    (_config: any, _bridgeKey: any) => {
      (window as any)[_bridgeKey].configure(_config);
    },
    config,
    'bridge',
  );
}

export async function setContent(
  page: any,
  docObject: Record<string, unknown>,
) {
  const doc = JSON.stringify(docObject);
  return page.execute(
    (_doc: any, _bridgeKey: any) => {
      (window as any)[_bridgeKey].setContent(_doc);
    },
    doc,
    'bridge',
  );
}

export const ENABLE_QUICK_INSERT = '{"enableQuickInsert":true}';
export const USE_UNPREDICTABLE_INPUT_RULE =
  '{"useUnpredictableInputRule":true}';
export const USE_PREDICTABLE_INPUT_RULE = '{"useUnpredictableInputRule":false}';
