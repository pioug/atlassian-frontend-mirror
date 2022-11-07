import React from 'react';
import type { EditorActions } from '../src';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';
import { default as FullPageExample } from './5-full-page';

const editorProps = {
  macroProvider: undefined,
  extensionProviders: (editorActions?: EditorActions) => [
    getExampleExtensionProviders(editorActions),
  ],
  allowExtension: {
    allowAutoSave: true,
    allowExtendFloatingToolbars: true,
  },
  elementBrowser: {
    showModal: true,
    replacePlusMenu: true,
    helpUrl:
      'https://support.atlassian.com/confluence-cloud/docs/what-are-macros/',
  },
  insertMenuItems: [],
  allowFragmentMark: true,
};

export default () => <FullPageExample editorProps={editorProps} />;
