import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Tags are designed to be displayed within a [Tag Group](/components/tag-group).
  They can be rendered flat, as links, or with a close button.

  ## Usage

  Since 11.0.0, Tag is split into two types, \`SimpleTag\` and \`RemovableTag\`, for readonly tags you
  can use \`SimpleTag\` to get the highest performance and only pay for minimal bytes, especially when you have many tags to render.

  ### SimpleTag

  ${code`import Tag from '@atlaskit/tag/simple-tag';`}

  ${(
    <Example
      packageName="@atlaskit/tag"
      Component={require('../examples/0-basicTag').default}
      title="Simple Tag"
      source={require('!!raw-loader!../examples/0-basicTag')}
    />
  )}

  ### Props for SimpleTag

  ${(
    <Props
      heading="SImple Tag Props"
      props={require('!!extract-react-types-loader!../src/tag/simple-tag')}
    />
  )}

  ### RemovableTag

  When you want the full-featured \`Tag\` in previous versions, \`RemovableTag\` is what you need. It has all the
  supported props (we changed one of the props, and you can upgrade it with \`codemods\` shipped with the package easily)

  ${code`import Tag from '@atlaskit/tag/removable-tag';`}

  ${(
    <Example
      packageName="@atlaskit/tag"
      Component={require('../examples/0-removable-tag').default}
      title="Removable Tag"
      source={require('!!raw-loader!../examples/0-removable-tag')}
    />
  )}

  ### Props for RemovableTag

  ${(
    <Props
      heading="Removable Tag Props"
      props={require('!!extract-react-types-loader!../src/tag/removable-tag')}
    />
  )}
`;
