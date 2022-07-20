import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl-next';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';

interface Config {
  enableWarningTooltip: boolean;
}

interface Result {
  renderBidiWarnings: (text: string) => ReactNode;
  warningLabel: string;
}

export const useBidiWarnings = ({
  enableWarningTooltip = true,
}: Config): Result => {
  const intl = useIntl();
  const warningLabel = intl.formatMessage(codeBidiWarningMessages.label);
  const renderBidiWarnings = (text: string): ReactNode => {
    return codeBidiWarningDecorator<ReactNode>(
      text,
      ({ bidiCharacter, index }) => (
        <CodeBidiWarning
          bidiCharacter={bidiCharacter}
          key={index}
          label={warningLabel}
          tooltipEnabled={enableWarningTooltip}
        />
      ),
    );
  };
  return { renderBidiWarnings, warningLabel };
};
