import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import AkCode from '@atlaskit/code/inline';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { Mark } from 'prosemirror-model';

import type { MarkProps } from '../types';

export const isCodeMark = (mark: Mark): boolean => {
  return mark && mark.type && mark.type.name === 'code';
};

export function CodeWithIntl(
  props: MarkProps<{ codeBidiWarningTooltipEnabled: boolean }> &
    WrappedComponentProps,
) {
  const codeBidiWarningLabel = props.intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return (
    <AkCode
      className="code"
      codeBidiWarningLabel={codeBidiWarningLabel}
      codeBidiWarningTooltipEnabled={props.codeBidiWarningTooltipEnabled}
      {...props.dataAttributes}
    >
      {props.children}
    </AkCode>
  );
}
export default injectIntl(CodeWithIntl);
