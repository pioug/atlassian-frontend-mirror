/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IntlProvider } from 'react-intl';
import Page from '@atlaskit/page';
import { InlineCardResolvedView } from '../src/InlineCard';

interface Lozenge {
  text: string;
  appearance: 'inprogress';
}

const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: 8px;
`;

const icon = 'broken-url';
const lozenge: Lozenge = {
  text: 'in progress',
  appearance: 'inprogress',
};

export default () => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
        <div style={{ padding: '30px' }}>
          <h6 css={subHeaderCSS}>Block card with default icon</h6>
          <InlineCardResolvedView
            isSelected={false}
            icon={icon}
            title="Smart Links - Designs"
            lozenge={lozenge}
          />
        </div>
      </Page>
    </IntlProvider>
  );
};
