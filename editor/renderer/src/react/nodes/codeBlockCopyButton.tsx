/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { N20, N30, N700 } from '@atlaskit/theme/colors';
import { copyTextToClipboard } from '../utils/clipboard';
import { codeBlockCopyButtonMessages } from '@atlaskit/editor-common/messages';

import { token } from '@atlaskit/tokens';

type Props = {
  content: string;
};

const copyButtonWrapperStyles = css`
  display: flex;
  position: sticky;
  justify-content: flex-end;
  top: 0;

  button {
    position: absolute;
    display: flex;
    justify-content: center;
    height: 32px;
    width: 32px;
    right: 6px;
    top: 4px;
    padding: 2px;
    opacity: 0;
    transition: opacity 0.2s ease 0s;
    border: 2px solid ${token('color.border', '#fff')};
    border-radius: 4px;
    background-color: ${token('elevation.surface.overlay', N20)};
    color: ${token('color.text', 'rgb(66, 82, 110)')} !important;
  }

  button:hover {
    border: 2px solid ${token('color.border', 'transparent')};
    background-color: ${token('elevation.surface.overlay.hovered', N30)};
  }

  button:active {
    border: 2px solid ${token('color.border', 'transparent')};
    background-color: ${token('elevation.surface.overlay.pressed', N30)};
  }

  button.clicked {
    background-color: ${token('elevation.surface.overlay', N700)};
    color: ${token('color.text', '#fff')} !important;
  }
  button.clicked:hover {
    background-color: ${token('elevation.surface.overlay.hovered', N700)};
  }
`;

const CopyButton: React.FC<Props & WrappedComponentProps> = ({
  content,
  intl,
}) => {
  const [tooltip, setTooltip] = useState<string>(
    intl.formatMessage(codeBlockCopyButtonMessages.copyCodeToClipboard),
  );
  const [className, setClassName] = useState<string>('copy-to-clipboard');
  const onMouseLeave = () => {
    setTooltip(
      intl.formatMessage(codeBlockCopyButtonMessages.copyCodeToClipboard),
    );
    setClassName('copy-to-clipboard');
  };
  return (
    <span css={copyButtonWrapperStyles}>
      <Tooltip content={tooltip} hideTooltipOnClick={false} position="top">
        <div onMouseLeave={onMouseLeave}>
          <Button
            className={className}
            aria-label={tooltip}
            spacing="compact"
            appearance="subtle"
            aria-haspopup={true}
            iconBefore={<CopyIcon label={tooltip} />}
            onClick={() => {
              copyTextToClipboard(content);
              setTooltip(
                intl.formatMessage(
                  codeBlockCopyButtonMessages.copiedCodeToClipboard,
                ),
              );
              setClassName('copy-to-clipboard clicked');
            }}
          ></Button>
        </div>
      </Tooltip>
    </span>
  );
};

export default injectIntl(CopyButton);
