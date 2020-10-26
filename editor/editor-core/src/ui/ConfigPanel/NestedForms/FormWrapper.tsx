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

type Props = {
  label: string;
  parentName?: string;
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  children?: React.ReactNode;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
  showTitle?: boolean;
};

const FormWrapper = ({
  label,
  fields,
  parentName,
  parameters,
  extensionManifest,
  canRemoveFields,
  onClickRemove,
  children,
  onFieldBlur,
  firstVisibleFieldName,
  showTitle = true,
}: Props) => {
  return (
    <div>
      {showTitle && <h5>{label}</h5>}

      <FormContent
        fields={fields}
        parentName={parentName}
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
    </div>
  );
};

export default FormWrapper;
