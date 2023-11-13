import { render, screen } from '@testing-library/react';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import InsertMenu from '../../InsertMenu';
import { IntlProvider } from 'react-intl-next';
import type { InsertMenuProps } from '../../types';
import type { PluginInjectionAPIWithDependencies } from '@atlaskit/editor-common/types';
import type { InsertBlockPluginDependencies } from '../../../../types';

const dropdownItems = [
  {
    content: 'Code snippet',
    tooltipDescription: 'Display code with syntax highlighting',
    shortcut: '```',
    value: {
      name: 'codeblock',
    },
    elemBefore: {
      props: {
        label: 'Code snippet',
      },
    },
    'aria-label': 'Code snippet ```',
    'aria-keyshortcuts': '` ` `',
    isDisabled: false,
    title: {
      type: {
        compare: null,
      },
      props: {
        description: 'Insert',
        shortcutOverride: '/',
      },
    },
  },
  {
    content: 'Info panel',
    tooltipDescription: 'Highlight information in a colored panel',
    value: {
      name: 'panel',
    },
    elemBefore: {
      props: {
        label: 'Info panel',
      },
    },
    'aria-label': 'Info panel',
    isDisabled: false,
    title: {
      type: {
        compare: null,
      },
      props: {
        description: 'Insert',
        shortcutOverride: '/',
      },
    },
  },
  {
    content: 'Quote',
    tooltipDescription: 'Insert a quote or citation',
    value: {
      name: 'blockquote',
    },
    elemBefore: {
      props: {
        label: 'Quote',
      },
    },
    'aria-label': 'Quote >',
    'aria-keyshortcuts': 'Shift+. Space',
    shortcut: '>',
    isDisabled: false,
    title: {
      type: {
        compare: null,
      },

      props: {
        description: 'Insert',
        shortcutOverride: '/',
      },
    },
  },
] as InsertMenuProps['dropdownItems'];

describe('InsertMenu', () => {
  const createEditor = createEditorFactory();

  it('should not show viewMore, when showElementBrowserLink is false', () => {
    const { editorView, editorAPI } = createEditor({
      doc: doc(p()),
    });
    render(
      <IntlProvider locale="en">
        <InsertMenu
          editorView={editorView}
          dropdownItems={dropdownItems}
          showElementBrowserLink={false}
          onInsert={jest.fn()}
          toggleVisiblity={jest.fn()}
          pluginInjectionApi={
            editorAPI as PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>
          }
        />
      </IntlProvider>,
    );
    expect(
      screen.queryByTestId('view-more-elements-item'),
    ).not.toBeInTheDocument();
  });

  it('should show viewMore, when showElementBrowserLink is true', () => {
    const { editorView, editorAPI } = createEditor({
      doc: doc(p()),
    });
    render(
      <IntlProvider locale="en">
        <InsertMenu
          editorView={editorView}
          dropdownItems={dropdownItems}
          showElementBrowserLink={true}
          onInsert={jest.fn()}
          toggleVisiblity={jest.fn()}
          pluginInjectionApi={
            editorAPI as PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>
          }
        />
      </IntlProvider>,
    );
    expect(screen.queryByTestId('view-more-elements-item')).toBeVisible();
  });
});
