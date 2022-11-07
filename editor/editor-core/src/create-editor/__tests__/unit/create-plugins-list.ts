jest.mock('../../../plugins');
jest.mock('../../../plugins/hyperlink');
jest.mock('../../../plugins/placeholder');
jest.mock('../../../plugins/selection');
jest.mock('../../../plugins/code-block');
jest.mock('@atlaskit/editor-plugin-table');
import { tablesPlugin } from '@atlaskit/editor-plugin-table';

import {
  analyticsPlugin,
  mediaPlugin,
  helpDialogPlugin,
  fakeTextCursorPlugin,
  submitEditorPlugin,
  insertBlockPlugin,
  feedbackDialogPlugin,
  placeholderTextPlugin,
  layoutPlugin,
  cardPlugin,
  statusPlugin,
  historyPlugin,
  scrollIntoViewPlugin,
  mobileDimensionsPlugin,
  findReplacePlugin,
  contextPanelPlugin,
  quickInsertPlugin,
} from '../../../plugins';

import hyperlinkPlugin from '../../../plugins/hyperlink';
import placeholderPlugin from '../../../plugins/placeholder';
import selectionPlugin from '../../../plugins/selection';
import codeBlockPlugin from '../../../plugins/code-block';

import createPluginsList, {
  getScrollGutterOptions,
} from '../../create-plugins-list';

