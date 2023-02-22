import createPluginsList from '../../create-plugins-list';
import { expandPlugin } from '../../../plugins';
import * as expand from '../../../plugins/expand';

describe('create-plugins-list without mock tests', () => {
  it('should have the default create-plugins-list plugins available for full-page', () => {
    // NOTE: This test is to ensure there aren't unsuspecting changes in the default plugins
    // However if you add a plugin, update the list here.
    const plugins = createPluginsList({ appearance: 'full-page' });

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
    ];
    expect(plugins).toEqual(
      expect.arrayContaining(
        defaultPluginNames.map((name) => expect.objectContaining({ name })),
      ),
    );
    expect(plugins.length).toEqual(defaultPluginNames.length);
  });

  describe('codeBlock', () => {
    it('should have code block plugin by default', () => {
      const plugins = createPluginsList({
        appearance: 'full-page',
      });
      expect(plugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'codeBlock' }),
        ]),
      );
    });

    it('should not have the code block plugin if it is excluded', () => {
      const plugins = createPluginsList({
        appearance: 'full-page',
        allowBlockType: { exclude: ['codeBlock'] },
      });
      expect(plugins).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'codeBlock' }),
        ]),
      );
    });
  });

  describe('expand', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should pass allowCompositionInputOverride when mobile editor', () => {
      jest.spyOn(expand, 'default');
      createPluginsList({
        appearance: 'full-page',
        allowExpand: { allowInsertion: true },
      });
      expect(expandPlugin).toHaveBeenCalledWith({
        allowInsertion: true,
        useLongPressSelection: false,
        appearance: 'full-page',
      });
    });

    it('should pass allowCompositionInputOverride when mobile editor', () => {
      jest.spyOn(expand, 'default');
      createPluginsList({
        appearance: 'full-page',
      });
      expect(expandPlugin).toHaveBeenCalledTimes(0);
    });
  });
});
