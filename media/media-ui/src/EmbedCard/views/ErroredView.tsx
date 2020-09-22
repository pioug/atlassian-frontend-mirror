/** @jsx jsx */
import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { fontSize } from '@atlaskit/theme/constants';
import { R300 } from '@atlaskit/theme/colors';

import { Frame } from '../../BlockCard/components/Frame';
import { FormattedMessage } from 'react-intl';
import { messages } from '../../messages';
import { gs } from '../../BlockCard/utils';

export interface ErroredViewProps {
  onRetry?: (val: any) => void;
  isSelected?: boolean;
  testId?: string;
  inheritDimensions?: boolean;
}

export const ErroredView = ({
  onRetry,
  isSelected = false,
  testId = 'embed-card-errored-view',
  inheritDimensions,
}: ErroredViewProps) => (
  <Frame
    inheritDimensions={inheritDimensions}
    compact={true}
    isSelected={isSelected}
    testId={testId}
  >
    <ErrorIcon size="small" primaryColor={R300} label="error-icon" />
    <span
      css={{
        fontSize: `${fontSize()}px`,
        marginLeft: gs(0.5),
        marginRight: gs(0.5),
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        // Fallback options.
        maxHeight: gs(3),
      }}
    >
      <FormattedMessage {...messages.could_not_load_link} />
    </span>
    <Button
      testId="err-view-retry"
      appearance="link"
      spacing="none"
      onClick={onRetry}
    >
      <FormattedMessage {...messages.try_again} />
    </Button>
  </Frame>
);
