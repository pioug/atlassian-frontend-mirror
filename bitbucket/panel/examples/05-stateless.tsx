import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Page, { Grid, GridColumn } from '@atlaskit/page';

import { PanelStateless } from '../src';

const Header = <span>This is stateless panel example</span>;

const StatelessPanel = () => {
  const isDefaultExpanded = false;
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  return (
    <IntlProvider locale="en">
      <Page>
        <Grid layout="fixed">
          <GridColumn medium={2} />
          <GridColumn medium={8}>
            <PanelStateless
              header={Header}
              isExpanded={isExpanded}
              onChange={setIsExpanded}
            >
              <p>
                Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
                ullamco deserunt aute id consequat veniam incididunt duis in
                sint irure nisi. Mollit officia cillum Lorem ullamco minim
                nostrud elit officia tempor esse quis.
              </p>
            </PanelStateless>
          </GridColumn>
        </Grid>
      </Page>
    </IntlProvider>
  );
};

export default StatelessPanel;
