import React from 'react';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import ResourcedTaskItem from '../src/components/ResourcedTaskItem';
import { Grid, Item } from '../example-helpers/story-utils';

const mockTaskDecisionProvider = Promise.resolve(
  getMockTaskDecisionResource({ lag: 1000 }),
);
const mockTaskDecisionProviderError = Promise.resolve(
  getMockTaskDecisionResource({ error: true }),
);

export default () => (
  <Grid>
    <Item>
      <h3>Normal</h3>
      <div>
        <ResourcedTaskItem
          taskId="bff0c423-3bba-45c4-a310-d49f7a95003e"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          taskDecisionProvider={mockTaskDecisionProvider}
        >
          Have a Swedish Fika
        </ResourcedTaskItem>
        <hr />
        <ResourcedTaskItem
          taskId="bff0c423-3bba-45c4-a310-d49f7a95003e"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          taskDecisionProvider={mockTaskDecisionProvider}
        >
          Have a Swedish Fika
        </ResourcedTaskItem>
      </div>
    </Item>
    <Item>
      <h3>Error</h3>
      <div>
        <ResourcedTaskItem
          taskId="bff0c423-3bba-45c4-a310-d49f7a95003e"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          taskDecisionProvider={mockTaskDecisionProviderError}
        >
          Have a Swedish Fika
        </ResourcedTaskItem>
        <hr />
        <ResourcedTaskItem
          taskId="bff0c423-3bba-45c4-a310-d49f7a95003e"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          taskDecisionProvider={mockTaskDecisionProviderError}
        >
          Have a Swedish Fika
        </ResourcedTaskItem>
      </div>
    </Item>
  </Grid>
);
