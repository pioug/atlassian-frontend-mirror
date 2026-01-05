import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/migrate-deprecated-icon';

// Mock the deprecatedCore import
jest.mock('@atlaskit/icon/deprecated-map', () => ({
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
}));

// Mock the deprecatedCore icon lab import
jest.mock('@atlaskit/icon-lab/deprecated-map', () => ({
	deprecatedCore: {
		'@atlaskit/icon-lab/core/roadmaps-plan': {
			message:
				'The icon "roadmaps-plan" is deprecated in favour of "plan" from “@atlaskit/icon-lab/core”',
		},
		'@atlaskit/icon-lab/core/roadmaps-service': {
			message:
				'The icon "roadmaps-service" is deprecated in favour of "service" from “@atlaskit/icon-lab/core”',
		},
	},
}));

// Mock the coreIconMetadata import
jest.mock('@atlaskit/icon/metadata', () => ({
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
		cross: {
			keywords: ['cross', 'close', 'x', 'cancel', 'icon', 'cross', 'x', 'close', 'remove'],
			componentName: 'CrossIcon',
			package: '@atlaskit/icon/core/cross',
			oldName: ['cross', 'editor/close'],
			categorization: 'multi-purpose',
			usage: 'Known uses: closing modals, panels, and transient views; removing tags',
			team: 'Design System Team',
			status: 'published',
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
			categorization: 'single-purpose',
			usage:
				'Reserved for error statuses and messaging. Filled status icons provide higher visual contrast to draw attention to important information.',
			team: 'Design System Team',
			status: 'deprecated',
		},
	},
}));

// Mock the coreIconMetadata icon lab import
jest.mock('@atlaskit/icon-lab/metadata', () => ({
	'roadmaps-plan': {
		keywords: ['roadmaps-plan', 'roadmapsplan', 'icon', 'icon-lab', 'roadmaps', 'plan'],
		componentName: 'RoadmapsPlanIcon',
		package: '@atlaskit/icon-lab/core/roadmaps-plan',
		oldName: ['bitbucket/builds'],
		replacement: { name: 'plan', location: '@atlaskit/icon-lab' },
		categorization: 'single-purpose',
		usage: 'Reserved for representing plans.',
		team: 'Design System Team',
		status: 'deprecated',
	},
	'roadmaps-service': {
		keywords: [
			'roadmaps-service',
			'roadmapsservice',
			'icon',
			'icon-lab',
			'roadmaps',
			'service',
			'roadmap',
		],
		componentName: 'RoadmapsServiceIcon',
		package: '@atlaskit/icon-lab/core/roadmaps-service',
		oldName: ['bitbucket/forks'],
		replacement: { name: 'service', location: '@atlaskit/icon-lab' },
		categorization: 'single-purpose',
		usage: 'Reserved for roadmaps service.',
		team: 'Design System Team',
		status: 'deprecated',
	},
}));

const check = createCheck(transformer);

describe('Migrate deprecated icon to replacement icon', () => {
	check({
		it: 'should migrate deprecated icon with replacement',
		original: `
	        import CaptureIcon from '@atlaskit/icon/core/capture';

	        export default () => <CaptureIcon label="" />;
	    `,
		expected: `
	        import FocusAreaIcon from '@atlaskit/icon/core/focus-area';

	        export default () => <FocusAreaIcon label="" />;
	    `,
	});
	check({
		it: 'should migrate deprecated icon from icon lab with replacement',
		original: `
            import RoadmapsPlanIcon from '@atlaskit/icon-lab/core/roadmaps-plan';

            export default () => <RoadmapsPlanIcon label="" />;
        `,
		expected: `
            import PlanIcon from '@atlaskit/icon-lab/core/plan';

            export default () => <PlanIcon label="" />;
        `,
	});
	check({
		it: 'should only migrate deprecated icons with replacement and leave others untouched',
		original: `
			import CrossIcon from '@atlaskit/icon/core/cross';
	        import CaptureIcon from '@atlaskit/icon/core/capture';

	        export default () => <>
				<CrossIcon label="" />;
				<CaptureIcon label="" />;
			</>
	    `,
		expected: `
			import CrossIcon from '@atlaskit/icon/core/cross';
			import FocusAreaIcon from '@atlaskit/icon/core/focus-area';

	        export default () => <>
				<CrossIcon label="" />;
				<FocusAreaIcon label="" />;
			</>
	    `,
	});
	check({
		it: 'should leave deprecated icons without replacement untouched',
		original: `
			import ErrorIcon from '@atlaskit/icon/core/error';
	        import CaptureIcon from '@atlaskit/icon/core/capture';

	        export default () => <>
				<ErrorIcon label="" />;
				<CaptureIcon label="" />;
			</>
	    `,
		expected: `
			import ErrorIcon from '@atlaskit/icon/core/error';
	        import FocusAreaIcon from '@atlaskit/icon/core/focus-area';

	        export default () => <>
				<ErrorIcon label="" />;
				<FocusAreaIcon label="" />;
			</>
	    `,
	});
	check({
		it: 'should migrate deprecated icon with replacement',
		original: `
			import { IconButton } from '@atlaskit/button/new';
	        import CaptureIcon from '@atlaskit/icon/core/capture';

	        export default () => <IconButton icon={CaptureIcon} label="Edit" />;
	    `,
		expected: `
			import { IconButton } from '@atlaskit/button/new';
			import FocusAreaIcon from '@atlaskit/icon/core/focus-area';

	        export default () => <IconButton icon={FocusAreaIcon} label="Edit" />;
	    `,
	});
});
