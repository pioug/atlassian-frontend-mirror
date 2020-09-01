import React from 'react';
import { PureComponent } from 'react';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import { overflowShadow, OverflowShadowProps } from '@atlaskit/editor-common';
import CopyButton from './codeBlockCopyButton';

export interface Props {
  text: string;
  language: string;
  allowCopyToClipboard?: boolean;
}

class CodeBlock extends PureComponent<Props & OverflowShadowProps, {}> {
  render() {
    const {
      text,
      language,
      handleRef,
      shadowClassNames,
      allowCopyToClipboard = false,
    } = this.props;

    const codeProps = {
      language,
      text,
    };

    return (
      <div className={`code-block ${shadowClassNames}`} ref={handleRef}>
        {allowCopyToClipboard ? <CopyButton content={codeProps.text} /> : null}
        <AkCodeBlock {...codeProps} />
      </div>
    );
  }
}

export default overflowShadow(CodeBlock, {
  overflowSelector: 'span',
  scrollableSelector: 'code',
});
