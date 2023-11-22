import React from 'react';

import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  codeBlock as codeBlockAdf,
  panel as panelAdf,
} from '@atlaskit/adf-schema';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
// eslint-disable-next-line no-restricted-imports
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-core/src/__tests__/__helpers/enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import ReactEditorViewContext from '@atlaskit/editor-core/src/create-editor/ReactEditorViewContext';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { BlockTypeState } from '@atlaskit/editor-plugin-block-type';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  code_block,
  doc,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import {
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
  NORMAL_TEXT,
} from '../../../../consts';
import ToolbarBlockType from '../../../ui/ToolbarBlockType';

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'panel', node: panelAdf(true) },
      { name: 'codeBlock', node: codeBlockAdf },
    ];
  },
});

describe('@atlaskit/editor-core/ui/ToolbarBlockType', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(mockNodesPlugin)
      .add(blockTypePlugin);

    return createEditor<BlockTypeState, PluginKey, typeof preset>({
      doc,
      preset,
    });
  };

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorAPI } = editor(doc(p('text')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if current selection is blockquote', () => {
    const { editorAPI } = editor(doc(blockquote(p('te{<>}xt'))));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton if current selection is panel', () => {
    const { editorAPI } = editor(doc(panel()(p('te{<>}xt'))));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;

    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
      />,
    );
    expect(toolbarOption.getByRole('button')).not.toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if code-block is selected', () => {
    const { editorAPI } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  // TODO: asserting on a prop, need to convert to VR or something similar
  it('should have spacing of toolbar button set to none if property isReducedSpacing=true', () => {
    const { editorAPI } = editor(doc(p('text')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toBe('none');
    toolbarOption.unmount();
  });

  it('should render icon in dropdown-menu if property isSmall=true', () => {
    const { editorAPI } = editor(doc(p('text')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
        isSmall={true}
      />,
    );
    expect(
      toolbarOption.getByTestId('toolbar-block-type-text-styles-icon'),
    ).toBeInTheDocument();
    toolbarOption.unmount();
  });

  it('should render current block type in dropdown-menu if property isSmall=false', () => {
    const { editorAPI } = editor(doc(p('text')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setTextLevel={name =>
          editorAPI.core.actions.execute(
            editorAPI.blockType.commands.setTextLevel(
              name,
              INPUT_METHOD.TOOLBAR,
            ),
          )
        }
      />,
    );
    expect(toolbarOption.getByRole('button').innerText).toContain(
      blockTypeMessages.normal.defaultMessage,
    );
    toolbarOption.unmount();
  });

  describe('blockType dropdown items', () => {
    let toolbarOption: RenderResult;
    beforeEach(async () => {
      const { editorView, editorAPI } = editor(doc(p('text')));
      const pluginState = editorAPI.blockType.sharedState.currentState()!;
      const editorRef = {
        current: document.createElement('div'),
      };
      toolbarOption = renderWithIntl(
        <ReactEditorViewContext.Provider
          value={{
            editorRef,
            editorView,
          }}
        >
          <ToolbarBlockType
            pluginState={pluginState}
            setTextLevel={name =>
              editorAPI.core.actions.execute(
                editorAPI.blockType.commands.setTextLevel(
                  name,
                  INPUT_METHOD.TOOLBAR,
                ),
              )
            }
          />
        </ReactEditorViewContext.Provider>,
      );
      const button = toolbarOption.getByRole('button');
      await userEvent.click(button);
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      NORMAL_TEXT,
      HEADING_1,
      HEADING_2,
      HEADING_3,
      HEADING_4,
      HEADING_5,
      HEADING_6,
    ].forEach(blockType => {
      it(`should have tagName ${blockType.tagName} present`, () => {
        const dropdown = toolbarOption.getByRole('group');
        const item = dropdown.querySelector(
          `[data-testId*='dropdown-item__'] ${blockType.tagName}`,
        );
        expect(item).toBeInTheDocument();
      });
    });
  });
});
