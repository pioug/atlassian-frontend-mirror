import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { CodeBlock as AkCodeBlock, SupportedLanguages } from '@atlaskit/code';
import {
  overflowShadow,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { N20, DN50 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import { useFeatureFlags } from '../../use-feature-flags';

import CopyButton from './codeBlockCopyButton';

export interface Props {
  text: string;
  language: SupportedLanguages;
  allowCopyToClipboard?: boolean;
  className?: string;
}

function CodeBlock(props: Props & InjectedIntlProps) {
  const { text, language, allowCopyToClipboard = false } = props;
  const featureFlags = useFeatureFlags();

  const codeBidiWarningLabel = props.intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  const className = ['code-block', props.className].join(' ');

  return (
    <div className={className}>
      {allowCopyToClipboard ? <CopyButton content={text} /> : null}
      <AkCodeBlock
        language={language}
        text={text}
        codeBidiWarnings={featureFlags?.codeBidiWarnings}
        codeBidiWarningLabel={codeBidiWarningLabel}
      />
    </div>
  );
}

const IntlCodeBlock = injectIntl(CodeBlock);

export default styled(IntlCodeBlock)`
  tab-size: 4;
  [data-ds--code--code-block] {
    font-size: ${relativeFontSizeToBase16(fontSize())};
    line-height: 1.5rem;
    background-image: ${overflowShadow({
      background: themed({ light: N20, dark: DN50 }),
      width: `${gridSize()}px`,
    })};
    background-attachment: local, scroll, scroll;
    background-position: 100% 0, 100% 0, 0 0;
  }
`;
