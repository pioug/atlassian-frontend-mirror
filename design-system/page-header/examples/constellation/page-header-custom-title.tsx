import React from 'react';

import styled from 'styled-components';

import InlineEdit from '@atlaskit/inline-edit';
import { B100, N40 } from '@atlaskit/theme/colors';

import PageHeader from '../../src';

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
  border: 2px solid ${N40};
  border-radius: 3px;

  :focus {
    border: 2px solid ${B100};
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
  <PageHeader disableTitleStyles>
    <CustomTitleComponent />
  </PageHeader>
);
