import React from 'react';
import { InjectedIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarButton,
  FloatingToolbarCustom,
  FloatingToolbarConfig,
} from '../../floating-toolbar/types';
import { Command } from '../../../types';
import { openMediaAltTextMenu } from '../pm-plugins/alt-text/commands';
import { ToolTipContent, addAltText } from '../../../keymaps';
import { MediaToolbarBaseConfig } from '../types';
import { messages } from '../pm-plugins/alt-text/messages';
import AltTextEdit from '../pm-plugins/alt-text/ui/AltTextEdit';
import { CONTAINER_WIDTH_IN_PX } from '../pm-plugins/alt-text/ui/AltTextEdit';
import { getMediaNodeFromSelection } from '../utils/media-common';
import { EditorState } from 'prosemirror-state';
import { ClassNames } from '../pm-plugins/alt-text/style';

export const altTextButton = (
  intl: InjectedIntl,
  state: EditorState,
): FloatingToolbarButton<Command> => {
  const mediaNode = getMediaNodeFromSelection(state);
  const message =
    mediaNode && mediaNode.attrs.alt ? messages.editAltText : messages.altText;
  const title = intl.formatMessage(message);
  return {
    title,
    id: 'editor.media.altText',
    type: 'button',
    onClick: openMediaAltTextMenu,
    showTitle: true,
    testId: 'alt-text-edit-button',
    tooltipContent: <ToolTipContent description={title} keymap={addAltText} />,
  };
};

export const altTextEditComponent = (
  options?: AltTextToolbarOptions,
): FloatingToolbarCustom<Command> => {
  return {
    type: 'custom',
    fallback: [],
    render: (view?: EditorView, idx?: number) => {
      if (!view) {
        return null;
      }

      const mediaNode = getMediaNodeFromSelection(view.state);

      if (!mediaNode) {
        return null;
      }

      return (
        <AltTextEdit
          view={view}
          key={idx}
          value={mediaNode.attrs.alt}
          altTextValidator={options && options.altTextValidator}
        />
      );
    },
  };
};

export interface AltTextToolbarOptions {
  altTextValidator?: (value: string) => string[];
}

export const getAltTextToolbar = (
  toolbarBaseConfig: MediaToolbarBaseConfig,
  options?: AltTextToolbarOptions,
): FloatingToolbarConfig => {
  return {
    ...toolbarBaseConfig,
    width: CONTAINER_WIDTH_IN_PX,
    className: ClassNames.FLOATING_TOOLBAR_COMPONENT,
    items: [altTextEditComponent(options)],
  };
};
