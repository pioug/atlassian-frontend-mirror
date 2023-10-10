import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import FlexibleCard from '../../../../FlexibleCard';
import { messages } from '../../../../../messages';
import {
  CustomBlock,
  PreviewBlock,
} from '../../../../FlexibleCard/components/blocks';
import { HoverCardForbiddenProps } from './types';
import Button from '@atlaskit/button';
import { extractProvider } from '@atlaskit/link-extractors';
import {
  connectButtonStyles,
  mainTextStyles,
  titleBlockStyles,
} from './styled';
import { getPreviewBlockStyles } from '../../../styled';
import { extractRequestAccessContextImproved } from '../../../../../extractors/common/context/extractAccessContext';
import extractHostname from '../../../../../extractors/common/hostname/extractHostname';

const HoverCardForbiddenView: React.FC<HoverCardForbiddenProps> = ({
  flexibleCardProps,
  testId = 'hover-card-forbidden-view',
}) => {
  const { cardState, url } = flexibleCardProps;
  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const meta = cardState.details?.meta as JsonLd.Meta.BaseMeta;
  const product = extractProvider(data)?.text ?? '';
  const hostname = <b>{extractHostname(url)}</b>;

  const { action, descriptiveMessageKey, titleMessageKey, buttonDisabled } =
    extractRequestAccessContextImproved({
      jsonLd: meta,
      url,
      product,
    }) ?? {};

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
          <Button
            onClick={action?.promise}
            appearance="primary"
            isDisabled={buttonDisabled}
          >
            {action?.text}
          </Button>
        </CustomBlock>
      )}
    </FlexibleCard>
  );
};

export default HoverCardForbiddenView;
