import React, { useMemo } from 'react';
import { JsonLd } from 'json-ld-types';
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
import { getForbiddenJsonLd } from '../../../../utils/jsonld';
import { extractProvider } from '@atlaskit/link-extractors';
import { extractRequestAccessContext } from '../../../../extractors/common/context';

/**
 * This view represent a Block Card with the 'Forbidden' status.
 * It should have a "Try another account" button that will allow a user to connect another account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleForbiddenView = ({
  anchorTarget,
  cardState,
  onAuthorize,
  onClick,
  onError,
  testId = 'smart-block-forbidden-view',
  ui,
  url,
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;
  const details = cardState?.details;
  const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
  const provider = extractProvider(details?.data as JsonLd.Data.BaseData);
  const providerName = provider?.text || '';

  const requestAccessContext = extractRequestAccessContext({
    jsonLd: cardMetadata,
    url,
    context: providerName,
  });

  const descriptiveMessageKey =
    requestAccessContext && requestAccessContext.descriptiveMessageKey
      ? requestAccessContext.descriptiveMessageKey
      : 'invalid_permissions_description';

  const actions = useMemo<ActionItem[]>(() => {
    let actionFromAccessContext: ActionItem[] = [];
    const tryAnotherAccountAction = onAuthorize
      ? [ForbiddenAction(onAuthorize, 'try_another_account')]
      : [];

    if (requestAccessContext) {
      const { action, callToActionMessageKey } = requestAccessContext;

      actionFromAccessContext =
        action && callToActionMessageKey
          ? [
              ForbiddenAction(
                action.promise,
                callToActionMessageKey,
                providerName,
              ),
            ]
          : [];
    }

    return [...tryAnotherAccountAction, ...actionFromAccessContext];
  }, [onAuthorize, requestAccessContext, providerName]);

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
      <TitleBlock hideRetry={true} anchorTarget={anchorTarget} />
      <CustomBlock>
        <LockIcon
          label="forbidden-lock-icon"
          size="small"
          primaryColor={token('color.icon.danger', R300)}
          testId={`${testId}-lock-icon`}
        />
        <Text
          message={{
            descriptor: messages[descriptiveMessageKey],
            values: { context: providerName },
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
