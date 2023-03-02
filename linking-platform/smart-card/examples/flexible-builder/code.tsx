/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useMemo } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { CodeBlock } from '@atlaskit/code';
import { BlockTemplate, FlexibleTemplate } from './types';
import { toComponentProps, toObjectString } from '../utils/common';

const codeStyles = css`
  display: inline-grid;
  tab-size: 2;
`;

const toBlockCode = (blockTemplate: BlockTemplate): string => {
  const { name, ...props } = blockTemplate;
  const str = toComponentProps(props);
  return `<${name}${str} />`;
};

const Code: React.FC<{ template: FlexibleTemplate }> = ({ template }) => {
  const text = useMemo(() => {
    const uiCode = template.ui ? ` ui={${toObjectString(template.ui)}}` : '';
    const propCode = toComponentProps(template.cardProps || {});

    const blockCode = template.blocks
      .map((block) => toBlockCode(block))
      .join('\n\t');
    return `<Card appearance="block"${uiCode}${propCode}>\n\t${blockCode}\n</Card>`;
  }, [template]);

  return (
    <div css={codeStyles}>
      <CodeBlock language="jsx" text={text} />
    </div>
  );
};

export default withErrorBoundary(Code, {
  fallback: <CodeBlock language="jsx" text="// Error!" />,
});
