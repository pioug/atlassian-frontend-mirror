import {
  getExampleUrl,
  disableAllSideEffects,
  navigateToUrl,
  compareScreenshot,
  SideEffectOptions,
  CustomSnapshotIdentifier,
} from '@atlaskit/visual-regression/helper';
import { EditorProps } from '../../types';
import { Page as PuppeteerPage, JSONObject } from 'puppeteer';
import { animationFrame } from '../__helpers/page-objects/_editor';
import { GUTTER_SELECTOR } from '../../plugins/base/pm-plugins/scroll-gutter';
import { CreateCollabProviderOptions } from '@atlaskit/synchrony-test-helpers';
import { Page } from '../__helpers/page-objects/_types';

export {
  setupMediaMocksProviders,
  editable,
  changeSelectedNodeLayout,
  rerenderEditor,
  setFeature,
  toggleFeature,
} from '../integration/_helpers';

export const editorSelector = '.akEditor';
export const editorFullPageContentSelector =
  '.fabric-editor-popup-scroll-parent';
export const editorCommentContentSelector = '.ak-editor-content-area';
export const pmSelector = '.ProseMirror';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 600;

export const dynamicTextViewportSizes = [
  { width: 1440, height: 4000 },
  { width: 1280, height: 4000 },
  { width: 768, height: 4000 },
  { width: 1024, height: 4000 },
];

export enum Device {
  Default = 'Default',
  LaptopHiDPI = 'LaptopHiDPI',
  LaptopMDPI = 'LaptopMDPI',
  iPadPro = 'iPadPro',
  iPad = 'iPad',
  iPhonePlus = 'iPhonePlus',
}

export const deviceViewPorts = {
  [Device.Default]: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
  [Device.LaptopHiDPI]: { width: 1440, height: 900 },
  [Device.LaptopMDPI]: { width: 1280, height: 800 },
  [Device.iPadPro]: { width: 1024, height: 1366 },
  [Device.iPad]: { width: 768, height: 1024 },
  [Device.iPhonePlus]: { width: 414, height: 736 },
};

/**
 * Sometimes it's useful to visualise whitespace, invisible elements, or bounding boxes
 * to track layout changes and capture regressions in CI.
 *
 * Green is used to ensure it doesn't clash with the red and yellow used by jest-image-snapshot.
 */
const WHITESPACE_DEBUGGING_FILL_COLOR = '#0c0';

async function visualiseInvisibleElements(page: PuppeteerPage) {
  await page.addStyleTag({
    content: `
      /*
        Visualise the invisible scroll gutter (padding at bottom of full page editor).
        This allows us to see whether the element exists within a snapshot, and compare the scroll offset.
      */
      ${GUTTER_SELECTOR} { background: ${WHITESPACE_DEBUGGING_FILL_COLOR}; }
    `,
  });
}

async function attachCursorIndicator(page: PuppeteerPage) {
  await page.evaluate(() => {
    const cursorDiameter = 20;
    const cursorElementId = 'cursor-indicator';
    const mouseIndicatorId = 'mouse-indicator';
    const cursorDefaultColour = 'rgb(0, 0, 0, 0.4)';

    const cursorPreviousIndicator = document.getElementById(cursorElementId);
    if (cursorPreviousIndicator) {
      document.body.removeChild(cursorPreviousIndicator);
    }

    const cursorIndicator = document.createElement('div');
    cursorIndicator.setAttribute('id', cursorElementId);
    cursorIndicator.setAttribute(
      'style',
      `position: absolute;
      width: ${cursorDiameter}px;
      height: ${cursorDiameter}px;
      top: 0px; left: 0px;
      background: ${cursorDefaultColour};
      border-radius: 50%;
      display: none;
      pointer-events: none;
      z-index: 9000;`,
    );
    document.body.appendChild(cursorIndicator);

    const mouseIndicator = document.createElement('div');
    mouseIndicator.setAttribute('id', mouseIndicatorId);
    mouseIndicator.setAttribute(
      'style',
      `position: relative;
      width: ${cursorDiameter / 2}px;
      height: ${cursorDiameter / 2}px;
      top: 0px; left: 0px;
      background: ${cursorDefaultColour};
      border-radius: 50%;
      display: none;
      pointer-events: none;
      z-index: 9000;`,
    );
    cursorIndicator.appendChild(mouseIndicator);

    window.addEventListener('mousemove', event => {
      cursorIndicator.style.display = 'block';
      cursorIndicator.style.top = `${event.clientY - cursorDiameter / 2}px`;
      cursorIndicator.style.left = `${event.clientX - cursorDiameter / 2}px`;
    });

    window.addEventListener('mousedown', event => {
      mouseIndicator.style.display = 'block';
      switch (event.button) {
        case 0:
          mouseIndicator.style.top = `${-cursorDiameter / 4}px`;
          mouseIndicator.style.left = `${-cursorDiameter / 4}px`;
          break;
        default:
          mouseIndicator.style.top = `${-cursorDiameter / 4}px`;
          mouseIndicator.style.left = `${-cursorDiameter / 4 +
            cursorDiameter}px`;
      }
    });

    window.addEventListener('mouseup', event => {
      mouseIndicator.style.display = 'none';
    });
  });
}

