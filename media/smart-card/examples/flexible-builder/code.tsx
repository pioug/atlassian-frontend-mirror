/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useMemo } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { CodeBlock } from '@atlaskit/code';
import { BlockTemplate, FlexibleTemplate } from './types';

const codeStyles = css`
  display: inline-grid;
  tab-size: 2;
`;

const toEmptyFunctionString = (): string => '() => {}';

const toObjectString = (obj: object, indent: string = ''): string => {
  const str = Object.entries(obj)
    .map(([key, value]) => `${key}: ${toValueString(value)}`)
    .join(', ');
  return `${indent}{ ${str} }`;
};

const toArrayString = (arr: any[], indent: string = ''): string => {
  const str = arr
    .map((value: any) => toValueString(value, `${indent}\t`))
    .join(', ');
  return `[${str}${indent}]`;
};

const toValueString = (value: any, indent: string = ''): string => {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else if (Array.isArray(value)) {
    return toArrayString(value, indent);
  } else if (typeof value === 'function') {
    return toEmptyFunctionString();
  } else if (typeof value === 'object') {
    if (value['$$typeof'] === Symbol.for('react.element')) {
      // This is likely the custom action icon
      return '<CustomComponent />';
    } else {
      return toObjectString(value, indent);
    }
  } else {
    return `${value}`;
  }
};

const toComponentProp = (key: string, value?: any, indent?: string): string => {
  if (typeof value === 'string') {
    return `${key}="${value}"`;
  } else {
    return `${key}={${toValueString(value, indent)}}`;
  }
};

const toComponentProps = (props: object): string =>
  Object.entries(props).reduce(
    (acc, [key, value]) =>
      `${acc}\n\t\t${toComponentProp(key, value, '\n\t\t')}`,
    '',
  );

const toBlockCode = (blockTemplate: BlockTemplate): string => {
  const { name, ...props } = blockTemplate;
  const str = toComponentProps(props);
  return `<${name}${str} />`;
};

const Code: React.FC<{ template: FlexibleTemplate }> = ({ template }) => {
  const text = useMemo(() => {
    const uiCode = template.ui ? ` ui={${toObjectString(template.ui)}}` : '';
    const blockCode = template.blocks
      .map((block) => toBlockCode(block))
      .join('\n\t');
    return `<Card appearance="block"${uiCode}>\n\t${blockCode}\n</Card>`;
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
