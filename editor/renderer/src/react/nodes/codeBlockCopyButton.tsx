import React, { useState } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { N20, N30, N700 } from '@atlaskit/theme/colors';
import { CopyTextConsumer } from './copy-text-provider';
import { codeBlockCopyButtonMessages } from '../../messages';

type Props = {
  content: string;
};

const CopyButtonWrapper = styled.span`
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
    border: 2px solid #ffffff;
    border-radius: 4px;
    background-color: ${N20};
    color: rgb(66, 82, 110);
  }

  button:hover {
    background-color: ${N30};
  }

  button.clicked {
    background-color: ${N700};
    color: #ffffff !important;
  }
`;

const CopyButton: React.FC<Props & InjectedIntlProps> = ({ content, intl }) => {
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
    <CopyTextConsumer>
      {({ copyTextToClipboard }) => {
        return (
          <CopyButtonWrapper>
            <Tooltip
              content={tooltip}
              hideTooltipOnClick={false}
              position="top"
            >
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
          </CopyButtonWrapper>
        );
      }}
    </CopyTextConsumer>
  );
};

export default injectIntl(CopyButton);
