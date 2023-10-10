import React, { useMemo } from 'react';
import { JsonLd } from 'json-ld-types';
import FlexibleCard from '../../../FlexibleCard';
import {
  CustomBlock,
  PreviewBlock,
  TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import { messages } from '../../../../messages';
import LockIcon from '@atlaskit/icon/glyph/lock';
import BlockCardFooter from '../../components/flexible/footer';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ForbiddenAction } from '../../actions/flexible/ForbiddenAction';
import Text from '../../../FlexibleCard/components/elements/text';
import {
  MediaPlacement,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import { getForbiddenJsonLd } from '../../../../utils/jsonld';
import { extractProvider } from '@atlaskit/link-extractors';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';
import { extractRequestAccessContextImproved } from '../../../../extractors/common/context/extractAccessContext';
import { FormattedMessage } from 'react-intl-next';
import { forbiddenViewTitleStyle } from './styled';
import extractHostname from '../../../../extractors/common/hostname/extractHostname';

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
  url,
  titleBlockProps,
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;
  const details = cardState?.details;
  const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
  const provider = extractProvider(details?.data as JsonLd.Data.BaseData);
  const providerName = provider?.text || '';

  const messageContext = useMemo(() => {
    const hostname = <b>{extractHostname(url)}</b>;

    return { product: providerName, hostname };
  }, [providerName, url]);

  const requestAccessContext = useMemo(() => {
    return extractRequestAccessContextImproved({
      jsonLd: cardMetadata,
      url,
      product: providerName,
    });
  }, [cardMetadata, providerName, url]);

  const descriptiveMessageKey =
    requestAccessContext && requestAccessContext.descriptiveMessageKey
      ? requestAccessContext.descriptiveMessageKey
      : 'invalid_permissions_description';

  const { titleMessageKey, buttonDisabled } = requestAccessContext ?? {};

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
                messageContext,
                buttonDisabled,
              ),
            ]
          : [];
    }

    return [...tryAnotherAccountAction, ...actionFromAccessContext];
  }, [onAuthorize, requestAccessContext, messageContext, buttonDisabled]);

  return (
    <FlexibleCard
      appearance="block"
      cardState={cardState}
      onAuthorize={onAuthorize}
      onClick={onClick}
      onError={onError}
      testId={testId}
      ui={{ hideElevation: true, size: SmartLinkSize.Medium }}
      url={url}
    >
      {titleMessageKey ? (
        <CustomBlock
          overrideCss={forbiddenViewTitleStyle}
          testId={`${testId}-title`}
        >
          <a target={anchorTarget} href={url}>
            <FormattedMessage
              {...messages[titleMessageKey]}
              values={messageContext}
            />
          </a>
        </CustomBlock>
      ) : (
        <TitleBlock
          hideRetry={true}
          anchorTarget={anchorTarget}
          {...titleBlockProps}
        />
      )}
      <CustomBlock>
        <LockIcon
          label="forbidden-lock-icon"
          size="small"
          primaryColor={token('color.icon.danger', R300)}
          testId={`${testId}-lock-icon`}
        />
        <Text
          maxLines={2}
          message={{
            descriptor: messages[descriptiveMessageKey],
            values: messageContext,
          }}
        />
      </CustomBlock>
      <PreviewBlock
        placement={MediaPlacement.Right}
        ignoreContainerPadding={true}
      />
      <CustomBlock>
        <BlockCardFooter actions={actions} status={status} />
      </CustomBlock>
    </FlexibleCard>
  );
};
export default withFlexibleUIBlockCardStyle(FlexibleForbiddenView);
