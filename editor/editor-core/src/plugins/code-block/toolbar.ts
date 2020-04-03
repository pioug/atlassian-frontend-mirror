import { defineMessages } from 'react-intl';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {
  createLanguageList,
  DEFAULT_LANGUAGES,
  getLanguageIdentifier,
} from '@atlaskit/adf-schema';
import { findParentNodeOfType } from 'prosemirror-utils';

import {
  FloatingToolbarHandler,
  FloatingToolbarButton,
  FloatingToolbarSeparator,
  FloatingToolbarSelect,
} from '../floating-toolbar/types';
import { removeCodeBlock, changeLanguage } from './actions';
import commonMessages from '../../messages';
import { pluginKey, CodeBlockState } from './pm-plugins/main';
import { Command } from '../../types';
import { hoverDecoration } from '../base/pm-plugins/decoration';

export const messages = defineMessages({
  selectLanguage: {
    id: 'fabric.editor.selectLanguage',
    defaultMessage: 'Select language',
    description:
      'Code blocks display software code. A prompt to select the software language the code is written in.',
  },
});

const languageList = createLanguageList(DEFAULT_LANGUAGES);

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  if (
    codeBlockState &&
    codeBlockState.toolbarVisible &&
    codeBlockState.element
  ) {
    const parent = findParentNodeOfType(state.schema.nodes.codeBlock)(
      state.selection,
    );

    const language =
      parent && parent.node.attrs ? parent.node.attrs.language : undefined;

    const options = languageList.map(lang => ({
      label: lang.name,
      value: getLanguageIdentifier(lang),
    }));

    const languageSelect: FloatingToolbarSelect<Command> = {
      type: 'select',
      onChange: option => changeLanguage(option.value),
      defaultValue: language
        ? options.find(option => option.value === language)
        : undefined,
      placeholder: formatMessage(messages.selectLanguage),
      options,
    };

    const separator: FloatingToolbarSeparator = {
      type: 'separator',
    };

    const nodeType = state.schema.nodes.codeBlock;

    const deleteButton: FloatingToolbarButton<Command> = {
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onMouseEnter: hoverDecoration(nodeType, true),
      onMouseLeave: hoverDecoration(nodeType, false),
      onClick: removeCodeBlock,
      title: formatMessage(commonMessages.remove),
    };

    return {
      title: 'CodeBlock floating controls',
      getDomRef: () => codeBlockState.element,
      nodeType,
      items: [languageSelect, separator, deleteButton],
    };
  }
  return;
};
