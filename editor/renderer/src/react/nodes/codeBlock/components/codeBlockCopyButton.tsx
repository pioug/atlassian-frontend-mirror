/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { copyTextToClipboard } from '../../../utils/clipboard';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../../../analytics/enums';
import AnalyticsContext from '../../../../analytics/analyticsContext';

type Props = {
  content: string;
};

const CopyButton: React.FC<Props & WrappedComponentProps> = ({
  content,
  intl,
}) => {
  const [tooltip, setTooltip] = useState<string>(
    intl.formatMessage(codeBlockButtonMessages.copyCodeToClipboard),
  );
  const [className, setClassName] = useState<string>('copy-to-clipboard');
  const onMouseLeave = () => {
    setTooltip(intl.formatMessage(codeBlockButtonMessages.copyCodeToClipboard));
    setClassName('copy-to-clipboard');
  };
  return (
    <AnalyticsContext.Consumer>
      {({ fireAnalyticsEvent }) => (
        <span>
          <Tooltip content={tooltip} hideTooltipOnClick={false} position="top">
            <div onMouseLeave={onMouseLeave}>
              <Button
                appearance="subtle"
                aria-haspopup={true}
                aria-label={tooltip}
                className={className}
                iconBefore={<CopyIcon label={tooltip} />}
                onClick={() => {
                  fireAnalyticsEvent({
                    action: ACTION.CLICKED,
                    actionSubject: ACTION_SUBJECT.BUTTON,
                    actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_COPY,
                    eventType: EVENT_TYPE.UI,
                  });

                  copyTextToClipboard(content);
                  setTooltip(
                    intl.formatMessage(
                      codeBlockButtonMessages.copiedCodeToClipboard,
                    ),
                  );
                  setClassName('copy-to-clipboard clicked');
                }}
                spacing="compact"
              />
            </div>
          </Tooltip>
        </span>
      )}
    </AnalyticsContext.Consumer>
  );
};

export default injectIntl(CopyButton);
