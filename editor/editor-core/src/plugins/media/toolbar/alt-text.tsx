import React from 'react';
import type { IntlShape } from 'react-intl-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  FloatingToolbarButton,
  FloatingToolbarCustom,
  FloatingToolbarConfig,
} from '@atlaskit/editor-common/types';
import type { Command } from '../../../types';
import { openMediaAltTextMenu } from '../pm-plugins/alt-text/commands';
import { ToolTipContent, addAltText } from '../../../keymaps';
import type { MediaToolbarBaseConfig } from '../types';
import { messages } from '../pm-plugins/alt-text/messages';
import AltTextEdit, {
  CONTAINER_WIDTH_IN_PX,
} from '../pm-plugins/alt-text/ui/AltTextEdit';
import { getMediaNodeFromSelection } from '../utils/media-common';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ClassNames } from '../pm-plugins/alt-text/style';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';

const testId = 'alt-text-edit-button';

export const altTextButton = (
  intl: IntlShape,
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
    testId,
    tooltipContent: <ToolTipContent description={title} keymap={addAltText} />,
  };
};

export const altTextEditComponent = (
  options?: AltTextToolbarOptions,
): FloatingToolbarCustom<Command> => {
  return {
    type: 'custom',
    fallback: [],
    disableArrowNavigation: true,
    render: (view?: EditorView, idx?: number) => {
      if (!view) {
        return null;
      }

      const mediaNode = getMediaNodeFromSelection(view.state);

      if (!mediaNode) {
        return null;
      }
      /** Focus should move to the 'Alt text' button when the toolbar closes
       * and not close the floating toolbar.
       */
      const handleEsc = () => {
        const {
          state: { tr },
          dispatch,
        } = view;
        const newTr = options?.forceFocusSelector?.(
          `[data-testid="${testId}"]`,
        )(tr);

        if (newTr) {
          dispatch(newTr);
        }
      };

      return (
        <AltTextEdit
          view={view}
          key={idx}
          value={mediaNode.attrs.alt}
          altTextValidator={options && options.altTextValidator}
          onEscape={handleEsc}
        />
      );
    },
  };
};

export interface AltTextToolbarOptions {
  altTextValidator?: (value: string) => string[];
  forceFocusSelector?: ForceFocusSelector;
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
