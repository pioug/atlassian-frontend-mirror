import React, { useCallback, useMemo } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { AuthorizeAction } from '../../actions/flexible/AuthorizeAction';
import BlockCardFooter from '../../components/flexible/footer';
import {
  CustomBlock,
  TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import { SmartLinkStatus } from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import { extractProvider } from '@atlaskit/linking-common/extractors';
import { JsonLd } from 'json-ld-types';
import UnauthorisedViewContent from '../../../common/UnauthorisedViewContent';
import { css } from '@emotion/react';
import { tokens } from '../../../../utils/token';

const contentStyles = css`
  color: ${tokens.text};
  margin-top: 0.5rem;
  font-size: 0.75rem;
`;

/**
 * This view represents a Block card that has an 'Unauthorized' status .
 * It should have a "Connect" button that will allow a user to connect their account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleUnauthorisedView = ({
  analytics,
  cardState,
  extensionKey = '',
  onAuthorize,
  onClick,
  onError,
  testId = 'smart-block-unauthorized-view',
  ui,
  url,
}: FlexibleBlockCardProps) => {
  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const providerName = extractProvider(data)?.text;

  const handleAuthorize = useCallback(() => {
    if (onAuthorize) {
      analytics.track.appAccountAuthStarted({
        extensionKey,
      });

      onAuthorize();
    }
  }, [onAuthorize, extensionKey, analytics.track]);

  const actions = useMemo<ActionItem[]>(
    () => (onAuthorize ? [AuthorizeAction(handleAuthorize, providerName)] : []),
    [handleAuthorize, onAuthorize, providerName],
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
      <CustomBlock overrideCss={contentStyles} testId={`${testId}-content`}>
        <div>
          <UnauthorisedViewContent
            providerName={providerName}
            analytics={analytics}
            testId={testId}
          />
        </div>
      </CustomBlock>
      <CustomBlock>
        <BlockCardFooter
          actions={actions}
          status={SmartLinkStatus.Unauthorized}
          actionGroupAppearance="primary"
        />
      </CustomBlock>
    </FlexibleCard>
  );
};

export default FlexibleUnauthorisedView;
