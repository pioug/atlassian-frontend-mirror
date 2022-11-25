import React from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import { messages } from '../../../../messages';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import Footer from '../../components/flexible/footer';
import Text from '../../../FlexibleCard/components/elements/text';
import { CustomBlock } from '../../../FlexibleCard/components/blocks';
import { SmartLinkStatus } from '../../../../constants';
import { FlexibleBlockCardProps } from './types';

/**
 * This view represents a Block Card with a 'Not_Found' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleNotFoundView = ({
  cardState,
  onAuthorize,
  onError,
  ui,
  url,
  onClick,
  testId = 'smart-block-not-found-view',
}: FlexibleBlockCardProps) => {
  const status = cardState.status as SmartLinkStatus;

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
        <WarningIcon
          label="not-found-warning-icon"
          size="small"
          primaryColor={token('color.icon.warning', R300)}
          testId={`${testId}-warning-icon`}
        />
        <Text
          message={{
            descriptor: messages.not_found_description,
          }}
          testId={testId}
        />
      </CustomBlock>
      <CustomBlock>
        <Footer status={status} />
      </CustomBlock>
    </FlexibleCard>
  );
};
export default FlexibleNotFoundView;
