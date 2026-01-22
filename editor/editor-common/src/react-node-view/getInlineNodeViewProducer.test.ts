import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { getInlineNodeViewProducer, type CreateNodeViewOptions } from './getInlineNodeViewProducer';

/**
 * This file was identified as having accessibility violations.
 * The violations have been temporarily suppressed to allow for incremental fixing.
 * Please run accessibility checks and remove this suppression when all issues are resolved.
 */
skipAutoA11yFile();

// Mock the modules
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('getInlineNodeViewProducer', () => {
	let mockView: EditorView;
	let mockProps: CreateNodeViewOptions<{}>;

	beforeEach(() => {
		mockView = {
			// @ts-expect-error
			state: {},
			dispatch: jest.fn(),
		};
		jest.clearAllMocks();

		// Common test props
		mockProps = {
			pmPluginFactoryParams: {
				portalProviderAPI: {
					render: jest.fn(),
					remove: jest.fn(),
					destroy: jest.fn(),
				},
				// @ts-expect-error
				eventDispatcher: {
					emit: jest.fn(),
				},
			},
			Component: jest.fn(),
			extraComponentProps: {},
			extraNodeViewProps: {},
		};

		// Reset process.env.REACT_SSR
		delete process.env.REACT_SSR;
	});

	describe('when node type is not allowed', () => {
		it('should not create a virtualized node', () => {
			const nodeViewProducer = getInlineNodeViewProducer(mockProps);

			for (let i = 0; i < 100; i++) {
				const node = defaultSchema.nodes.placeholder.createAndFill();
				expect(node).toBeDefined();

				nodeViewProducer(node!, mockView, () => 1, []);
			}

			const node = defaultSchema.nodes.placeholder.createAndFill();
			expect(node).toBeDefined();

			const result = nodeViewProducer(node!, mockView, () => 1, []);

			expect(result).toHaveProperty('dom');
			expect(result.dom).not.toBeNull();
			expect(result.dom.firstChild).toBeNull();
		});
	});

	describe('when nodes are below the threshold', () => {
		it('should not create a virtualized node', () => {
			const nodeViewProducer = getInlineNodeViewProducer(mockProps);

			for (let i = 0; i < 100; i++) {
				const node = defaultSchema.nodes.inlineCard.createAndFill();
				expect(node).toBeDefined();

				const result = nodeViewProducer(node!, mockView, () => 1, []);

				expect(result).toHaveProperty('dom');
				expect(result.dom).not.toBeNull();
				expect(result.dom.firstChild).toBeNull();
			}
		});
	});

	describe('when nodes are above the threshold', () => {
		it('should create a virtualized node', () => {
			const nodeViewProducer = getInlineNodeViewProducer(mockProps);

			for (let i = 0; i < 100; i++) {
				const node = defaultSchema.nodes.inlineCard.createAndFill();
				expect(node).toBeDefined();

				nodeViewProducer(node!, mockView, () => 1, []);
			}

			const node = defaultSchema.nodes.inlineCard.createAndFill();
			expect(node).toBeDefined();

			const result = nodeViewProducer(node!, mockView, () => 1, []);

			expect(result).toHaveProperty('dom');
			expect(result.dom.firstChild).not.toBeNull();
		});
	});
});