describe('createPluginsList', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add helpDialogPlugin if allowHelpDialog is true', () => {
    const plugins = createPluginsList({ allowHelpDialog: true });
    expect(plugins).toContain(helpDialogPlugin());
  });

  it('should add fakeTextCursorPlugin by default', () => {
    const plugins = createPluginsList({});
    expect(plugins).toContain(fakeTextCursorPlugin());
  });

  it('should add tablePlugin if allowTables is true', () => {
    const tableOptions = { allowTables: true };
    createPluginsList(tableOptions);
    expect(tablesPlugin).toHaveBeenCalledTimes(1);
  });

  it('should always add submitEditorPlugin to the editor', () => {
    const plugins = createPluginsList({});
    expect(plugins).toContain(submitEditorPlugin());
  });

  it('should always add quickInsert', () => {
    const plugins = createPluginsList({});
    expect(plugins).toContain(quickInsertPlugin());
  });

  it('should add quickInsertPlugin with special options when appearance === "mobile"', () => {
    const plugins = createPluginsList({ appearance: 'mobile' });
    expect(plugins).toContain(
      quickInsertPlugin({
        disableDefaultItems: true,
        headless: true,
      }),
    );
  });

  it('should add selectionPlugin with useLongPressSelection disable when appearance === "mobile"', () => {
    createPluginsList({ appearance: 'mobile' });

    expect(selectionPlugin).toHaveBeenCalledWith({
      useLongPressSelection: false,
    });
  });

  it('should add mediaPlugin if media prop is provided', () => {
    const media = {
      provider: Promise.resolve() as any,
      allowMediaSingle: true,
    };
    createPluginsList({ media });
    expect(mediaPlugin).toHaveBeenCalledTimes(1);
  });

  it('should add placeholderText plugin if allowTemplatePlaceholders prop is provided', () => {
    (placeholderTextPlugin as any).mockReturnValue('placeholderText');
    const plugins = createPluginsList({ allowTemplatePlaceholders: true });
    expect(plugins).toContain('placeholderText');
  });

  it('should pass empty options to placeholderText plugin if allowTemplatePlaceholders is true', () => {
    createPluginsList({ allowTemplatePlaceholders: true });
    expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
    expect(placeholderTextPlugin).toHaveBeenCalledWith({});
  });

  it('should enable allowInserting for placeholderText plugin if options.allowInserting is true', () => {
    createPluginsList({ allowTemplatePlaceholders: { allowInserting: true } });
    expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
    expect(placeholderTextPlugin).toHaveBeenCalledWith({
      allowInserting: true,
    });
  });

  it('should add layoutPlugin if allowLayout prop is provided', () => {
    const plugins = createPluginsList({ allowLayouts: true });
    expect(plugins).toContain(layoutPlugin());
  });

  it('should initialise hyperlink with `linking.smartLinks` if provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      linking: { smartLinks, linkPicker: { plugins: linkPickerPlugins } },
    });

    expect(hyperlinkPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        cardOptions: {
          allowEmbeds: true,
        },
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should initialise hyperlink, falling back to `smartLinks` prop if `linking.smartLinks` is not provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      smartLinks,
      linking: { linkPicker: { plugins: linkPickerPlugins } },
    });

    expect(hyperlinkPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        cardOptions: {
          allowEmbeds: true,
        },
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should initialise hyperlink, preferring `linking.smartLinks` over `smartLinks` prop if both are provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkingSmartLinks = { allowEmbeds: false };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      smartLinks,
      linking: {
        smartLinks: linkingSmartLinks,
        linkPicker: { plugins: linkPickerPlugins },
      },
    });

    expect(hyperlinkPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        cardOptions: {
          allowEmbeds: false,
        },
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should add cardPlugin if `linking.smartLinks` is provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      linking: { smartLinks, linkPicker: { plugins: linkPickerPlugins } },
    });

    expect(cardPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        allowEmbeds: true,
        platform: 'web',
        fullWidthMode: false,
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should add cardPlugin, falling back to `smartLinks` prop if `linking.smartLinks` is not provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      smartLinks,
      linking: { linkPicker: { plugins: linkPickerPlugins } },
    });

    expect(cardPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        allowEmbeds: true,
        platform: 'web',
        fullWidthMode: false,
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should add cardPlugin, preferring `linking.smartLinks` over `smartLinks` prop if both are provided', () => {
    const smartLinks = { allowEmbeds: true };
    const linkingSmartLinks = { allowEmbeds: false };
    const linkPickerPlugins: Array<never> = [];

    createPluginsList({
      smartLinks,
      linking: {
        smartLinks: linkingSmartLinks,
        linkPicker: { plugins: linkPickerPlugins },
      },
    });

    expect(cardPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        allowEmbeds: false,
        platform: 'web',
        fullWidthMode: false,
        linkPicker: {
          plugins: linkPickerPlugins,
        },
      }),
    );
  });

  it('should not add statusPlugin if allowStatus prop is false', () => {
    createPluginsList({ allowStatus: false });
    expect(statusPlugin).not.toBeCalled();
    expect(insertBlockPlugin).toBeCalledWith(
      expect.objectContaining({ nativeStatusSupported: false }),
    );
  });

  it('should add statusPlugin if allowStatus prop is true', () => {
    createPluginsList({ allowStatus: true });
    expect(statusPlugin).toHaveBeenCalledTimes(1);
    expect(statusPlugin).toHaveBeenCalledWith({
      menuDisabled: false,
      allowZeroWidthSpaceAfter: true,
    });
    expect(insertBlockPlugin).toBeCalledWith(
      expect.objectContaining({ nativeStatusSupported: true }),
    );
  });

  it('should add statusPlugin if allowStatus prop is provided with menuDisabled true', () => {
    createPluginsList({ allowStatus: { menuDisabled: true } });
    expect(statusPlugin).toHaveBeenCalledTimes(1);
    expect(statusPlugin).toHaveBeenCalledWith({
      menuDisabled: true,
      allowZeroWidthSpaceAfter: true,
    });
    expect(insertBlockPlugin).toBeCalledWith(
      expect.objectContaining({ nativeStatusSupported: false }),
    );
  });

  it('should add statusPlugin if allowStatus prop is provided with menuDisabled false', () => {
    createPluginsList({ allowStatus: { menuDisabled: false } });
    expect(statusPlugin).toHaveBeenCalledTimes(1);
    expect(statusPlugin).toHaveBeenCalledWith({
      menuDisabled: false,
      allowZeroWidthSpaceAfter: true,
    });
    expect(insertBlockPlugin).toBeCalledWith(
      expect.objectContaining({ nativeStatusSupported: true }),
    );
  });

  it('should add analyticsPlugin if allowAnalyticsGASV3 prop is provided', () => {
    const createAnalyticsEvent = jest.fn();
    createPluginsList(
      { allowAnalyticsGASV3: true },
      undefined,
      createAnalyticsEvent,
    );
    expect(analyticsPlugin).toHaveBeenCalledTimes(1);
    expect(analyticsPlugin).toHaveBeenCalledWith({
      createAnalyticsEvent,
      performanceTracking: undefined,
    });
  });

  it('should no add analyticsPlugin if allowAnalyticsGASV3 prop is false', () => {
    const createAnalyticsEvent = jest.fn();
    createPluginsList(
      { allowAnalyticsGASV3: false },
      undefined,
      createAnalyticsEvent,
    );
    expect(analyticsPlugin).not.toHaveBeenCalled();
  });

  it('should add feedbackDialogPlugin if feedbackInfo is provided for editor props', () => {
    const feedbackInfo = {
      product: 'bitbucket',
      packageName: 'editor',
      packageVersion: '1.1.1',
    };
    createPluginsList({ feedbackInfo });
    expect(feedbackDialogPlugin).toBeCalledWith(feedbackInfo);
  });

  it('should always add insertBlockPlugin to the editor with insertMenuItems', () => {
    const customItems = [
      {
        content: 'a',
        value: { name: 'a' },
        tooltipDescription: 'item a',
        tooltipPosition: 'right',
        onClick: () => {},
      },
      {
        content: 'b',
        value: { name: 'b' },
        tooltipDescription: 'item b',
        tooltipPosition: 'right',
        onClick: () => {},
      },
    ];

    const props = {
      allowTables: true,
      insertMenuItems: customItems,
      nativeStatusSupported: false,
      replacePlusMenuWithElementBrowser: false,
      showElementBrowserLink: false,
    };

    createPluginsList(props);
    expect(insertBlockPlugin).toHaveBeenCalledTimes(1);
    expect(insertBlockPlugin).toHaveBeenCalledWith(props);
  });

  it('should add historyPlugin to mobile editor', () => {
    createPluginsList({ appearance: 'mobile' });
    expect(historyPlugin).toHaveBeenCalled();
  });

  it('should not add historyPlugin to non-mobile editor', () => {
    createPluginsList({ appearance: 'full-page' });
    expect(historyPlugin).not.toHaveBeenCalled();
  });

  describe('mobileDimensionsPlugin', () => {
    it('should add mobileDimensionsPlugin to mobile editor', () => {
      createPluginsList({ appearance: 'mobile' });
      expect(mobileDimensionsPlugin).toHaveBeenCalled();
    });

    it('should not add mobileDimensionsPlugin to non-mobile editor', () => {
      createPluginsList({ appearance: 'full-page' });
      expect(mobileDimensionsPlugin).not.toHaveBeenCalled();
    });
  });

  it('should add contextPanelPlugin by default', () => {
    createPluginsList({ appearance: 'full-page' });
    expect(contextPanelPlugin).toHaveBeenCalled();
  });

  describe('scrollIntoViewPlugin', () => {
    it('should add plugin by default', () => {
      createPluginsList({ appearance: 'full-page' });
      expect(scrollIntoViewPlugin).toHaveBeenCalled();
    });

    it('should not add plugin if props.autoScrollIntoView === false', () => {
      createPluginsList({ appearance: 'full-page', autoScrollIntoView: false });
      expect(scrollIntoViewPlugin).not.toHaveBeenCalled();
    });
  });

  describe('placeholderPlugin', () => {
    it('should pass placeholder text from editor props', function () {
      const defaultPlaceholder = 'Hello World!';
      createPluginsList({ placeholder: defaultPlaceholder });

      expect(placeholderPlugin).toHaveBeenCalledWith({
        placeholder: defaultPlaceholder,
      });
    });

    it('should pass placeholder hints from editor props', function () {
      const placeholderHints = ['Hello World!'];
      createPluginsList({ placeholderHints });

      expect(placeholderPlugin).toHaveBeenCalledWith({
        placeholderHints,
      });
    });
  });

  describe('findReplacePlugin', () => {
    it('should not add plugin by default', () => {
      createPluginsList({ appearance: 'full-page' });
      expect(findReplacePlugin).not.toHaveBeenCalled();
    });

    it('should add plugin if props.allowFindReplace === true', () => {
      createPluginsList({ appearance: 'full-page', allowFindReplace: true });
      expect(findReplacePlugin).toHaveBeenCalled();
    });
  });

  describe('getScrollGutterOptions', () => {
    it('should return ScrollGutterPluginOptions with persistScrollGutter as true', () => {
      const scrollGutterOptions = getScrollGutterOptions({
        appearance: 'mobile',
        persistScrollGutter: true,
      });

      expect(scrollGutterOptions?.persistScrollGutter).toBe(true);
    });

    it('should return ScrollGutterPluginOptions with gutterSize as 36', () => {
      const scrollGutterOptions = getScrollGutterOptions({
        appearance: 'mobile',
      });

      expect(scrollGutterOptions?.gutterSize).toBe(36);
    });
  });

  describe('codeblock', () => {
    it('should pass allowCompositionInputOverride when mobile editor', () => {
      createPluginsList({ appearance: 'mobile' });
      expect(codeBlockPlugin).toHaveBeenCalledWith({
        allowCompositionInputOverride: true,
        appearance: 'mobile',
        useLongPressSelection: false,
      });
    });

    it('should not pass allowCompositionInputOverride when not mobile editor', () => {
      createPluginsList({ appearance: 'full-page' });
      expect(codeBlockPlugin).toHaveBeenCalledWith({
        allowCompositionInputOverride: false,
        appearance: 'full-page',
        useLongPressSelection: false,
      });
    });
  });
});
