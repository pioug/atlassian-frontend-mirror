import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import * as utils from '@atlaskit/editor-common/utils';
jest.mock('@atlaskit/editor-common/utils', () => {
  const actual = jest.requireActual<any>('@atlaskit/editor-common/utils');

  return {
    ...actual,
    browser: {
      ...actual.browser,
    },
  };
});

describe('disable spellchecking on chrome', () => {
  const createEditor = createEditorFactory();
  const setupEditorView = ({
    chrome,
    chrome_version,
    maxUnsafeChromeSpellcheckingVersion,
  }: {
    chrome: boolean;
    chrome_version: number;
    maxUnsafeChromeSpellcheckingVersion: any;
  }) => {
    utils.browser.chrome = chrome;
    utils.browser.chrome_version = chrome_version;

    const featureFlags: any = {
      maxUnsafeChromeSpellcheckingVersion,
    };

    return createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        featureFlags,
      },
    });
  };

  describe.each([
    {
      chrome: true,
      chrome_version: 95,
      maxUnsafeChromeSpellcheckingVersion: 98,
    },
    {
      chrome: true,
      chrome_version: 94,
      maxUnsafeChromeSpellcheckingVersion: 98,
    },
  ])('[case%#] when chrome is true', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and maxUnsafeChromeSpellcheckingVersion is ${props.maxUnsafeChromeSpellcheckingVersion}`, () => {
      it('should not set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).not.toContain('spellcheck="false"');
      });
    });
  });

  describe.each([
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: 98,
    },
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: '99',
    },
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: 99,
    },
  ])('[case%#] when chrome is true', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and maxUnsafeChromeSpellcheckingVersion is ${props.maxUnsafeChromeSpellcheckingVersion}`, () => {
      it('should set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).toContain('spellcheck="false"');
      });
    });
  });

  describe.each([
    {
      chrome: false,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: 98,
    },
    {
      chrome: false,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: '99',
    },
    {
      chrome: false,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: 99,
    },
  ])('[case%#] when chrome is false', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and maxUnsafeChromeSpellcheckingVersion is ${props.maxUnsafeChromeSpellcheckingVersion}`, () => {
      it('should not set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).not.toContain('spellcheck="false"');
      });
    });
  });

  describe.each([
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: null,
    },
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: 'lol',
    },
    {
      chrome: true,
      chrome_version: 98,
      maxUnsafeChromeSpellcheckingVersion: Number.NaN,
    },
  ])('[case%#] when maxUnsafeChromeSpellcheckingVersion not valid', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and maxUnsafeChromeSpellcheckingVersion is ${props.maxUnsafeChromeSpellcheckingVersion}`, () => {
      it('should not set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).not.toContain('spellcheck="false"');
      });
    });
  });
});
