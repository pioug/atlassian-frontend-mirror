/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import Icon from '@atlaskit/icon';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../../../analytics/enums';
import AnalyticsContext from '../../../../analytics/analyticsContext';

const WrapIcon = () => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <g fill="currentColor" clipPath="url(#clip0_654_431)">
        <rect width="24" height="24" fillOpacity="0.01" />
        <path
          d="M20 4h-1v16h1V4ZM3 8a1 1 0 0 1 1-1h9.5a4.5 4.5 0 1 1 0 9h-2.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 1.414l-.293.293H13.5a2.5 2.5 0 0 0 0-5H4a1 1 0 0 1-1-1Z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

type Props = {
  setWrapLongLines: Dispatch<SetStateAction<boolean>>;
  wrapLongLines?: boolean;
};

const CodeBlockWrapButton: React.FC<Props & WrappedComponentProps> = ({
  setWrapLongLines,
  wrapLongLines,
  intl,
}) => {
  const wrapMessage = intl.formatMessage(
    wrapLongLines
      ? codeBlockButtonMessages.unwrapCode
      : codeBlockButtonMessages.wrapCode,
  );

  return (
    <AnalyticsContext.Consumer>
      {({ fireAnalyticsEvent }) => (
        <span>
          <Tooltip
            content={wrapMessage}
            hideTooltipOnClick={false}
            position="top"
          >
            <Button
              appearance="subtle"
              aria-haspopup={true}
              aria-label={wrapMessage}
              className={`wrap-code ${wrapLongLines ? 'clicked' : ''}`}
              iconBefore={<Icon glyph={WrapIcon} label="" />}
              isSelected={wrapLongLines}
              onClick={(event) => {
                fireAnalyticsEvent({
                  action: ACTION.CLICKED,
                  actionSubject: ACTION_SUBJECT.BUTTON,
                  actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_WRAP,
                  attributes: {
                    wrapped: !wrapLongLines,
                  },
                  eventType: EVENT_TYPE.UI,
                });

                setWrapLongLines(!wrapLongLines);

                event.stopPropagation();
              }}
              spacing="compact"
            />
          </Tooltip>
        </span>
      )}
    </AnalyticsContext.Consumer>
  );
};

export default injectIntl(CodeBlockWrapButton);
