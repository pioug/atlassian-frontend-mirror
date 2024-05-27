import React, { useMemo } from 'react';
import { messages } from '../../../../messages';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { RetryAction } from '../../actions/flexible/RetryAction';
import { type ActionItem } from '../../../FlexibleCard/components/blocks/types';
import Text from '../../../FlexibleCard/components/elements/text';
import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * This view represents a Block Card with an 'Errored' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleErroredView = ({
  testId = 'smart-block-errored-view',
  ...props
}: FlexibleBlockCardProps) => {
  const actions = useMemo<ActionItem[]>(
    () => (props.onAuthorize ? [RetryAction(props.onAuthorize)] : []),
    [props.onAuthorize],
  );

  return (
    <UnresolvedView {...props} actions={actions} testId={testId}>
      <WarningIcon
        label="errored-warning-icon"
        size="small"
        primaryColor={token('color.icon.warning', R300)}
        testId={`${testId}-warning-icon`}
      />
      <Text
        maxLines={3}
        message={{
          descriptor: messages.could_not_load_link,
        }}
      />
    </UnresolvedView>
  );
};

export default withFlexibleUIBlockCardStyle(FlexibleErroredView);
