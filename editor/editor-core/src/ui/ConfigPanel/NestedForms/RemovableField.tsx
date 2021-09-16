import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import * as colors from '@atlaskit/theme/colors';

import { messages } from '../messages';

const RemovableFieldWrapper = styled.div<{ hasMarginBottom: Boolean }>`
  position: relative;
  margin-bottom: ${(props) => (props.hasMarginBottom ? gridSize() * 2 : 0)}px;
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
  onClickRemove?: (fieldName: string) => void;
  canRemoveField?: boolean;
  children: React.ReactElement;
  className?: string;
} & InjectedIntlProps;

const RemovableField = ({
  name,
  canRemoveField,
  onClickRemove,
  children,
  intl,
  className,
}: Props) => {
  const onClickCallback = React.useCallback(
    () => onClickRemove && onClickRemove(name),
    [name, onClickRemove],
  );

  const hasMarginBottom = children.props.field?.type !== 'expand';

  return (
    <RemovableFieldWrapper
      hasMarginBottom={hasMarginBottom}
      className={className}
    >
      {children}
      {canRemoveField && (
        <RemoveButtonWrapper
          testId={`remove-field-${name}`}
          onClick={onClickCallback}
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
      )}
    </RemovableFieldWrapper>
  );
};

export default injectIntl(RemovableField);
