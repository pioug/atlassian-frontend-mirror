import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import FlexibleCard from '../../../../FlexibleCard';
import {
  ActionItem,
  CustomActionItem,
} from '../../../../FlexibleCard/components/blocks/types';
import { messages } from '../../../../../messages';
import {
  CustomBlock,
  PreviewBlock,
} from '../../../../FlexibleCard/components/blocks';
import { HoverCardForbiddenProps } from './types';
import { extractProvider } from '@atlaskit/link-extractors';
import {
  connectButtonStyles,
  mainTextStyles,
  titleBlockStyles,
} from './styled';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import { ActionName } from '../../../../../constants';
import { getPreviewBlockStyles } from '../../../styled';
import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';

const HoverCardForbiddenView: React.FC<HoverCardForbiddenProps> = ({
  flexibleCardProps,
  testId = 'hover-card-forbidden-view',
}) => {
  const { cardState, url } = flexibleCardProps;
  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const meta = cardState.details?.meta as JsonLd.Meta.BaseMeta;
  const product = extractProvider(data)?.text ?? '';
  const hostname = new URL(url).hostname;

  const { action, descriptiveMessageKey, titleMessageKey } =
    extractRequestAccessContextImproved({
      jsonLd: meta,
      url,
      product,
    });

  const actions = useMemo<ActionItem[]>(
    () => [
      {
        name: ActionName.CustomAction,
        content: action?.text,
        onClick: action?.promise,
      } as CustomActionItem,
    ],
    [action],
  );

  if (!titleMessageKey || !descriptiveMessageKey) {
    return null;
  }

  return (
    <FlexibleCard {...flexibleCardProps} testId={testId}>
      <PreviewBlock
        ignoreContainerPadding={true}
        overrideCss={getPreviewBlockStyles()}
        testId={testId}
      />
      <CustomBlock overrideCss={titleBlockStyles} testId={`${testId}-title`}>
        <FormattedMessage {...messages[titleMessageKey]} values={{ product }} />
      </CustomBlock>
      <CustomBlock overrideCss={mainTextStyles} testId={`${testId}-content`}>
        <FormattedMessage
          {...messages[descriptiveMessageKey]}
          values={{ product, hostname }}
        />
      </CustomBlock>
      {action && (
        <CustomBlock
          overrideCss={connectButtonStyles}
          testId={`${testId}-button`}
        >
          <ActionGroup items={actions} appearance="primary" />
        </CustomBlock>
      )}
    </FlexibleCard>
  );
};

export default HoverCardForbiddenView;
