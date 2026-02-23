import React from 'react';

import { IntlProvider } from 'react-intl-next';

import type { EditorProps } from '../editor';
import Editor from '../editor';
import EditorContext from '../ui/EditorContext';

const groupId = 'GROUP-ID1';

// These were used for the knobs addon, but stopped working after the Storybook 8 migration.
// You can read about how to bring back controls here: https://hello.atlassian.net/wiki/x/J5bdgwE
const controls = {
	allowUndoRedoButtons: {
		control: 'boolean' as const,
		name: 'Undo/Redo Buttons',
		defaultValue: false,
		group: groupId,
	},
	allowPanel: {
		control: 'boolean' as const,
		name: 'Panel',
		defaultValue: false,
		group: groupId,
	},
	appearance: {
		control: 'radio' as const,
		name: 'Appearance',
		defaultValue: 'full-page',
		options: {
			Comment: 'comment',
			'Full Page': 'full-page',
		},
		group: groupId,
	},
	allowTables: {
		control: 'object' as const,
		name: 'Table Options',
		defaultValue: {},
		group: groupId,
	},
} as const;

function WrapperEditorComponent(props: EditorProps) {
	const ChildKey = JSON.stringify(props);
	return (
		<EditorContext>
			<IntlProvider locale="en">
				<Editor
					key={ChildKey}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
				/>
			</IntlProvider>
		</EditorContext>
	);
}

const _default_1: {
	component: typeof Editor;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	decorators: ((...args: any) => any)[];
	title: string;
} = {
	title: 'Editor',
	component: Editor,
	decorators: [],
};
export default _default_1;

const Template = (args: EditorProps): React.JSX.Element => (
	<WrapperEditorComponent
		allowUndoRedoButtons={controls.allowUndoRedoButtons.defaultValue}
		allowPanel={controls.allowPanel.defaultValue}
		appearance={controls.appearance.defaultValue}
		allowTables={controls.allowTables.defaultValue}
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...args}
	/>
);

export const EditorExample = Template.bind({});
