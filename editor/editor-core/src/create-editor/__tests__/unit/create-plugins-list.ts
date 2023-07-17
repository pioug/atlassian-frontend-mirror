jest.mock('../../../plugins');
jest.mock('@atlaskit/editor-plugin-hyperlink');
jest.mock('../../../plugins/placeholder');
jest.mock('../../../plugins/selection');
jest.mock('../../../plugins/code-block');
jest.mock('../../../plugins/fake-text-cursor');
jest.mock('../../../plugins/submit-editor');
jest.mock('../../../plugins/quick-insert');
jest.mock('@atlaskit/editor-plugin-card');
jest.mock('@atlaskit/editor-plugin-table');
jest.mock('@atlaskit/editor-plugin-context-panel');

import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';

import {
  analyticsPlugin,
  mediaPlugin,
  insertBlockPlugin,
  feedbackDialogPlugin,
  placeholderTextPlugin,
  layoutPlugin,
  statusPlugin,
  historyPlugin,
  scrollIntoViewPlugin,
  mobileDimensionsPlugin,
  findReplacePlugin,
  helpDialogPlugin,
} from '../../../plugins';

import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import placeholderPlugin from '../../../plugins/placeholder';
import selectionPlugin from '../../../plugins/selection';
import codeBlockPlugin from '../../../plugins/code-block';
import fakeTextCursorPlugin from '../../../plugins/fake-text-cursor';
import submitEditorPlugin from '../../../plugins/submit-editor';
import quickInsertPlugin from '../../../plugins/quick-insert';

import createPluginsList, {
  getScrollGutterOptions,
} from '../../create-plugins-list';

import { EditorProps } from '../../../types';

describe('createPluginsList', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add helpDialogPlugin if allowHelpDialog is true', () => {
    createPluginsList({ allowHelpDialog: true });
    expect(helpDialogPlugin).toHaveBeenCalledWith(false);
  });

  it('should add fakeTextCursorPlugin by default', () => {
    createPluginsList({});
    expect(fakeTextCursorPlugin).toHaveBeenCalled();
  });

  it('should add tablePlugin if allowTables is true', () => {
    const tableOptions = { allowTables: true };
    createPluginsList(tableOptions);
    expect(tablesPlugin).toHaveBeenCalledTimes(1);
    expect(tablesPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        fullWidthEnabled: false,
        wasFullWidthEnabled: undefined,
      }),
    );
  });

  it('should add tablePlugin if allowTables is true where previous appearance was full-width', () => {
    const tableOptions = { allowTables: true };
    const prevProps: EditorProps = { appearance: 'full-width' };
    createPluginsList(tableOptions, prevProps);
    expect(tablesPlugin).toHaveBeenCalledTimes(1);
    expect(tablesPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        fullWidthEnabled: false,
        wasFullWidthEnabled: true,
      }),
    );
  });

  it('should add tablePlugin if allowTables is true where previous appearance was mobile', () => {
    const tableOptions = { allowTables: true };
    const prevProps: EditorProps = { appearance: 'mobile' };
    createPluginsList(tableOptions, prevProps);
    expect(tablesPlugin).toHaveBeenCalledTimes(1);
    expect(tablesPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        fullWidthEnabled: false,
        wasFullWidthEnabled: false,
      }),
    );
  });

  it('should always add submitEditorPlugin to the editor', () => {
    createPluginsList({});
    expect(submitEditorPlugin).toHaveBeenCalled();
  });

  it('should always add quickInsert', () => {
    createPluginsList({});
    expect(quickInsertPlugin).toHaveBeenCalled();
  });

  it('should add quickInsertPlugin with special options when appearance === "mobile"', () => {
    createPluginsList({ appearance: 'mobile' });
    expect(quickInsertPlugin).toHaveBeenCalledWith({
      disableDefaultItems: true,
      headless: true,
    });
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
    createPluginsList({ allowTemplatePlaceholders: true });
    expect(placeholderTextPlugin).toHaveBeenCalled();
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
    createPluginsList({ allowLayouts: true });
    expect(layoutPlugin).toHaveBeenCalled();
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
    createPluginsList({ allowAnalyticsGASV3: true }, undefined);
    expect(analyticsPlugin).toHaveBeenCalledTimes(1);
    expect(analyticsPlugin).toHaveBeenCalledWith({
      performanceTracking: undefined,
    });
  });

  it('should no add analyticsPlugin if allowAnalyticsGASV3 prop is false', () => {
    createPluginsList({ allowAnalyticsGASV3: false }, undefined);
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
