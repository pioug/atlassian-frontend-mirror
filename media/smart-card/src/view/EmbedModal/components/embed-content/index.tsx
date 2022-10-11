/** @jsx jsx */
import { FC } from 'react';
import { css, jsx } from '@emotion/react';
import { getIframeSandboxAttribute } from '../../../../utils';
import { EmbedProps } from './types';

const iframeCss = css`
  width: 100%;
  height: calc(100vh - 208px);
`;

const EmbedContent: FC<EmbedProps> = ({ isTrusted, name, src, testId }) => {
  const sandbox = getIframeSandboxAttribute(isTrusted);
  const props = {
    css: iframeCss,
    frameBorder: 0,
    name,
    sandbox,
    src,
    'data-testid': `${testId}-embed`,
  };
  return <iframe {...props} />;
};

export default EmbedContent;
