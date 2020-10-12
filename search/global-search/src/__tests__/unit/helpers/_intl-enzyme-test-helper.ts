/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 *
 * Copied from https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';
import { getMessagesForLocale } from '../../../util/i18n-util';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider(
  { locale: 'en', messages: getMessagesForLocale('en') },
  {},
);
export const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node: JSX.Element) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(
  node: JSX.Element,
  { context = null, ...additionalOptions } = {},
) {
  return shallow(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    ...additionalOptions,
  });
}

export function mountWithIntl(
  node: JSX.Element,
  { context = null, childContextTypes = null, ...additionalOptions } = {},
) {
  return mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign(
      {},
      { intl: intlShape },
      childContextTypes,
    ),
    ...additionalOptions,
  });
}
