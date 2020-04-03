import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import path from 'path';
import fs from 'fs';
import { name } from '../../../version.json';
import BookIcon from '../../../../glyph/blog/24';
import DefaultIcon, { metadata } from '../../..';

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = (dir: string, filelist: string[]) => {
  let fl = filelist;
  const files = fs.readdirSync(dir);
  fl = filelist || [];
  files.forEach(file => {
    const pth = path.join(dir, file);
    if (fs.statSync(pth).isDirectory()) {
      fl = walkSync(pth, fl);
    } else {
      fl.push(pth);
    }
  });
  return filelist;
};

describe(name, () => {
  describe('exports', () => {
    it('are properly defined for atomic ones', () => {
      // NOTE Please remember:
      // An addition is a feature
      // a removal or rename is a BREAKING CHANGE

      // NOTE the reduced-ui-pack package uses the icons from this package, so if you change
      // anything in the list below then you'll also need to update the tests in reduced-ui-pack.
      // A breaking change to this package is also a breaking change to the reduced-ui-pack package.

      // This list should be sorted alphabetically.
      const expected = [
        'blog',
        'branch',
        'bug',
        'calendar',
        'changes',
        'code',
        'commit',
        'epic',
        'improvement',
        'incident',
        'issue',
        'new-feature',
        'page',
        'problem',
        'pull-request',
        'question',
        'story',
        'subtask',
        'task',
      ];

      const expectedPaths = expected
        .map(a => [
          path.join(__dirname, '../../../../glyph', `${a}/16.js`),
          path.join(__dirname, '../../../../glyph', `${a}/24.js`),
        ])
        .reduce((accumulater, current) => [...accumulater, ...current], []);

      const actual = walkSync(
        path.join(__dirname, '../../../../glyph'),
        [],
      ).filter(ab => /.*\.js$/.test(ab));

      // Additional notes on this check:
      // We are doing an equality check on the sorted versions of the lists as we want to
      // ensure that every icon we expect exists, and also that only icons that we expect
      // exist. This ensures that a new icon cannot be removed without causing this test
      // to error.
      // If an icon is Recieved but not expected, it is a new icon we do not expect.
      // If it is Expected but not received, it means it is an existing icon that has been removed
      expect(actual.sort()).toEqual(expectedPaths.sort());
      // If you find yourself here and wonder why this list is not auto-generated, then bear in
      // mind that tests are supposed to tell you when a piece of software breaks.
      // As the sole purpose of this component is providing icons:
      //
      // * changing an icon is a patch
      // * adding an icon is a feature
      // * removing an icon is a breaking change
      // * renaming an icon is a breaking change
      //
      // If we were to auto-generate this list, then renaming, adding or removing would NOT
      // break any tests and thus not hint the developer at what kind of change they are making
    });

    describe('bundle', () => {
      it('exports the Icon component', () => {
        expect(new DefaultIcon({ label: 'My icon' })).toBeInstanceOf(Component);
      });
    });
  });

  describe('component structure', () => {
    it('should be possible to create the components', async () => {
      const components = await Promise.all(
        Object.keys(metadata).map(async key =>
          import(`../../../../glyph/${key}`),
        ),
      );

      for (const icon of components) {
        const Icon = icon.default;
        const wrapper = shallow(<Icon label="My icon" />);
        expect(wrapper).not.toBe(undefined);
        expect(Icon).toBeInstanceOf(Function);
      }
    });
  });

  describe('props', () => {
    describe('label property', () => {
      it('should accept a label', () => {
        const label = 'my label';
        const wrapper = mount(<BookIcon label={label} />);
        const span = wrapper.find('span').first();

        expect(span.is('[aria-label="my label"]')).toBe(true);
      });
    });
  });
});
