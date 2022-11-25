import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { CustomActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ActionName } from '../../../../constants';
import { messages } from '../../../../messages';

/**
 * Returns a CustomActionItem with a "Try Another Account" default message
 *
 * @see CustomActionItem
 * @param onAuthorize a function that will be called on the click of the button
 */
export const ForbiddenAction = (onAuthorize: () => void): CustomActionItem =>
  ({
    name: ActionName.CustomAction,
    content: <FormattedMessage {...messages.try_another_account} />,
    onClick: onAuthorize,
  } as CustomActionItem);
