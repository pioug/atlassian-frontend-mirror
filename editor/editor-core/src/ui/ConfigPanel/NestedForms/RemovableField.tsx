import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';

import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import * as colors from '@atlaskit/theme/colors';

import { messages } from '../messages';

const RemovableFieldWrapper = styled.div`
  position: relative;
`;

const RemoveButtonWrapper = styled.div<{ testId: string }>`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  color: ${colors.N80};

  &:hover {
    color: ${colors.R300};
  }
`;

type Props = {
  name: string;
  onClickRemove: () => void;
  children: React.ReactNode;
} & InjectedIntlProps;

const RemovableField = ({ name, onClickRemove, children, intl }: Props) => (
  <RemovableFieldWrapper>
    {children}
    <RemoveButtonWrapper
      testId={`remove-field-${name}`}
      onClick={onClickRemove}
    >
      <Tooltip
        content={intl.formatMessage(messages.removeField)}
        position="left"
      >
        <CrossCircleIcon
          size="small"
          label={intl.formatMessage(messages.removeField)}
        />
      </Tooltip>
    </RemoveButtonWrapper>
  </RemovableFieldWrapper>
);

export default injectIntl(RemovableField);
