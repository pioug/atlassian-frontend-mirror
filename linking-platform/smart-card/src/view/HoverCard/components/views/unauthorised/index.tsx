import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import FlexibleCard from '../../../../FlexibleCard';
import {
  ActionItem,
  CustomActionItem,
} from '../../../../FlexibleCard/components/blocks/types';
import { messages } from '../../../../../messages';
import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import { HoverCardUnauthorisedProps } from './types';
import { extractProvider } from '@atlaskit/linking-common/extractors';
import {
  connectButtonStyles,
  mainTextStyles,
  titleBlockStyles,
} from './styled';
import UnauthorisedViewContent from '../../../../common/UnauthorisedViewContent';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import { LinkIcon } from '../../../../FlexibleCard/components/elements';
import { ActionName } from '../../../../../constants';

const HoverCardUnauthorisedView: React.FC<HoverCardUnauthorisedProps> = ({
  flexibleCardProps,
  testId = 'hover-card-unauthorised-view',
  onAuthorize,
}) => {
  const { cardState } = flexibleCardProps;
  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const providerName = extractProvider(data)?.text;

  const actions = useMemo<ActionItem[]>(
    () =>
      onAuthorize
        ? [
            {
              name: ActionName.CustomAction,
              content: (
                <FormattedMessage
                  {...messages.connect_unauthorised_account_action}
                  values={{ context: providerName }}
                />
              ),
              onClick: onAuthorize,
            } as CustomActionItem,
          ]
        : [],
    [onAuthorize, providerName],
  );

  return (
    <FlexibleCard {...flexibleCardProps} testId={testId}>
      <CustomBlock overrideCss={titleBlockStyles} testId={`${testId}-title`}>
        <LinkIcon />
        <FormattedMessage
          {...messages.connect_link_account_card_name}
          values={{ context: providerName }}
        />
      </CustomBlock>
      <CustomBlock overrideCss={mainTextStyles} testId={`${testId}-content`}>
        <div>
          <UnauthorisedViewContent providerName={providerName} />
        </div>
      </CustomBlock>
      <CustomBlock
        overrideCss={connectButtonStyles}
        testId={`${testId}-button`}
      >
        <ActionGroup items={actions} appearance="primary" />
      </CustomBlock>
    </FlexibleCard>
  );
};

export default HoverCardUnauthorisedView;
