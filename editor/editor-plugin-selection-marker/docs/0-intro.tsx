import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Selection Marker', [
  { name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${(
    <div style={{ marginTop: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
  )}

  This package includes the selection marker plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:  

${code`
type SelectionMarkerPlugin = NextEditorPlugin<
  'selectionMarker',
  {
    dependencies: [FocusPlugin];
  }
>;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;

function AlternativePackagesMessage({
  alternatePackages,
}: React.PropsWithoutRef<{
  alternatePackages?: { name: string; link: string }[];
}>) {
  if (!alternatePackages) {
    return null;
  }
  if (alternatePackages.length === 1) {
    return (
      <p>
        Consider using{' '}
        <a href={alternatePackages[0].link}>{alternatePackages[0].name}</a>{' '}
        instead.
      </p>
    );
  }
  return (
    <p>
      Consider using one of these packages instead:
      <ul>
        {alternatePackages.map(p => (
          <li>
            <a href={p.link}>{p.name}</a>
          </li>
        ))}
      </ul>
    </p>
  );
}

export function createEditorUseOnlyNotice(
  componentName: string,
  alternatePackages?: { name: string; link: string }[],
) {
  return (
    <SectionMessage title="Internal Editor Use Only" appearance="error">
      <p>
        {componentName} is intended for internal use by the Editor Platform as a
        plugin dependency of the Editor within your product.
      </p>
      <p>Direct use of this component is not supported.</p>
      <AlternativePackagesMessage alternatePackages={alternatePackages} />
    </SectionMessage>
  );
}
