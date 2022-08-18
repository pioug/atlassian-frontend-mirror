import React from 'react';

import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import { Code } from '@atlaskit/code';
import { code } from '@atlaskit/docs';
import { N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const BlockQuote = styled.div`
  border-left: 3px solid ${token('color.border.input', N50)};
  padding: 10px 0 10px 20px;
  margin-top: 20px;
`;

const renderers = {
  code({ value }: { language: string; value: string }) {
    return code`${value}`;
  },
  inlineCode({ value }: { language: string; value: string }) {
    return <Code>{value}</Code>;
  },
  blockquote: BlockQuote,
};

const MarkdownRender = ({ children }: { children: string }) => (
  <ReactMarkdown renderers={renderers}>{children}</ReactMarkdown>
);

export default MarkdownRender;
