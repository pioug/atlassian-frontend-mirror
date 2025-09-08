import type { IntlShape } from 'react-intl-next';

import type {
	Command,
	FloatingToolbarHandler,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';

const basicButton = (
	formatMessage: IntlShape['formatMessage'],
): Array<FloatingToolbarItem<Command>> => {
	return [
		{
			id: 'placeholder',
			type: 'button',
			onClick: () => {
				return true;
			},
			title: formatMessage({
				id: 'placeholder',
				defaultMessage: 'Message',
				description: 'Placeholder description.',
			}),
		},
	];
};

export const getToolbarConfig = (): FloatingToolbarHandler => (state, intl) => {
	const { formatMessage } = intl;

	// placeholder nodeType
	const nodeType = [state.schema.nodes.paragraph];

	const basicButtonArray = basicButton(formatMessage);

	return {
		title: 'Floating controls',
		nodeType,
		items: [...basicButtonArray, { type: 'separator' }],
		scrollable: true,
	};
};
