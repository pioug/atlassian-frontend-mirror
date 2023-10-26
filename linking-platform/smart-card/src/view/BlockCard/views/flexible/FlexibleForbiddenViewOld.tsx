import React, { useMemo } from 'react';
import { JsonLd } from 'json-ld-types';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';
import { messages } from '../../../../messages';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ForbiddenAction } from '../../actions/flexible/ForbiddenAction';
import Text from '../../../FlexibleCard/components/elements/text';
import { FlexibleBlockCardProps } from './types';
import { getForbiddenJsonLd } from '../../../../utils/jsonld';
import { extractProvider } from '@atlaskit/link-extractors';
import { extractRequestAccessContext } from '../../../../extractors/common/context';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * @private
 * @deprecated {@link https://product-fabric.atlassian.net/browse/EDM-7977 Internal documentation for deprecation (no external access)}
 * @deprecated Replaced by FlexibleForbiddenView
 */
const FlexibleForbiddenView = ({
  testId = 'smart-block-forbidden-view',
  ...props
}: FlexibleBlockCardProps) => {
  const { cardState, onAuthorize, url } = props;

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
              ForbiddenAction(action.promise, callToActionMessageKey, {
                context: providerName,
              }),
            ]
          : [];
    }

    return [...tryAnotherAccountAction, ...actionFromAccessContext];
  }, [onAuthorize, requestAccessContext, providerName]);

  return (
    <UnresolvedView {...props} actions={actions} testId={testId}>
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
    </UnresolvedView>
  );
};

/**
 * @private
 * @deprecated {@link https://product-fabric.atlassian.net/browse/EDM-7977 Internal documentation for deprecation (no external access)}
 * @deprecated Replaced by FlexibleForbiddenView
 */
export default withFlexibleUIBlockCardStyle(FlexibleForbiddenView);
