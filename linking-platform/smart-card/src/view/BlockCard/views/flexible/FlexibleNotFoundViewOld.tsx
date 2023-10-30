import React from 'react';
import { messages } from '../../../../messages';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import Text from '../../../FlexibleCard/components/elements/text';
import { FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * This view represents a Block Card with a 'Not_Found' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleNotFoundViewOld = ({
  testId = 'smart-block-not-found-view',
  ...props
}: FlexibleBlockCardProps) => (
  <UnresolvedView {...props} testId={testId}>
    <WarningIcon
      label="not-found-warning-icon"
      size="small"
      primaryColor={token('color.icon.warning', R300)}
      testId={`${testId}-warning-icon`}
    />
    <Text
      message={{ descriptor: messages.not_found_description }}
      testId={`${testId}-message`}
    />
  </UnresolvedView>
);

/**
 * @private
 * @deprecated {@link https://product-fabric.atlassian.net/browse/EDM-7977 Internal documentation for deprecation (no external access)}
 * @deprecated Replaced by FlexibleNotFoundView
 */
export default withFlexibleUIBlockCardStyle(FlexibleNotFoundViewOld);
