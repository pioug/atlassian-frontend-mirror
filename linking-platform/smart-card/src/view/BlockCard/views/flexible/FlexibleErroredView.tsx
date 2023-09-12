import React, { useMemo } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import { messages } from '../../../../messages';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import BlockCardFooter from '../../components/flexible/footer';
import { RetryAction } from '../../actions/flexible/RetryAction';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { CustomBlock } from '../../../FlexibleCard/components/blocks';
import Text from '../../../FlexibleCard/components/elements/text';
import { SmartLinkStatus } from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * This view represents a Block Card with an 'Errored' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleErroredView = ({
  anchorTarget,
  cardState,
  onAuthorize,
  onError,
  url,
  onClick,
  testId = 'smart-block-errored-view',
  titleBlockProps,
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;

  const actions = useMemo<ActionItem[]>(
    () => (onAuthorize ? [RetryAction(onAuthorize)] : []),
    [onAuthorize],
  );

  return (
    <FlexibleCard
      appearance="block"
      cardState={cardState}
      onAuthorize={onAuthorize}
      onClick={onClick}
      onError={onError}
      testId={testId}
      ui={{ hideElevation: true }}
      url={url}
    >
      <TitleBlock
        hideRetry={true}
        anchorTarget={anchorTarget}
        {...titleBlockProps}
      />
      <CustomBlock>
        <WarningIcon
          label="errored-warning-icon"
          size="small"
          primaryColor={token('color.icon.warning', R300)}
          testId={`${testId}-warning-icon`}
        />
        <Text
          message={{
            descriptor: messages.could_not_load_link,
          }}
        />
      </CustomBlock>
      <CustomBlock>
        <BlockCardFooter actions={actions} status={status} />
      </CustomBlock>
    </FlexibleCard>
  );
};

export default withFlexibleUIBlockCardStyle(FlexibleErroredView);
