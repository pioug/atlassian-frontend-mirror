import { defineMessages } from 'react-intl';

export const colorAccessibilityMessages: {
	accessibility: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	accessibleLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	accessibleTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	difficultToReadLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	difficultToReadTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inaccessibleLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inaccessibleTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	accessibility: {
		id: 'fabric.editor.color.accessibility.accessibility',
		defaultMessage: 'Accessibility',
		description: 'Label for the accessibility status in the combined text highlight and color menu.',
	},
	accessibleLabel: {
		id: 'fabric.editor.color.accessibility.accessibleLabel',
		defaultMessage: 'Accessible',
		description: 'Label for the accessibility status when the color combination is accessible.',
	},
	accessibleTooltip: {
		id: 'fabric.editor.color.accessibility.accessibleTooltip',
		defaultMessage: 'Accessible color combination',
		description: 'Tooltip content for the accessibility status when the color combination is accessible.',
	},
	difficultToReadLabel: {
		id: 'fabric.editor.color.accessibility.difficultToReadLabel',
		defaultMessage: 'Difficult to read',
		description: 'Label for the accessibility status when the color combination is difficult to read.',
	},
	difficultToReadTooltip: {
		id: 'fabric.editor.color.accessibility.difficultToReadTooltip',
		defaultMessage: 'This color combination has low contrast. Select a different color to improve legibility.',
		description: 'Tooltip content for the accessibility status when the color combination is difficult to read.',
	},
	inaccessibleLabel: {
		id: 'fabric.editor.color.accessibility.inaccessibleLabel',
		defaultMessage: 'Inaccessible',
		description: 'Label for the accessibility status when the color combination is inaccessible.',
	},
	inaccessibleTooltip: {
		id: 'fabric.editor.color.accessibility.inaccessibleTooltip',
		defaultMessage: 'This color combination is hard to read. Select a different color to improve legibility.',
		description: 'Tooltip content for the accessibility status when the color combination is inaccessible.',
	},
});
