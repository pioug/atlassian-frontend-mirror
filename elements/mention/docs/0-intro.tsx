import React from 'react';
import { md, Props, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

import SimpleMentionExample from '../examples/00-simple-mention-item';
const SimpleMentionSource = require('!!raw-loader!../examples/00-simple-mention-item');

const MentionProps = require('!!extract-react-types-loader!../src/components/Mention');

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}
  
  The main purpose of the mention component is to provide a mention picker for choosing users to mention within a text field or editor.

  It includes support for rest based searching and custom search implementations.

  ## Usage

  Import the component in your React app as follows:

  ${code`
  import { MentionTypeAhead } from '@atlaskit/mention/typeahead';
  import { MentionResource } from '@atlaskit/mention/resource';

  const mentionProvider = new MentionResource({
    url: 'http://example-mention-server/service',
    securityProvider: () => {
      return {
          headers: {
              Authorization: getSecurityTokenForService(...)
          }
      };
    },
    refreshSecurityProvider: () => {
      // Optional, but allows for a retry if a 401 is returned by trying a new token
      // useful if a token is not guaranteed to be valid. e.g. stored in a cache, but
      // may be revoked to expire early in some circumstances
      return new Promise((resolve) => {
        ...
        getSecurityTokenForService(...).then((token) => {
          resolve(token);
        })
      })
    },
  });

  ReactDOM.render(
    <MentionTypeAhead
      resourceProvider={mentionProvider}
      query="John"
      onSelection={(mention) => { /* do something */ }}
    />, container);`}

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  If a \`target\` property is provided with a \`position\` property, then the
  Picker will automatically be positioned floating above that element. The \`target\`
  is a id of an element on the page. \`position\` may be one of \`above\`,
  \`below\` or \`auto\`.

  If these are omitted, the picker will be rendered
  directly inline, and any positioning will need to be managed by the consumer.
  An optional \`zIndex\` may be provided, if required to ensure that MentionPicker
  appears above other elements on the page. The MentionPicker will be rendered
  at the bottom of the DOM.

  Key navigation can be bound to \`selectNext\` (e.g. down arrow),
  \`selectPrevious\` (e.g. up arrow), and \`chooseCurrentSelection\`
  (e.g. enter and tab).

  ${(
		<Example
			packageName="@atlaskit/mention"
			Component={SimpleMentionExample}
			title="Simple Mention"
			source={SimpleMentionSource}
		/>
	)}

  ## Mention chip variants

  The \`<Mention>\` chip has four visual variants:

  - **Default** — a neutral chip rendered for any in-scope mention.
  - **Self** — emphasised brand-coloured chip rendered when \`isHighlighted\`
    is set, typically used to highlight a mention of the current user.
  - **Restricted** — outlined chip rendered when the mention's
    \`accessLevel\` indicates the referenced user does not have access; on
    hover the chip surfaces a "no access" tooltip.
  - **Disabled** — muted grey chip rendered when \`isDisabled\` is set.
    Click handlers are suppressed, the chip exposes
    \`aria-disabled="true"\`, and (with a \`disabledTooltip\` set) hover or
    keyboard focus surfaces an ADS tooltip explaining why the chip is
    disabled. The disabled chip remains keyboard-focusable so screen-reader
    users encounter it and hear the reason.

  Inside the editor, the disabled state is driven by
  \`MentionProvider.getMentionDisabledState({ id })\` so rendering surfaces
  don't need to thread per-chip props through ProseMirror node views.

  ${(<Props props={MentionProps} />)}

`;
export default _default_1;
