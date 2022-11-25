import React, { useMemo } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import { messages } from '../../../../messages';
import Text from '../../../FlexibleCard/components/elements/text';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { AuthorizeAction } from '../../actions/flexible/AuthorizeAction';
import Footer from '../../components/flexible/footer';
import { CustomBlock } from '../../../FlexibleCard/components/blocks';
import { SmartLinkStatus } from '../../../../constants';
import { FlexibleBlockCardProps } from './types';

/**
 * This view represents a Block card that has an 'Unauthorized' status .
 * It should have a "Connect" button that will allow a user to connect their account and view the block card.
 *
 * @see SmartLinkStatus
 * @see UnauthorisedViewProps
 */
const FlexibleUnauthorisedView = ({
  cardState,
  providerName = '',
  onAuthorize,
  onClick,
  onError,
  testId = 'smart-block-unauthorized-view',
  ui,
  url,
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;

  const actions = useMemo<ActionItem[]>(
    () => (onAuthorize ? [AuthorizeAction(onAuthorize)] : []),
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
        <Text
          message={{
            descriptor: messages.connect_link_account_card_description,
            values: {
              context: providerName,
            },
          }}
        />
      </CustomBlock>
      <CustomBlock>
        <Footer actions={actions} status={status} />
      </CustomBlock>
    </FlexibleCard>
  );
};

export default FlexibleUnauthorisedView;
