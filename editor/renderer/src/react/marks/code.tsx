import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AkCode from '@atlaskit/code/inline';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { Mark } from 'prosemirror-model';

import { useFeatureFlags } from '../../use-feature-flags';
import type { MarkProps } from '../types';

export const isCodeMark = (mark: Mark): boolean => {
  return mark && mark.type && mark.type.name === 'code';
};

export function CodeWithIntl(
  props: MarkProps<{ codeBidiWarningTooltipEnabled: boolean }> &
    InjectedIntlProps,
) {
  const featureFlags = useFeatureFlags();

  const codeBidiWarningLabel = props.intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return (
    <AkCode
      className="code"
      codeBidiWarnings={featureFlags?.codeBidiWarnings}
      codeBidiWarningLabel={codeBidiWarningLabel}
      codeBidiWarningTooltipEnabled={props.codeBidiWarningTooltipEnabled}
      {...props.dataAttributes}
    >
      {props.children}
    </AkCode>
  );
}
export default injectIntl(CodeWithIntl);
