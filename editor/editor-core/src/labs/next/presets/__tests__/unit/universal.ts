import createUniversalPreset from '../../universal';

import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import * as table from '@atlaskit/editor-plugin-table';
// jest.mock('@atlaskit/editor-plugin-table');
jest.mock('@atlaskit/editor-plugin-table', () => ({
  __esModule: true,
  ...jest.requireActual('@atlaskit/editor-plugin-table'),
}));

describe('createUniversalPreset', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be default have all the plugins', () => {
    const preset = createUniversalPreset('full-page', { paste: {} }, {});
    const plugins = preset.build();

    // TODO: We need to uncomment the modules here in https://product-fabric.atlassian.net/browse/ED-16575
    // This is because we should allow these modules by default in this ticket for this preset.

    const defaultPluginNames = [
      'paste',
      'clipboard',
      'base',
      'blockType',
      'placeholder',
      'clearMarksOnEmptyDoc',
      'hyperlink',
      'textFormatting',
      'width',
      'quickInsert',
      'typeAhead',
      'unsupportedContent',
      'editorDisabled',
      'submitEditor',
      'fakeTextCursor',
      'floatingToolbar',
      'featureFlagsContext',
      'selection',
      'codeBlock',
      'dataConsumerPlugin',
      'list',
      'contextPanel',
      'scrollIntoView',
      'toolbarListsIndentation',
      'insertBlock',
      'codeBidiWarning',
      // 'table',
      // 'breakout',
      // 'alignment',
      // 'textColor',
      // 'rule',
      // 'expand',
      // 'grid',
      // 'media',
      // 'caption',
      // 'taskDecision',
      // 'feedbackDialog',
      // 'helpDialog',
      // 'confluenceJiraIssue',
      // 'panel',
      // 'extension',
      // 'date',
      // 'layout',
      // 'placeholderText',
      // 'status',
      // 'indentation',
      // 'findReplace',
      // 'fragmentPlugin',
    ];
    expect(plugins).toEqual(
      expect.arrayContaining(
        defaultPluginNames.map((name) => expect.objectContaining({ name })),
      ),
    );
    expect(plugins.length).toBeGreaterThanOrEqual(defaultPluginNames.length);
  });

  describe('table', () => {
    beforeEach(() => {
      jest.mock('@atlaskit/editor-plugin-table');
    });

    it('should add tablePlugin if allowTables is true', () => {
      // TODO: We need to remove the allowTables prop passed here in https://product-fabric.atlassian.net/browse/ED-16575
      // This is because we should be allow tables by default
      jest.spyOn(table, 'tablesPlugin');
      const preset = createUniversalPreset(
        'full-page',
        { paste: {}, allowTables: true },
        {},
      );
      expect(tablesPlugin).toHaveBeenCalledTimes(0);
      preset.build();
      expect(tablesPlugin).toHaveBeenCalledTimes(1);
      expect(tablesPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidthEnabled: false,
          wasFullWidthEnabled: undefined,
        }),
      );
    });

    it('should add tablePlugin if allowTables is true where previous appearance was full-width', () => {
      // TODO: We need to remove the allowTables prop passed here in https://product-fabric.atlassian.net/browse/ED-16575
      // This is because we should be allow tables by default
      jest.spyOn(table, 'tablesPlugin');
      const preset = createUniversalPreset(
        'full-page',
        { paste: {}, allowTables: true },
        {},
        'full-width',
      );
      expect(tablesPlugin).toHaveBeenCalledTimes(0);
      preset.build();
      expect(tablesPlugin).toHaveBeenCalledTimes(1);
      expect(tablesPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidthEnabled: false,
          wasFullWidthEnabled: true,
        }),
      );
    });
  });
});
