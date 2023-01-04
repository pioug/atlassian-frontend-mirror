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
