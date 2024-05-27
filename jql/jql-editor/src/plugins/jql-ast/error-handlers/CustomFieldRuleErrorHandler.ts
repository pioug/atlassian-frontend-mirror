import { type IntlShape } from 'react-intl-next';

import { errorMessages } from '../messages';

/**
 * Show the appropriate error message when parsing JQL fails and a custom field rule was expected.
 */
export const handleCustomFieldRuleError = (intl: IntlShape): string => {
  return intl.formatMessage(errorMessages.expectingCustomFieldId);
};
