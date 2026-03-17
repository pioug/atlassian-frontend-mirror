import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`
${createEditorUseOnlyNotice('Editor Plugin Date', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}
  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

This package includes the date plugin used by \`@atlaskit/editor-core\`.

## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type DatePlugin = NextEditorPlugin<
  'date',
  {
    commands: {
      deleteDate: DeleteDate;
      insertDate: InsertDate;
    };
    dependencies: [
      typeof analyticsPlugin,
      EditorDisabledPlugin,
      OptionalPlugin<AnnotationPlugin>,
      OptionalPlugin<EditorViewModePlugin>,
    ];
    pluginConfiguration: DatePluginOptions | undefined;
    sharedState: DatePluginSharedState;
  }
>;

type DateSegment = 'day' | 'month' | 'year';

type DateType = {
  day?: number;
  month: number;
  year: number;
};

interface DatePluginOptions {
  weekStartDay?: WeekDay;
}

type DatePluginSharedState = {
  focusDateInput: boolean;
  isInitialised: boolean;
  isNew: boolean;
  showDatePickerAt?: number | null;
};

type InsertDate = (props: {
  commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD;
  date?: DateType;
  enterPressed?: boolean;
  inputMethod?: TOOLBAR_MENU_TYPE;
}) => EditorCommand;

type DeleteDate = EditorCommand;
`}

## Support
---

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
