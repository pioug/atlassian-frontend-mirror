/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment, useMemo } from 'react';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import type { FC } from 'react';
import type { LozengeActionErrorProps } from './types';
import { token } from '@atlaskit/tokens';
import { R50, R500 } from '@atlaskit/theme/colors';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { dropdownItemGroupStyles, contentStyles, textStyles } from './styled';
import { getFormattedMessage } from '../../../utils';

const MAX_LINE_NUMBER = 8;

const LozengeActionError: FC<LozengeActionErrorProps> = ({
  errorMessage,
  testId,
  maxLineNumber = MAX_LINE_NUMBER,
}) => {
  const content = useMemo(() => {
    return (
      <Fragment>
        <div css={contentStyles}>
          <ErrorIcon
            testId={`${testId}-icon`}
            size="medium"
            primaryColor={token('color.icon.danger', R500)}
            secondaryColor={token('color.background.danger', R50)}
            label={'error'}
          />
          <span
            css={textStyles(maxLineNumber)}
            data-testid={`${testId}-error-message`}
          >
            {typeof errorMessage === 'string'
              ? errorMessage
              : getFormattedMessage(errorMessage)}
          </span>
        </div>
      </Fragment>
    );
  }, [errorMessage, maxLineNumber, testId]);

  return (
    <span
      css={dropdownItemGroupStyles}
      data-testid={`${testId}-error-item-group`}
    >
      <DropdownItemGroup>
        <DropdownItem testId={`${testId}-error`}>{content}</DropdownItem>
      </DropdownItemGroup>
    </span>
  );
};

export default LozengeActionError;
