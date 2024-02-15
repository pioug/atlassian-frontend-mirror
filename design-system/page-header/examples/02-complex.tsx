import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import PageHeader from '../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={__noop}>
    <BreadcrumbsItem text="Teams" key="Teams" />
    <BreadcrumbsItem text="Design System Team" key="Design System Team" />
  </Breadcrumbs>
);
const actionsContent = (
  <ButtonGroup label="Content actions">
    <Button appearance="primary">Edit page</Button>
    <Button>Share</Button>
    <Button>...</Button>
  </ButtonGroup>
);
const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <div style={{ flex: '0 0 200px', marginLeft: token('space.100', '8px') }}>
      <Select
        spacing="compact"
        placeholder="Choose an option"
        aria-label="Choose an option"
      />
    </div>
  </div>
);

const PageHeaderComplexExample = () => {
  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      actions={actionsContent}
      bottomBar={barContent}
    >
      Introducing the Design System Team
    </PageHeader>
  );
};

export default PageHeaderComplexExample;
