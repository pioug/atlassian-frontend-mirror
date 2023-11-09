// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getAriaKeyshortcuts,
  makeKeyMapWithCommon,
} from '@atlaskit/editor-common/keymaps';

describe('keymap getAriaKeyShortcuts', () => {
  it('should recognise control keys', () => {
    expect(getAriaKeyshortcuts('Shift')).toEqual('Shift');
    expect(getAriaKeyshortcuts('Alt')).toEqual('Alt');
    expect(getAriaKeyshortcuts('Ctrl')).toEqual('Control');
    expect(getAriaKeyshortcuts('Enter')).toEqual('Enter');
    expect(getAriaKeyshortcuts('Space')).toEqual('Space');
    expect(getAriaKeyshortcuts('Backspace')).toEqual('Backspace');
    expect(getAriaKeyshortcuts('Tab')).toEqual('Tab');
    expect(getAriaKeyshortcuts('Esc')).toEqual('Esc');
  });

  it('should be case insensitive', () => {
    expect(getAriaKeyshortcuts('Space')).toEqual('Space');
    expect(getAriaKeyshortcuts('SPACE')).toEqual('Space');
    expect(getAriaKeyshortcuts('space')).toEqual('Space');
  });

  it('should map key combination', () => {
    expect(getAriaKeyshortcuts('Shift-A')).toEqual('Shift+a');
    expect(getAriaKeyshortcuts('Alt-A')).toEqual('Alt+a');
    expect(getAriaKeyshortcuts('Cmd-A')).toEqual('Meta+a');
    expect(getAriaKeyshortcuts('Ctrl-A')).toEqual('Control+a');
  });

  it('should accept keymap object', () => {
    const toggleBulletList = makeKeyMapWithCommon('Bullet list', 'Mod-Shift-8');
    expect(getAriaKeyshortcuts(toggleBulletList)).toEqual('Control+Shift+8');
  });
});
