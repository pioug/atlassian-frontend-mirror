import { browser } from '@atlaskit/editor-common/utils';
import {
  tooltip,
  findShortcutByDescription,
  findKeymapByDescription,
  toggleBold,
  makeKeyMapWithCommon,
  makeKeymap,
} from '@atlaskit/editor-common/keymaps';

describe('keymaps', () => {
  [true, false].forEach((isMac) => {
    const os = isMac ? 'mac' : 'windows';

    describe(`when on ${os}`, () => {
      beforeEach(() => {
        browser.mac = isMac;
      });

      describe('tooltip', () => {
        it('returns tooltip', () => {
          const keymap = {
            description: 'A keymap',
            windows: 'Ctrl-Shift-Alt-K',
            mac: 'Cmd-Shift-Alt-K',
            common: 'Mod-Shift-Alt-K',
          };

          if (browser.mac) {
            expect(tooltip(keymap)).toEqual('⌘⇧⌥K');
          } else {
            expect(tooltip(keymap)).toEqual('Ctrl+Shift+Alt+K');
          }
        });

        it('returns tooltip with unicode arrow', () => {
          const keymap = {
            description: 'A keymap',
            windows: 'Ctrl-Shift-Alt-ArrowUp',
            mac: 'Cmd-Shift-Alt-ArrowUp',
            common: 'Mod-Shift-Alt-ArrowUp',
          };

          if (browser.mac) {
            expect(tooltip(keymap)).toEqual('⌘⇧⌥↑');
          } else {
            expect(tooltip(keymap)).toEqual('Ctrl+Shift+Alt+↑');
          }
        });
      });

      describe('findShortcutByDescription', () => {
        it('should return matched shortcut for Quote if found', () => {
          if (browser.mac) {
            expect(findShortcutByDescription('Quote')).toEqual('Cmd-Shift-9');
          } else {
            expect(findShortcutByDescription('Quote')).toEqual('Ctrl-Shift-9');
          }
        });

        it('should return matched shortcut for Redo if found', () => {
          if (browser.mac) {
            expect(findShortcutByDescription('Redo')).toEqual('Cmd-Shift-z');
          } else {
            expect(findShortcutByDescription('Redo')).toEqual('Ctrl-y');
          }
        });

        it('should return undefined if shortcut not found', () => {
          expect(findShortcutByDescription('random')).toBe(undefined);
        });
      });

      describe('findKeymapByDescription', () => {
        it('should return keymap when keymap is found', () => {
          expect(findKeymapByDescription('Bold')).toEqual(toggleBold);
        });

        it('should return undefined when keymap is not found', () => {
          expect(findKeymapByDescription('random')).toBe(undefined);
        });
      });

      describe('makeKeyMapWithCommon', () => {
        it('replaces Mod with Ctrl for Windows and Cmd for Mac', () => {
          expect(makeKeyMapWithCommon('Undo', 'Mod-z')).toEqual({
            common: 'Mod-z',
            description: 'Undo',
            mac: 'Cmd-z',
            windows: 'Ctrl-z',
          });
        });
      });

      describe('makeKeyMap', () => {
        it('replaces Mod with Ctrl for Windows and Cmd for Mac', () => {
          expect(makeKeymap('Redo', 'Ctrl-y', 'Mod-Shift-z')).toEqual({
            common: undefined,
            description: 'Redo',
            mac: 'Cmd-Shift-z',
            windows: 'Ctrl-y',
          });
        });
      });
    });
  });
});
