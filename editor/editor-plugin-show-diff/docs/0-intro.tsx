import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- md template from @atlaskit/docs
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Show Diff', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the show diff plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type ColorScheme = 'standard' | 'traditional';
export type DiffType = 'inline' | 'block';
export type DiffParams = {
	/**
	 * Color scheme to use for displaying diffs.
	 * 'standard' (default) uses purple for highlighting changes
	 * 'traditional' uses green for additions and red for deletions
	 */
	colorScheme?: ColorScheme;
	originalDoc: JSONDocNode;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: StepJson[];
};

export type PMDiffParams = {
	diffType?: DiffType;
	isInverted?: boolean;
	originalDoc: Node;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: Step[];
};

type ACTION = 'SHOW_DIFF' | 'HIDE_DIFF' | 'SCROLL_TO_NEXT' | 'SCROLL_TO_PREVIOUS';

type ShowDiffPlugin = NextEditorPlugin<
  'showDiff',
  {
    commands: {
      hideDiff: EditorCommand;
      scrollToNext: EditorCommand;
      scrollToPrevious: EditorCommand;
      showDiff: (config: PMDiffParams) => EditorCommand;
    };
    dependencies: [OptionalPlugin<AnalyticsPlugin>];
    pluginConfiguration: DiffParams | undefined;
    sharedState: {
      /**
       * The index of the current diff being viewed.
       */
      activeIndex?: number;
      /**
       * Whether the show diff feature is currently displaying changes.
       * Defaults to false.
       */
      isDisplayingChanges: boolean;
      /**
       * The number of changes being displayed
       */
      numberOfChanges?: number;
    };
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
export default _default_1;
