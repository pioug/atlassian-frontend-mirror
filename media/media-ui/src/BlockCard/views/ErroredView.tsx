/** @jsx jsx */
import { jsx } from '@emotion/core';

import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { fontSize } from '@atlaskit/theme/constants';
import { R300 } from '@atlaskit/theme/colors';

import { Frame } from '../components/Frame';
import { gs } from '../utils';

export interface ErroredViewProps {
  onRetry?: (val: any) => void;
  isSelected?: boolean;
  testId?: string;
}

export const ErroredView = ({
  onRetry,
  isSelected = false,
  testId,
}: ErroredViewProps) => (
  <Frame compact={true} isSelected={isSelected} testId={testId}>
    <ErrorIcon size="small" primaryColor={R300} label="error-icon" />
    <span
      css={{
        fontSize: `${fontSize()}px`,
        marginLeft: gs(0.5),
        marginRight: gs(0.5),
      }}
    >
      We couldn't load this link for some reason.
    </span>
    <Button
      testId="err-view-retry"
      appearance="link"
      spacing="none"
      onClick={onRetry}
    >
      Try Again
    </Button>
  </Frame>
);
