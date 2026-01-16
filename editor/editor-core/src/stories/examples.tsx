import React from 'react';

import { boolean, object, radios, withKnobs } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl-next';

import type { EditorProps } from '../editor';
import Editor from '../editor';
import EditorContext from '../ui/EditorContext';

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
	decorators: [withKnobs],
};
export default _default_1;

const groupId = 'GROUP-ID1';
const Template = (args: EditorProps): React.JSX.Element => (
	<WrapperEditorComponent
		allowUndoRedoButtons={boolean('Undo/Redo Buttons', false, groupId)}
		allowPanel={boolean('Panel', false, groupId)}
		appearance={radios(
			'Appearance',
			{
				Comment: 'comment',
				'Full Page': 'full-page',
			},
			'full-page',
			groupId,
		)}
		allowTables={object('Table Options', {}, groupId)}
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...args}
	/>
);

export const EditorExample = Template.bind({});
