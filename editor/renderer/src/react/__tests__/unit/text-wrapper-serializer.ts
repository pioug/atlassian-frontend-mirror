// `TextWrapper` renders no position information into the DOM, so the serializer's output is
// asserted through the props it hands the component.
jest.mock('../../nodes/text-wrapper', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import TextWrapperComponent from '../../nodes/text-wrapper';
import { complexDocument as doc } from './__fixtures__/documents';

const textWrapper = TextWrapperComponent as unknown as jest.Mock;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - ReactSerializer - TextWrapperComponent', () => {
	let docFromSchema: PMNode;

	beforeAll(() => {
		docFromSchema = schema.nodeFromJSON(doc);
	});

	beforeEach(() => {
		textWrapper.mockClear();
	});

	describe('when surroundTextNodesWithTextWrapper is true', () => {
		it('should match TextWrapper position props with ProseMirror node positions', () => {
			const reactSerializer = new ReactSerializer({
				surroundTextNodesWithTextWrapper: true,
			});

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			renderWithIntl(reactSerializer.serializeFragment(docFromSchema.content) as any);

			let index = 0;
			docFromSchema.nodesBetween(0, docFromSchema.nodeSize - 2, (node, pos) => {
				if (node.type.name === 'codeBlock') {
					return false;
				}

				if (!node.isText) {
					return true;
				}

				const elementProps = textWrapper.mock.calls[index][0];

				index++;

				expect(node.text).toBe(elementProps.children);
				expect(pos).toBe(elementProps.startPos);
				expect(pos + node.nodeSize).toBe(elementProps.endPos);
			});
		});
	});

	describe('when surroundTextNodesWithTextWrapper is false', () => {
		it('should not create a text wrapper for each text content', () => {
			const reactSerializer = new ReactSerializer({
				surroundTextNodesWithTextWrapper: false,
			});

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			renderWithIntl(reactSerializer.serializeFragment(docFromSchema.content) as any);

			expect(textWrapper).not.toHaveBeenCalled();
		});
	});
});
