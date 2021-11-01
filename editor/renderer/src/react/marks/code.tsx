import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AkCode from '@atlaskit/code/inline';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import { useFeatureFlags } from '../../use-feature-flags';
import type { MarkProps } from '../types';

export function CodeWithIntl(props: MarkProps & InjectedIntlProps) {
  const featureFlags = useFeatureFlags();

  const codeBidiWarningLabel = props.intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return (
    <AkCode
      className="code"
      codeBidiWarnings={featureFlags?.codeBidiWarnings}
      codeBidiWarningLabel={codeBidiWarningLabel}
      {...props.dataAttributes}
    >
      {props.children}
    </AkCode>
  );
}
export default injectIntl(CodeWithIntl);
