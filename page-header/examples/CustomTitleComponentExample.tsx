import React from 'react';
import styled from 'styled-components';

import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import { colors } from '@atlaskit/theme';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
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
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        placeholder="Choose an option"
        aria-label="Choose an option"
      />
    </div>
  </div>
);

const ReadView = styled.div`
  font-size: 24px;
  font-weight: 500;
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
`;

const EditView = styled.input`
  font-size: 24px;
  font-weight: 500;
  box-sizing: border-box;
  cursor: inherit;
  outline: none;
  padding: 6px 6px;
  width: 100%;
  border: 2px solid ${colors.N40};
  border-radius: 3px;

  :focus {
    border: 2px solid ${colors.B100};
  }
`;

const CustomTitleComponent = () => {
  return (
    <InlineEdit
      readView={() => <ReadView>Editable title</ReadView>}
      editView={(props, ref) => <EditView {...props} innerRef={ref} />}
      defaultValue="Editable title"
      onConfirm={() => {}}
    />
  );
};

export default () => (
  <PageHeader
    breadcrumbs={breadcrumbs}
    bottomBar={barContent}
    actions={actionsContent}
    disableTitleStyles
  >
    <CustomTitleComponent />
  </PageHeader>
);
