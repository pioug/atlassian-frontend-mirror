/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { messages } from '../messages';

export const expandContainer = css`
  border-bottom: 1px solid ${token('color.border', N40)};
`;

export const expandControl = css`
  display: flex;
  height: ${token('space.600', '48px')};
  justify-content: center;
  padding-right: ${token('space.100', '8px')};
`;

const chevronContainer = css`
  display: flex;
  align-items: center;

  & > button {
    width: ${token('space.300', '24px')};
    height: ${token('space.300', '24px')};
  }
`;

const labelContainer = css`
  width: 100%;
  align-items: center;
  display: flex;
  font-weight: 500;
`;

const expandContentContainer = (isHidden: boolean) => css`
  display: ${isHidden ? 'none' : 'block'};
  margin-top: ${token('space.negative.100', '-8px')};
`;

type Props = {
  field: FieldDefinition;
  children: React.ReactNode;
  isExpanded?: boolean;
} & WrappedComponentProps;

function Expand({ field, children, isExpanded = false, intl }: Props) {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <div data-testid="expand-config-field" css={expandContainer}>
      <div css={expandControl}>
        <div css={labelContainer}>{field.label}</div>
        <div css={chevronContainer}>
          <Button
            onClick={() => {
              setExpanded(!expanded);
            }}
            testId="form-expand-toggle"
            iconBefore={
              expanded ? (
                <ChevronDownIcon
                  label={intl.formatMessage(messages.collapse)}
                />
              ) : (
                <ChevronRightIcon label={intl.formatMessage(messages.expand)} />
              )
            }
          />
        </div>
      </div>
      <div
        data-testid="expand-content-container"
        css={expandContentContainer(!expanded)}
      >
        {children}
      </div>
    </div>
  );
}

export default injectIntl(Expand);
