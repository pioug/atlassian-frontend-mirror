/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import { N80, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../messages';

const removableFieldWrapper = css`
  position: relative;
  margin-bottom: 0;
`;

const wrapperWithMarginBottom = css`
  margin-bottom: ${token('space.200', '16px')};
`;

const removeButtonWrapper = css`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  color: ${token('color.icon.subtle', N80)};

  &:hover {
    color: ${token('color.icon.danger', R300)};
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
