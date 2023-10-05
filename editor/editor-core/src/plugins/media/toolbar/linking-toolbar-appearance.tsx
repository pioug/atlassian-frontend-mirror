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
import { FloatingToolbarButton as ToolbarButton } from '@atlaskit/editor-common/ui';
import { FloatingToolbarSeparator as Separator } from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { token } from '@atlaskit/tokens';

import type { MediaLinkingState } from '../pm-plugins/linking';
import { stateKey } from '../pm-plugins/plugin-key';
import { checkMediaType } from '../utils/check-media-type';
import { currentMediaNode } from '../utils/current-media-node';

export interface LinkingToolbarProps {
  editorState: EditorState;
  intl: IntlShape;
  mediaLinkingState: MediaLinkingState;
  onAddLink: React.MouseEventHandler;
  onEditLink: React.MouseEventHandler;
  onOpenLink: React.MouseEventHandler;
}

// need this wrapper, need to have 4px between items.
const wrapper = css`
  display: flex;
  align-items: center;
  margin-right: ${token('space.050', '4px')};
`;

export const LinkToolbarAppearance: React.FC<LinkingToolbarProps> = ({
  editorState,
  mediaLinkingState,
  intl,
  onAddLink,
  onEditLink,
  onOpenLink,
}) => {
  const [showLinkingControls, setShowLinkingControls] = useState(true);

  useEffect(() => {
    const mediaNode = currentMediaNode(editorState);
    if (!mediaNode) {
      setShowLinkingControls(false);
      return;
    }

    const mediaClientConfig = stateKey.getState(editorState)?.mediaClientConfig;

    if (!mediaClientConfig) {
      setShowLinkingControls(false);
      return;
    }

    checkMediaType(mediaNode, mediaClientConfig).then((mediaType) => {
      setShowLinkingControls(mediaType === 'external' || mediaType === 'image');
    });
  }, [editorState]);

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
        <div css={wrapper}>
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
        <div css={wrapper}>
          <Separator />
        </div>
        <ToolbarButton
          target="_blank"
          href={isValidUrl ? mediaLinkingState.link : undefined}
          disabled={!isValidUrl}
          onClick={onOpenLink}
          title={linkTitle}
          icon={<OpenIcon label={linkTitle}></OpenIcon>}
          className="hyperlink-open-link"
        />
        <Separator />
      </Fragment>
    );
  } else {
    const title = intl.formatMessage(linkToolbarMessages.addLink);
    return (
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
    );
  }
};
