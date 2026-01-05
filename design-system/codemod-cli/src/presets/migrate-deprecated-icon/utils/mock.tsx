export const mockMetadata = {
	coreIconMetadata: {
		capture: {
			keywords: ['capture', 'icon', 'focus', 'focus area', 'capture'],
			componentName: 'CaptureIcon',
			package: '@atlaskit/icon/core/capture',
			oldName: ['jira/capture'],
			replacement: { name: 'focus-area', location: '@atlaskit/icon' },
			categorization: 'single-purpose',
			usage: 'Reserved for representing Focus Areas.',
			team: 'Design System Team',
			status: 'deprecated',
		},
		'chart-matrix': {
			keywords: ['chart-matrix', 'chartmatrix', 'icon', 'dot chart', 'graph', 'matrix', ''],
			componentName: 'ChartMatrixIcon',
			package: '@atlaskit/icon/core/chart-matrix',
			replacement: { name: 'chart-bubble', location: '@atlaskit/icon' },
			categorization: 'multi-purpose',
			usage: 'Multi purpose - Known uses: Matrix view in in JPD, and other matrix charts.',
			team: 'Design System Team',
			status: 'deprecated',
		},
		close: {
			keywords: ['close', 'icon', 'cross', 'x', 'close', 'remove'],
			componentName: 'CloseIcon',
			package: '@atlaskit/icon/core/close',
			oldName: ['cross', 'editor/close'],
			replacement: { name: 'cross', location: '@atlaskit/icon' },
			categorization: 'multi-purpose',
			usage: 'Known uses: closing modals, panels, and transient views; removing tags',
			team: 'Design System Team',
			status: 'deprecated',
		},
		error: {
			keywords: [
				'error',
				'warning',
				'alert',
				'icon',
				'filled',
				'status',
				'danger',
				'exclamation',
				'!',
				'error',
			],
			componentName: 'ErrorIcon',
			package: '@atlaskit/icon/core/error',
			oldName: ['error'],
			replacement: { name: 'status-error', location: '@atlaskit/icon' },
			categorization: 'single-purpose',
			usage:
				'Reserved for error statuses and messaging. Filled status icons provide higher visual contrast to draw attention to important information.',
			team: 'Design System Team',
			status: 'deprecated',
		},
	},
};

export const mockDeprecatedIcons = {
	deprecatedCore: {
		'@atlaskit/icon/core/capture': {
			message:
				'The icon "capture" is deprecated in favour of "focus-area" from "@atlaskit/icon/core"',
		},
		'@atlaskit/icon/core/chart-matrix': {
			message:
				'The icon "chart-matrix" is deprecated in favour of "chart-bubble" from "@atlaskit/icon/core"',
		},
		'@atlaskit/icon/core/close': {
			message: 'The icon "close" is deprecated in favour of "cross" from "@atlaskit/icon/core"',
		},
		'@atlaskit/icon/core/error': {
			message:
				'The icon "error" is deprecated in favour of "status-error" from "@atlaskit/icon/core"',
		},
	},
};
