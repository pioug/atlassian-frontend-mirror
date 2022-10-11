/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import Page from '@atlaskit/page';

interface VRTestCaseOpts {
  title: string;
  children: () => JSX.Element;
}

const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: 8px;
`;

export const VRTestCase = ({ title, children }: VRTestCaseOpts) => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
        <div style={{ padding: '30px' }}>
          <h6 css={subHeaderCSS}>{title}</h6>
          {children()}
        </div>
      </Page>
    </IntlProvider>
  );
};

const content = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;
const encodedContent = encodeURIComponent(content);
export const overrideEmbedContent = `data:text/html;charset=utf-8,${encodedContent}`;
