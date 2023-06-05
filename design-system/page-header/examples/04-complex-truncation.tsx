import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import __noop from '@atlaskit/ds-lib/noop';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import PageHeader from '../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={__noop}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
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

const PageHeaderComplexTruncationExample = () => {
  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      actions={actionsContent}
      bottomBar={barContent}
      truncateTitle
    >
      Really long title describing what content to expect on the page that
      truncates when resizing the window
    </PageHeader>
  );
};

export default PageHeaderComplexTruncationExample;