function getEditorProps(appearance: Appearance) {
  const enableAllEditorProps = {
    allowPanel: true,
    allowTextColor: true,
    allowTextAlignment: true,
    quickInsert: true,
    allowTables: {
      advanced: true,
    },
    allowBreakout: true,
    allowJiraIssue: true,
    allowUnsupportedContent: true,
    allowExtension: {
      allowBreakout: true,
    },
    allowRule: true,
    allowDate: true,
    allowLayouts: {
      allowBreakout: true,
    },
    allowIndentation: true,
    allowTemplatePlaceholders: { allowInserting: true },
    allowStatus: true,
    media: true, // add true here since the testing example would handle providers
    placeholder:
      'Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.',
    shouldFocus: false,
    UNSAFE_cards: true,
    allowExpand: { allowInsertion: true },
    allowHelpDialog: true,
  };

  if (
    appearance === Appearance.fullPage ||
    appearance === Appearance.fullWidth
  ) {
    return {
      ...enableAllEditorProps,
      primaryToolbarComponents: true,
      contentComponents: true,
      media: {
        allowMediaSingle: true,
        allowResizing: true,
        allowMediaGroup: true,
      },
    };
  }

  if (appearance === Appearance.comment) {
    return {
      ...enableAllEditorProps,
      media: {
        allowMediaSingle: false,
        allowMediaGroup: true,
      },
    };
  }

  return enableAllEditorProps;
}

export type MountOptions = {
  mode?: 'light' | 'dark';
  withSidebar?: boolean;
  collab?: CreateCollabProviderOptions;
  i18n?: {
    locale: string;
  };
  withContextPanel?: boolean;
  invalidAltTextValues?: string[];
  withCollab?: boolean;
};

export async function mountEditor(
  page: PuppeteerPage,
  props: any,
  mountOptions: MountOptions = {},
) {
  await page.evaluate(
    (props: EditorProps, mountOptions: MountOptions) => {
      return new Promise<void>(resolve => {
        function waitAndCall() {
          if ((window as any).__mountEditor) {
            (window as any).__mountEditor(props, mountOptions);
            resolve();
          } else {
            // There is no need to implement own timeout, if done() is not called on time,
            // webdriver will throw with own timeout.
            setTimeout(waitAndCall, 20);
          }
        }
        waitAndCall();
      });
    },
    props,
    mountOptions as JSONObject,
  );
  await page.waitForSelector(pmSelector);
}

export enum Appearance {
  fullWidth = 'full-width',
  fullPage = 'full-page',
  comment = 'comment',
  mobile = 'mobile',
}

type InitEditorWithADFOptions = {
  appearance: Appearance;
  adf?: Object;
  device?: Device;
  viewport?: { width: number; height: number };
  editorProps?: EditorProps;
  mode?: 'light' | 'dark';
  allowSideEffects?: SideEffectOptions;
  withSidebar?: boolean;
  withCollab?: boolean;
  withContextPanel?: boolean;
  forceReload?: boolean;
  invalidAltTextValues?: string[];
};

async function setupEditor(
  page: PuppeteerPage,
  options: Omit<InitEditorWithADFOptions, 'withSidebar' | 'mode'>,
  mountOptions: MountOptions,
) {
  const {
    appearance,
    adf = {},
    device = Device.Default,
    viewport,
    editorProps = {},
    allowSideEffects = {},
    withContextPanel,
    forceReload,
  } = options;

  const {
    mode,
    withSidebar = false,
    invalidAltTextValues,
    withCollab,
  } = mountOptions;
  await page.bringToFront();
  const url = getExampleUrl('editor', 'editor-core', 'vr-testing');

  // Chrome adjusts screen/CSS viewport but not layout viewport with setViewport.
  // Try this if you're adjusting screen resolution in your test and snapshots look odd.
  await navigateToUrl(page, forceReload ? `${url}&rand=${Math.random()}` : url);

  // Set the viewport to the right one
  if (viewport) {
    await page.setViewport(viewport);
  } else {
    await page.setViewport(deviceViewPorts[device]);
  }

  // Mount the editor with the right attributes
  await mountEditor(
    page,
    {
      appearance: appearance,
      defaultValue: JSON.stringify(adf),
      ...getEditorProps(appearance),
      ...editorProps,
    },
    { mode, withSidebar, withContextPanel, invalidAltTextValues, withCollab },
  );

  // We disable possible side effects, like animation, transitions and caret cursor,
  // because we cannot control and affect snapshots
  // You can override this disabling if you are sure that you need it in your test
  await disableAllSideEffects(page, allowSideEffects);

  // Visualise invisible elements
  await visualiseInvisibleElements(page);

  // Attach the indicator for the cursor
  await attachCursorIndicator(page);
}

