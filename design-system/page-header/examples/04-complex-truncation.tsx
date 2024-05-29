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
    <BreadcrumbsItem text="Projects" key="Projects" />
    <BreadcrumbsItem text="Accessibility" key="Accessibility" />
  </Breadcrumbs>
);
const actionsContent = (
  <ButtonGroup label="Content actions">
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
);
const barContent = (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={{ display: 'flex' }}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
      Don't truncate your page titles as it's not accessible, people won't be
      able to read your really long title describing what content to expect on
      the page, especially on smaller screen sizes.
    </PageHeader>
  );
};

export default PageHeaderComplexTruncationExample;
