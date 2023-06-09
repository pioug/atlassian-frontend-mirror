import React from 'react';
import { EditorState } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { IntlShape } from 'react-intl-next';

import { FloatingToolbarConfig } from '../../floating-toolbar/types';
import { hideLinkingToolbar, setUrlToMedia, unlink } from '../commands/linking';
import { getMediaLinkingState, MediaLinkingState } from '../pm-plugins/linking';

import MediaLinkingToolbar from '../ui/MediaLinkingToolbar';
import {
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';

import { MediaToolbarBaseConfig } from '../types';
import { forceFocusSelector } from '../../floating-toolbar/pm-plugins/force-focus';

const FORCE_FOCUS_SELECTOR =
  '[data-testid="add-link-button"],[data-testid="edit-link-button"]';
export function shouldShowMediaLinkToolbar(editorState: EditorState): boolean {
  const mediaLinkingState = getMediaLinkingState(editorState);
  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return false;
  }
  const {
    nodes: { media },
    marks: { link },
  } = editorState.schema;
  const node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);

  if (!node || node.type !== media) {
    return false;
  }

  const { parent } = editorState.doc.resolve(mediaLinkingState.mediaPos);

  return parent && parent.type.allowsMarkType(link);
}

export const getLinkingToolbar = (
  toolbarBaseConfig: MediaToolbarBaseConfig,
  mediaLinkingState: MediaLinkingState,
  state: EditorState,
  intl: IntlShape,
  providerFactory?: ProviderFactory,
): FloatingToolbarConfig | undefined => {
  const { link, visible, editable: editing, mediaPos } = mediaLinkingState;

  if (visible && mediaPos !== null) {
    const node = state.doc.nodeAt(mediaPos);
    if (node) {
      return {
        ...toolbarBaseConfig,
        height: RECENT_SEARCH_HEIGHT_IN_PX,
        width: RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
        items: [
          {
            type: 'custom',
            fallback: [],
            disableArrowNavigation: true,
            render: (view, idx) => {
              if (!view || !providerFactory) {
                return null;
              }

              return (
                <MediaLinkingToolbar
                  key={idx}
                  displayUrl={link}
                  providerFactory={providerFactory}
                  intl={intl}
                  editing={editing}
                  onUnlink={() => unlink(view.state, view.dispatch, view)}
                  onBack={(href, meta) => {
                    if (href.trim() && meta.inputMethod) {
                      setUrlToMedia(href, meta.inputMethod)(
                        view.state,
                        view.dispatch,
                        view,
                      );
                    }
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                  onCancel={() => {
                    hideLinkingToolbar(view.state, view.dispatch, view, true);
                    /** Focus should move to the 'Add link' button when the toolbar closes
                     * and not close the floating toolbar.
                     */
                    forceFocusSelector(FORCE_FOCUS_SELECTOR, view);
                  }}
                  onSubmit={(href, meta) => {
                    setUrlToMedia(href, meta.inputMethod)(
                      view.state,
                      view.dispatch,
                      view,
                    );
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                  onBlur={() => {
                    hideLinkingToolbar(view.state, view.dispatch, view);
                  }}
                />
              );
            },
          },
        ],
      };
    }
  }
};
