import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { name } from '../../../../package.json';
import expectedSvgIds from '../../../internal/iconIds';

describe(name, () => {
  it('icon export should contain expected SVG symbol ids', async () => {
    const iconsPath = path.join(__dirname, '../../../icons-sprite.svg');
    const icons = await fs.promises.readFile(iconsPath, 'utf-8');

    // NOTE Please remember:
    // An addition is a feature
    // a removal or rename is a BREAKING CHANGE

    // Load the spritesheet
    const { window } = new JSDOM(icons);
    const { document } = window;

    // Get the id of each symbol in the spritesheet
    const actual = [...document.querySelectorAll('symbol')]
      .map((symbol) => symbol.id)
      .sort();

    const expected = expectedSvgIds.sort();
    expect(actual).toEqual(expected);

    // If you find yourself here and wonder why this list is not auto-generated, then bear in
    // mind that tests are supposed to tell you when a piece of software breaks.
    // As the sole purpose of this component is providing icons:
    // * changing an icon is a patch
    // * adding an icon is a feature
    // * removing an icon is a breaking change
    // * renaming an icon is a breaking change
    // If we were to auto-generate this list, then renaming, adding or removing would NOT
    // break any tests and thus not hint the developer at what kind of change they are making
  });
});
