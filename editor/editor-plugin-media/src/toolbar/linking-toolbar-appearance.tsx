/** @jsx jsx */
import React, { Fragment, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { addLink, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import {
  linkMessages,
  linkToolbarMessages,
} from '@atlaskit/editor-common/messages';
import {
  FloatingToolbarSeparator as Separator,
  FloatingToolbarButton as ToolbarButton,
} from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';

import type { MediaLinkingState } from '../pm-plugins/linking';
import { stateKey } from '../pm-plugins/plugin-key';
import { checkMediaType } from '../utils/check-media-type';
import {
  currentMediaInlineNode,
  currentMediaNode,
} from '../utils/current-media-node';

export interface LinkingToolbarProps {
  editorState: EditorState;
  intl: IntlShape;
  mediaLinkingState: MediaLinkingState;
  onAddLink: React.MouseEventHandler;
  onEditLink: React.MouseEventHandler;
  onOpenLink: React.MouseEventHandler;
  isInlineNode?: boolean;
  isViewOnly?: boolean;
}

const wrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
});

export const LinkToolbarAppearance = ({
  editorState,
  mediaLinkingState,
  intl,
  onAddLink,
  onEditLink,
  onOpenLink,
  isInlineNode,
  isViewOnly,
}: LinkingToolbarProps) => {
  const [showLinkingControls, setShowLinkingControls] = useState(true);

  useEffect(() => {
    const mediaNode = isInlineNode
      ? currentMediaInlineNode(editorState)
      : currentMediaNode(editorState);
    if (!mediaNode) {
      setShowLinkingControls(false);
      return;
    }

    const mediaClientConfig = stateKey.getState(editorState)?.mediaClientConfig;

    if (!mediaClientConfig) {
      setShowLinkingControls(false);
      return;
    }

    checkMediaType(mediaNode, mediaClientConfig).then(mediaType => {
      setShowLinkingControls(mediaType === 'external' || mediaType === 'image');
    });
  }, [editorState, isInlineNode]);

  if (!showLinkingControls) {
    return null;
  }

  if (mediaLinkingState && mediaLinkingState.editable) {
    const isValidUrl = isSafeUrl(mediaLinkingState.link);
    const title = intl.formatMessage(linkToolbarMessages.editLink);
    const linkTitle = intl.formatMessage(
      isValidUrl ? linkMessages.openLink : linkToolbarMessages.unableToOpenLink,
    );

    return (
      <Fragment>
        {!isViewOnly && (
          <div css={wrapperStyles}>
            <ToolbarButton
              onClick={onEditLink}
              title={title}
              tooltipContent={
                <ToolTipContent description={title} keymap={addLink} />
              }
              testId="edit-link-button"
            >
              {title}
            </ToolbarButton>
          </div>
        )}
        <ToolbarButton
          target="_blank"
          href={isValidUrl ? mediaLinkingState.link : undefined}
          disabled={!isValidUrl}
          onClick={onOpenLink}
          title={linkTitle}
          icon={<OpenIcon label={linkTitle}></OpenIcon>}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          className="hyperlink-open-link"
        />
        <Separator />
      </Fragment>
    );
  } else {
    const title = intl.formatMessage(linkToolbarMessages.addLink);
    return !isViewOnly ? (
      <Fragment>
        <ToolbarButton
          testId="add-link-button"
          onClick={onAddLink}
          title={title}
          tooltipContent={
            <ToolTipContent description={title} keymap={addLink} />
          }
          icon={<LinkIcon label={title} />}
        />
        <Separator />
      </Fragment>
    ) : null;
  }
};
