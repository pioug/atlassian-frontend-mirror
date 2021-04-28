import { browser } from '@atlaskit/editor-common';
import * as keymaps from '../../../keymaps';

describe('keymaps', () => {
  const keymap = {
    description: 'A keymap',
    windows: 'Ctrl-Shift-Alt-K',
    mac: 'Cmd-Shift-Alt-K',
    common: 'Mod-Shift-Alt-K',
  };

  if (browser.mac) {
    describe('when on a mac', () => {
      describe('tooltip', () => {
        it('returns tooltip', () => {
          expect(keymaps.tooltip(keymap)).toEqual('A keymap (⌘-⇧-⌥-K)');
        });

        it('returns tooltip with unicode arrow', () => {
          const keymap = {
            description: 'A keymap',
            windows: 'Ctrl-Shift-Alt-ArrowUp',
            mac: 'Cmd-Shift-Alt-ArrowUp',
            common: 'Mod-Shift-Alt-ArrowUp',
          };

          expect(keymaps.tooltip(keymap)).toEqual('A keymap s(⌘-⇧-⌥-K)');
        });
      });

      describe('findKeymapByDescription', () => {
        describe('keymap is found', () => {
          it('returns matched keymap', () => {
            expect(keymaps.findKeymapByDescription('Bold')).toEqual(
              keymaps.toggleBold,
            );
          });
        });

        describe('key map is not found', () => {
          it('returns undefined', () => {
            expect(keymaps.findKeymapByDescription('random')).toBe(undefined);
          });
        });
      });

      describe('findShortcutByDescription', () => {
        describe('shortcut is found', () => {
          it('returns matched shortcut', () => {
            expect(keymaps.findShortcutByDescription('Quote')).toEqual(
              'Cmd-Alt-9',
            );
          });
        });

        describe('shortcut is not found', () => {
          it('returns undefined', () => {
            expect(keymaps.findShortcutByDescription('random')).toBe(undefined);
          });
        });
      });
    });
  } else {
    describe('when not on a mac', () => {
      describe('tooltip', () => {
        it('returns tooltip', () => {
          expect(keymaps.tooltip(keymap)).toEqual('Ctrl+Shift+Alt+K');
        });

        it('returns tooltip with unicode arrow', () => {
          const keymap = {
            description: 'A keymap',
            windows: 'Ctrl-Shift-Alt-ArrowUp',
            mac: 'Cmd-Shift-Alt-ArrowUp',
            common: 'Mod-Shift-Alt-ArrowUp',
          };

          expect(keymaps.tooltip(keymap)).toEqual('Ctrl+Shift+Alt+↑');
        });
      });

      describe('findKeymapByDescription', () => {
        describe('keymap is found', () => {
          it('returns matched keymap', () => {
            expect(keymaps.findKeymapByDescription('Bold')).toEqual(
              keymaps.toggleBold,
            );
          });
        });

        describe('key map is not found', () => {
          it('returns undefined', () => {
            expect(keymaps.findKeymapByDescription('random')).toBe(undefined);
          });
        });
      });

      describe('findShortcutByDescription', () => {
        describe('shortcut is found', () => {
          it('returns matched shortcut', () => {
            expect(keymaps.findShortcutByDescription('Redo')).toEqual('Ctrl-y');
          });
        });

        describe('shortcut is not found', () => {
          it('returns undefined', () => {
            expect(keymaps.findShortcutByDescription('random')).toBe(undefined);
          });
        });
      });
    });
  }

  describe('makeKeyMapWithCommon', () => {
    it('replaces Mod with Ctrl for Windows and Cmd for Mac', () => {
      expect(keymaps.makeKeyMapWithCommon('Undo', 'Mod-z')).toEqual({
        common: 'Mod-z',
        description: 'Undo',
        mac: 'Cmd-z',
        windows: 'Ctrl-z',
      });
    });
  });

  describe('makeKeyMap', () => {
    it('replaces Mod with Ctrl for Windows and Cmd for Mac', () => {
      expect(keymaps.makeKeymap('Redo', 'Ctrl-y', 'Mod-Shift-z')).toEqual({
        common: undefined,
        description: 'Redo',
        mac: 'Cmd-Shift-z',
        windows: 'Ctrl-y',
      });
    });
  });
});