export const initEditorWithAdf = async (
  page: PuppeteerPage,
  options: InitEditorWithADFOptions,
) => {
  const mountOptions: MountOptions = {
    mode: options.mode,
    withSidebar: options.withSidebar,
    invalidAltTextValues: options.invalidAltTextValues,
    withCollab: options.withCollab,
  };

  await setupEditor(page, options, mountOptions);
};

export const initFullPageEditorWithAdf = async (
  page: PuppeteerPage,
  adf: Object,
  device?: Device,
  viewport?: { width: number; height: number },
  editorProps?: EditorProps,
  mode?: 'light' | 'dark',
  allowSideEffects?: SideEffectOptions,
  forceReload?: boolean,
  withCollab?: boolean,
) => {
  await initEditorWithAdf(page, {
    adf,
    appearance: Appearance.fullPage,
    device,
    viewport,
    editorProps,
    mode,
    allowSideEffects,
    forceReload,
    withCollab,
  });
};

export const initCommentEditorWithAdf = async (
  page: PuppeteerPage,
  adf: Object,
  device?: Device,
) => {
  await initEditorWithAdf(page, {
    adf,
    appearance: Appearance.comment,
    device,
  });
};

/**
 * Updates props of current mounted Editor component
 * Pass in only the new props you wish to apply on top of the current ones
 */
export const updateEditorProps = async (
  page: PuppeteerPage,
  newProps: Partial<EditorProps>,
) => {
  await page.evaluate((props: EditorProps) => {
    (window as any).__updateEditorProps(props);
  }, newProps as any);
};

export const clearEditor = async (page: PuppeteerPage) => {
  await page.evaluate(() => {
    const dom = document.querySelector(pmSelector) as HTMLElement;
    dom.innerHTML = '<p><br /></p>';
  });
};

interface Threshold {
  tolerance?: number;
  useUnsafeThreshold?: boolean;
}

async function takeSnapshot(
  page: PuppeteerPage,
  threshold: Threshold = {},
  selector: string = editorFullPageContentSelector,
  customSnapshotIdentifier?: CustomSnapshotIdentifier,
) {
  const { tolerance, useUnsafeThreshold } = threshold;
  const editor = await page.$(selector);

  // Wait for a frame because we are using RAF to throttle floating toolbar render
  animationFrame(page);

  // Try to take a screenshot of only the editor.
  // Otherwise take the whole page.
  let image;
  if (editor) {
    image = await editor.screenshot();
  } else {
    image = await page.screenshot();
  }

  return compareScreenshot(image, tolerance, {
    useUnsafeThreshold,
    customSnapshotIdentifier,
  });
}

export const snapshot = async (
  page: PuppeteerPage,
  threshold: Threshold = {},
  selector: string = editorFullPageContentSelector,
) => {
  const { collabPage, synchronyUrl } = global || {};
  if (synchronyUrl && collabPage) {
    await (collabPage as PuppeteerPage).bringToFront();
    await takeSnapshot(
      collabPage,
      threshold,
      selector,
      (_t, _n, _c, defaultIdentifier) => `Collab Page - ${defaultIdentifier}`,
    );
    await page.bringToFront();
  }
  await takeSnapshot(page, threshold, selector);
};

export const applyRemoteStep = async (
  page: PuppeteerPage,
  stepsAsString: string[],
) => {
  return await page.evaluate((_stepsAsString: string[]) => {
    (window as any).__applyRemoteSteps(_stepsAsString);
  }, stepsAsString);
};

export const getContentBoundingRectTopLeftCoords = async (
  page: Page,
  elementSelector: string,
) => {
  // page.click clicks in centre of element, so we need to get the bounding rect
  // so we can click the top left corner
  const boundingRectCoords = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    }
  }, elementSelector);

  if (!boundingRectCoords) {
    throw Error(`Unable to find element ${elementSelector} on page`);
  }

  return boundingRectCoords;
};

export const mediaToFullyLoad = async (page: Page) => {
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
};
