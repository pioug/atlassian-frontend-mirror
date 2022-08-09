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

describe('disable spellchecking on safari', () => {
  const createEditor = createEditorFactory();
  const setupEditorView = ({
    safari,
    safari_version,
    disableSpellcheckByBrowser,
  }: {
    safari?: boolean;
    safari_version?: number;
    disableSpellcheckByBrowser?: any;
  }) => {
    utils.browser.safari = safari;
    utils.browser.safari_version = safari_version;

    const featureFlags: any = {
      disableSpellcheckByBrowser,
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
      safari: true,
      safari_version: 98,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      safari: true,
      safari_version: 98,
      disableSpellcheckByBrowser: JSON.stringify({
        safari: {
          minimum: 96,
          maximum: 99,
        },
      }),
    },
    {
      safari: true,
      safari_version: 98,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 98,
          maximum: 99,
        },
      },
    },
    {
      safari: true,
      safari_version: 98,
      disableSpellcheckByBrowser: JSON.stringify({
        safari: {
          minimum: 98,
          maximum: 99,
        },
      }),
    },
    {
      safari: true,
      safari_version: 99,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 98,
          maximum: 99,
        },
      },
    },
    {
      safari: true,
      safari_version: 109,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 98,
        },
      },
    },
    {
      safari: true,
      safari_version: 109,
      disableSpellcheckByBrowser: JSON.stringify({
        safari: {
          minimum: 98,
        },
      }),
    },
    {
      safari: true,
      safari_version: 109,
      disableSpellcheckByBrowser: '{"safari":{"minimum":98,"maximum":109}}',
    },
  ])('[case%#] when safari is true', (props) => {
    describe(`when the current safari version is ${props.safari_version} and browser range are valid`, () => {
      it('should set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).toContain('spellcheck="false"');
      });
    });
  });

  describe.each([
    {
      safari: true,
      safari_version: 100,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      safari: true,
      safari_version: 90,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      safari: true,
      safari_version: 90,
      disableSpellcheckByBrowser: {
        safari: {
          minimum: 99,
          maximum: 96,
        },
      },
    },
    {
      safari: true,
      safari_version: 90,
      disableSpellcheckByBrowser: {
        safari: {
          maximum: 96,
        },
      },
    },
    {
      safari: true,
      safari_version: 90,
      disableSpellcheckByBrowser: 'some invalid text',
    },
    {
      safari: true,
      safari_version: 90,
      disableSpellcheckByBrowser: undefined,
    },
  ])('[case%#] when safari is true', (props) => {
    describe(`when the current safari version is ${props.safari_version} and the browser range is outside the current browser version,`, () => {
      it('should not set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).not.toContain('spellcheck="false"');
      });
    });
  });
});

describe('disable spellchecking on chrome', () => {
  const createEditor = createEditorFactory();
  const setupEditorView = ({
    chrome,
    chrome_version,
    disableSpellcheckByBrowser,
  }: {
    chrome?: boolean;
    chrome_version?: number;
    disableSpellcheckByBrowser?: any;
  }) => {
    utils.browser.chrome = chrome;
    utils.browser.chrome_version = chrome_version;

    const featureFlags: any = {
      disableSpellcheckByBrowser,
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
      chrome_version: 98,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 98,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 98,
          maximum: 99,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 99,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 98,
          maximum: 99,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 109,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 98,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 109,
      disableSpellcheckByBrowser: JSON.stringify({
        chrome: {
          minimum: 98,
        },
      }),
    },
  ])('[case%#] when chrome is true', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and the browser range is valid.`, () => {
      it('should set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).toContain('spellcheck="false"');
      });
    });
  });

  describe.each([
    {
      chrome: true,
      chrome_version: 100,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 90,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 96,
          maximum: 99,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 90,
      disableSpellcheckByBrowser: {
        chrome: {
          minimum: 99,
          maximum: 96,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 90,
      disableSpellcheckByBrowser: {
        chrome: {
          maximum: 96,
        },
      },
    },
    {
      chrome: true,
      chrome_version: 90,
      disableSpellcheckByBrowser: 'invalid text',
    },
    {
      chrome: true,
      chrome_version: 90,
      disableSpellcheckByBrowser: undefined,
    },
  ])('[case%#] when chrome is true', (props) => {
    describe(`when the current chrome version is ${props.chrome_version} and the browser range is outside the browser version.`, () => {
      it('should not set the spellcheck attribute to false', () => {
        const { wrapper } = setupEditorView(props);
        expect(wrapper.html()).not.toContain('spellcheck="false"');
      });
    });
  });
});
