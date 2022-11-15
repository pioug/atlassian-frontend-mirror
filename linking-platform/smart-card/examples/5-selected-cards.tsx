import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Card } from '../src';

const defaultText = `{
  "@type": "Document",
  "generator": {
    "@type": "Application",
    "name": "Confluence"
  },
  "url": "https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424",
  "name": "Founder Update 76: Hello, Trello!",
  "summary": "Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)"
}`;

export default () => (
  <Page>
    <Grid>
      <GridColumn>
        <h3>Both cards are selected</h3>
        <p>
          Commodo laborum velit deserunt consectetur ullamco incididunt esse
          qui.
        </p>
        <p>
          <Card
            appearance="inline"
            isSelected={true}
            data={JSON.parse(defaultText)}
          />
        </p>
        <p>
          Commodo laborum velit deserunt consectetur ullamco incididunt esse
          qui.
        </p>
        <Card
          appearance="block"
          isSelected={true}
          data={JSON.parse(defaultText)}
        />
        <p>
          Commodo laborum velit deserunt consectetur ullamco incididunt esse
          qui.
        </p>
      </GridColumn>
    </Grid>
  </Page>
);
