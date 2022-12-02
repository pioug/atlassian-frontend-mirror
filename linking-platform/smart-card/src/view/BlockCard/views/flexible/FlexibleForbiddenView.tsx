import React, { useMemo } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import { CustomBlock } from '../../../FlexibleCard/components/blocks';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import { messages } from '../../../../messages';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import BlockCardFooter from '../../components/flexible/footer';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ForbiddenAction } from '../../actions/flexible/ForbiddenAction';
import Text from '../../../FlexibleCard/components/elements/text';
import { SmartLinkStatus } from '../../../../constants';
import { FlexibleBlockCardProps } from './types';

/**
 * This view represent a Block Card with the 'Forbidden' status.
 * It should have a "Try another account" button that will allow a user to connect another account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleForbiddenView = ({
  cardState,
  onAuthorize,
  onClick,
  onError,
  testId = 'smart-block-forbidden-view',
  ui,
  url,
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;

  const actions = useMemo<ActionItem[]>(
    () => (onAuthorize ? [ForbiddenAction(onAuthorize)] : []),
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
      ui={ui}
      url={url}
    >
      <TitleBlock hideRetry={true} />
      <CustomBlock>
        <LockIcon
          label="forbidden-lock-icon"
          size="small"
          primaryColor={token('color.icon.danger', R300)}
          testId={`${testId}-lock-icon`}
        />
        <Text
          message={{
            descriptor: messages.invalid_permissions_description,
          }}
        />
      </CustomBlock>
      <CustomBlock>
        <BlockCardFooter actions={actions} status={status} />
      </CustomBlock>
    </FlexibleCard>
  );
};
export default FlexibleForbiddenView;
