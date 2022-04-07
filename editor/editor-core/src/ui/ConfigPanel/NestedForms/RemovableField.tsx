/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { gridSize } from '@atlaskit/theme/constants';

import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import * as colors from '@atlaskit/theme/colors';

import { messages } from '../messages';

const removableFieldWrapper = css`
  position: relative;
  margin-bottom: 0;
`;

const wrapperWithMarginBottom = css`
  margin-bottom: ${gridSize() * 2}px;
`;

const removeButtonWrapper = css`
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
} & WrappedComponentProps;

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
    <div
      css={[removableFieldWrapper, hasMarginBottom && wrapperWithMarginBottom]}
      className={className}
    >
      {children}
      {canRemoveField && (
        <div
          css={removeButtonWrapper}
          data-testid={`remove-field-${name}`}
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
        </div>
      )}
    </div>
  );
};

export default injectIntl(RemovableField);
