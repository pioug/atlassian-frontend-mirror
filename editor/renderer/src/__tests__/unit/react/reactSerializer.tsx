import React from 'react';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { screen } from '@atlassian/testing-library/screen';

import ReactSerializer from '../../../react';

const schema = getSchemaBasedOnStage('stage0');

type ExtensionPropsReader = {
	getExtensionProps: (node: ReturnType<typeof schema.nodeFromJSON>) => {
		hideExtensionKeysWhilePending?: string[];
	};
};

describe('ReactSerializer', () => {
	let serializer: ReactSerializer;

	beforeEach(() => {
		serializer = new ReactSerializer({});
	});

	it('passes extension keys to hide while a provider is pending to extension nodes', () => {
		const hideExtensionKeysWhilePending = ['extension-a'];
		const serializerWithPendingKeys = new ReactSerializer({ hideExtensionKeysWhilePending });
		const extensionNode = schema.nodeFromJSON({
			type: 'extension',
			attrs: {
				extensionKey: 'extension-a',
				extensionType: 'fake.extension',
			},
		});

		expect(
			(serializerWithPendingKeys as unknown as ExtensionPropsReader).getExtensionProps(
				extensionNode,
			),
		).toMatchObject({
			hideExtensionKeysWhilePending,
		});
	});

	describe('Block task items - parentIsIncompleteTask correctly calculated', () => {
		describe('Block task item experiment enabled', () => {
			it('should handle nested nodes in blockTaskItem when experiment is enabled', () => {
				const taskDoc = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'taskList',
							content: [
								{
									type: 'blockTaskItem',
									attrs: {
										localId: 'test-task-id',
										state: 'TODO',
									},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Task content',
												},
												{
													type: 'date',
													timestamp: '1603670400000',
												},
											],
										},
									],
								},
							],
							attrs: {
								localId: 'test-list-id',
							},
						},
					],
				};

				const docNode = schema.nodeFromJSON(taskDoc);

				// Spy on serializeFragmentChild to verify the parentIsIncompleteTask logic
				const serializeFragmentChildSpy = jest.spyOn(serializer as any, 'serializeFragmentChild');

				serializer.serializeFragment(docNode.content);

				// Verify that serializeFragmentChild was called
				expect(serializeFragmentChildSpy).toHaveBeenCalled();

				// Find calls for different node types
				const dateCall = serializeFragmentChildSpy.mock.calls.find(
					(call) => (call[0] as { type: { name: string } }).type.name === 'date',
				);

				expect(dateCall).toBeDefined();

				// The date should inherit parentIsIncompleteTask=true from it's parent
				expect(dateCall).toBeDefined();
				if (dateCall) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const callArgs = dateCall as unknown as [
						any,
						{ parentInfo?: { parentIsIncompleteTask?: boolean } },
					];
					expect(callArgs[1].parentInfo?.parentIsIncompleteTask).toBe(true);
				}

				serializeFragmentChildSpy.mockRestore();
			});
		});
	});

	it('lets a subclass wrap each node after its marks are applied', () => {
		const wrapped: { index: number; topLevel: boolean; type: string }[] = [];
		class WrappingSerializer extends ReactSerializer {
			protected wrapNode(
				element: JSX.Element | null,
				node: PMNode,
				index: number,
				parentInfo: { path: PMNode[] } | undefined,
			): JSX.Element | null {
				wrapped.push({ type: node.type.name, index, topLevel: !parentInfo });
				if (parentInfo) {
					return element;
				}
				return (
					<section key={element?.key ?? undefined} data-testid={`block-${index}`}>
						{element}
					</section>
				);
			}
		}
		const doc = schema.nodeFromJSON({
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					marks: [{ type: 'alignment', attrs: { align: 'center' } }],
					content: [{ type: 'text', text: 'Centered' }],
				},
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item' }] }],
						},
					],
				},
			],
		});

		renderWithIntl(new WrappingSerializer({}).serializeFragment(doc.content)!);

		// Every node except text reaches the hook, children before their parents; only top-level ones
		// have no parent.
		expect(wrapped).toEqual([
			{ type: 'paragraph', index: 0, topLevel: true },
			{ type: 'paragraph', index: 0, topLevel: false },
			{ type: 'listItem', index: 0, topLevel: false },
			{ type: 'bulletList', index: 1, topLevel: true },
		]);
		expect(screen.getByTestId('block-0').firstElementChild).toHaveClass('fabric-editor-alignment');
		expect(screen.getByTestId('block-0')).toHaveTextContent('Centered');
		expect(screen.getByTestId('block-1')).toHaveTextContent('Item');
	});
});
