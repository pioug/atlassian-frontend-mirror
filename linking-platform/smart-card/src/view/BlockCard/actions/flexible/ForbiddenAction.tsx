import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { CustomActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ActionName } from '../../../../constants';
import {
  MessageKey,
  messages,
  RequestAccessMessageKey,
} from '../../../../messages';

/**
 * Returns a CustomActionItem with a "Try Another Account" default message
 *
 * @see CustomActionItem
 * @param onClick a function that will be called on the click of the button
 * @param content is a message key for a message to be displayed in the action
 * @param context is a variable for a message in case a message contains a placeholder
 */
export const ForbiddenAction = (
  onClick: () => void,
  content: RequestAccessMessageKey | MessageKey,
  context?: string,
): CustomActionItem =>
  ({
    name: ActionName.CustomAction,
    content: <FormattedMessage {...messages[content]} values={{ context }} />,
    onClick: onClick,
  } as CustomActionItem);
