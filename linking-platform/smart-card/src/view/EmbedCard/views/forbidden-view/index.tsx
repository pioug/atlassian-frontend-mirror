import Button from '@atlaskit/button';
import React, { type FC, useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { messages } from '../../../../messages';
import { toMessage } from '../../../../utils/intl-utils';
import { LockImage } from '../../constants';
import UnresolvedView from '../unresolved-view';
import { ForbiddenViewProps } from './types';

const ForbiddenView: FC<ForbiddenViewProps> = ({
  context,
  inheritDimensions,
  isSelected,
  onAuthorise,
  onClick,
  requestAccessContext,
  testId = 'embed-card-forbidden-view',
  url,
}) => {
  const {
    accessType,
    hostname,
    titleMessageKey,
    descriptiveMessageKey,
    callToActionMessageKey,
    action,
  } = requestAccessContext ?? {};

  const values = useMemo(() => {
    const product = context?.text ?? '';
    return {
      context: product,
      product,
      hostname: <b>{hostname}</b>,
    };
  }, [hostname, context?.text]);

  const image = useMemo(() => context?.image ?? LockImage, [context?.image]);

  /**
   * if there is a request access context, but no action to perform, do not show any button.
   * By default, a "Try another account" button shows, but with request access context, we don't
   * want to encourage users to try another account, if their request is already pending, etc.
   */
  const button = useMemo(() => {
    const onEmbedCardClick = action?.promise ?? onAuthorise;
    if (!onEmbedCardClick) {
      return null;
    }

    return (
      <Button
        testId={`button-${action?.id || 'connect-other-account'}`}
        appearance="primary"
        onClick={onEmbedCardClick}
        isDisabled={accessType === 'PENDING_REQUEST_EXISTS'}
      >
        <FormattedMessage
          {...toMessage(messages.try_another_account, callToActionMessageKey)}
          values={values}
        />
      </Button>
    );
  }, [
    accessType,
    action?.id,
    action?.promise,
    callToActionMessageKey,
    onAuthorise,
    values,
  ]);

  return (
    <UnresolvedView
      icon={context?.icon}
      image={image}
      inheritDimensions={inheritDimensions}
      isSelected={isSelected}
      onClick={onClick}
      testId={testId}
      text={context?.text}
      title={
        <FormattedMessage
          {...toMessage(messages.invalid_permissions, titleMessageKey)}
          values={values}
        />
      }
      description={
        <FormattedMessage
          {...toMessage(
            messages.invalid_permissions_description,
            descriptiveMessageKey,
          )}
          values={values}
        />
      }
      button={button}
      url={url}
    />
  );
};

export default ForbiddenView;
