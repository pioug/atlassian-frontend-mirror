import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

  ${createEditorUseOnlyNotice('Editor Plugin Avatar Group', [
		{ name: 'Editor Core', link: '/packages/editor/editor-core' },
	])}

  ${(
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		</>
	)}

  This package includes the avatar group plugin used by @atlaskit/editor-core.

  ## Usage
---

${code`
export type AvatarGroupPluginOptions = {
  collabEdit?: CollabEditOptions;
  showAvatarGroup?: boolean;
  takeFullWidth: boolean;
};

export type AvatarGroupPluginDependencies = [
  OptionalPlugin<FeatureFlagsPlugin>,
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<CollabEditPlugin>,
  OptionalPlugin<PrimaryToolbarPlugin>,
];

export type AvatarGroupPlugin = NextEditorPlugin<
  'avatarGroup',
  {
    actions: {
      getToolbarItem: ({
        inviteToEditHandler,
        isInviteToEditButtonSelected,
        inviteToEditComponent,
      }: CollabInviteToEditProps) => JSX.Element | null;
    };
    dependencies: AvatarGroupPluginDependencies;
    pluginConfiguration: AvatarGroupPluginOptions;
  }
>;
`}

  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
`;
export default _default_1;
