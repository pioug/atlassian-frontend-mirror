/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const expandContainerStyles = css({
  borderBottom: `1px solid ${token('color.border', N40)}`,
});

const expandControlStyles = css({
  display: 'flex',
  height: token('space.600', '48px'),
  justifyContent: 'center',
  paddingRight: token('space.100', '8px'),
});

const chevronContainerStyles = css({
  display: 'flex',
  alignItems: 'center',

  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > button': {
    width: token('space.300', '24px'),
    height: token('space.300', '24px'),
  },
});

const labelContainerStyles = css({
  width: '100%',
  alignItems: 'center',
  display: 'flex',
  fontWeight: 500,
});

const expandContentContainerHiddenStyles = css({
  display: 'none',
  marginTop: token('space.negative.100', '-8px'),
});

const expandContentContainerVisibleStyles = css({
  display: 'block',
  marginTop: token('space.negative.100', '-8px'),
});

type Props = {
  field: FieldDefinition;
  children: React.ReactNode;
  isExpanded?: boolean;
} & WrappedComponentProps;

function Expand({ field, children, isExpanded = false, intl }: Props) {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <div data-testid="expand-config-field" css={expandContainerStyles}>
      <div css={expandControlStyles}>
        <div css={labelContainerStyles}>{field.label}</div>
        <div css={chevronContainerStyles}>
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
        css={
          expanded
            ? expandContentContainerVisibleStyles
            : expandContentContainerHiddenStyles
        }
      >
        {children}
      </div>
    </div>
  );
}

export default injectIntl(Expand);
