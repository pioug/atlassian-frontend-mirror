import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
   IntlMessagesProvider is a Frontend Utility to asynchronously load i18n translated messages and feed them to IntlProvider based on the locale in product.

   ## Installation

  ${code`yarn add @atlaskit/intl-messages-provider`}

   ## Usage

  ${code`
      import { IntlMessagesProvider } from "@atlaskit/intl-messages-provider";
      import messages from '../../i18n/en';

      // Use a callback function to async load the translations from your package
      const fetchMessages = async (locale:  string) => {
        const i18n = await import(\`../../i18n/\${locale}\`);
        return i18n.default
      }

      const YourComposedComponent = (props: YourComponentProps) => {
        return (
          <IntlMessagesProvider defaultMessages={messages} loaderFn={fetchMessages}>
            <YourComponent {...props}>
          </IntlMessagesProvider>
        )
      }
  `}

  ${(<Props heading="Props" props={require('!!extract-react-types-loader!../src/ui')} />)}

  ## Examples
  ${(
		<Example
			packageName="@atlaskit/intl-messages-provider"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}
`;
export default _default_1;
