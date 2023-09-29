import React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';
import type { PositionType } from '@atlaskit/tooltip/types';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

interface Props {
  title?: string;
  titlePosition?: PositionType;
}

const TooltipHelpTrigger = ({
  title = 'Open help dialog',
  titlePosition = 'left',
  intl,
}: Props & WrappedComponentProps) => {
  // to have translation for the default tooltip helper
  let displayTitle = title;
  if (title === 'Open help dialog') {
    displayTitle = intl.formatMessage(messages.toolbarHelpTitle);
  }

  return (
    <WithHelpTrigger
      render={(showHelp: () => void) => (
        <ToolbarButton
          onClick={showHelp}
          title={displayTitle}
          titlePosition={titlePosition}
          iconBefore={<QuestionIcon label={displayTitle} />}
        />
      )}
    />
  );
};

export default injectIntl(TooltipHelpTrigger);
