import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import ReactSerializer from '../../../react';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

const schema = getSchemaBasedOnStage('stage0');

describe('ReactSerializer', () => {
	let serializer: ReactSerializer;

	beforeEach(() => {
		serializer = new ReactSerializer({});
	});

	describe('Block task items - parentIsIncompleteTask correctly calculated', () => {
		eeTest
			.describe('platform_editor_blocktaskitem_node', 'Block task item experiment enabled')
			.variant(true, () => {
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

		eeTest
			.describe('platform_editor_blocktaskitem_node', 'Block task item experiment enabled')
			.variant(false, () => {
				it('should handle nested nodes in blockTaskItem when experiment is disabled', () => {
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

					// The date should NOT inherit parentIsIncompleteTask=true from it's parent
					expect(dateCall).toBeDefined();
					if (dateCall) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const callArgs = dateCall as unknown as [
							any,
							{ parentInfo?: { parentIsIncompleteTask?: boolean } },
						];
						expect(callArgs[1].parentInfo?.parentIsIncompleteTask).toBe(false);
					}

					serializeFragmentChildSpy.mockRestore();
				});
			});
	});
});
