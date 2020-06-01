import React from 'react';

import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { N40A } from '@atlaskit/theme/colors';

import { ExtensionManifest } from '@atlaskit/editor-common';
import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

// eslint-disable-next-line import/no-cycle
import FormContent from '../FormContent';
import { OnBlur } from '../types';

const ActionsWrapper = styled.div`
  border-top: 1px solid ${N40A};
  margin-top: ${multiply(gridSize, 2)}px;
  padding-top: ${multiply(gridSize, 2)}px;
`;

const NestedFormWrapper = styled.div`
  margin: ${multiply(gridSize, 2)}px 0;
  padding: ${multiply(gridSize, 2)}px;
  border: 1px solid ${N40A};
  border-radius: 4px;

  &:first-child {
    margin-top: 0;
  }
`;

type Props = {
  label: string;
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  children?: React.ReactNode;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
};

const FormWrapper = ({
  label,
  fields,
  parameters,
  extensionManifest,
  canRemoveFields,
  onClickRemove,
  children,
  onFieldBlur,
  firstVisibleFieldName,
}: Props) => {
  return (
    <NestedFormWrapper>
      <h5>{label}</h5>

      <FormContent
        fields={fields}
        extensionManifest={extensionManifest}
        parameters={parameters}
        canRemoveFields={canRemoveFields}
        onClickRemove={onClickRemove}
        onFieldBlur={onFieldBlur}
        firstVisibleFieldName={firstVisibleFieldName}
      />

      {children && (
        <ActionsWrapper testId="fieldset-actions">{children}</ActionsWrapper>
      )}
    </NestedFormWrapper>
  );
};

export default FormWrapper;
