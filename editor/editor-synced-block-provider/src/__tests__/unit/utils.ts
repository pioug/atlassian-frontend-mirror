import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	convertSyncBlockPMNodeToSyncBlockData,
	stripAnnotationMarksFromJSONContent,
} from '../../utils/utils';

describe('convertSyncBlockPMNodeToSyncBlockData', () => {
	it('normalizes panel_c1 to panel before storing sync block content', () => {
		const node = {
			attrs: {
				localId: 'local-id',
				resourceId: 'resource-id',
			},
			content: {
				toJSON: () => [
					{
						type: 'layoutSection',
						content: [
							{
								type: 'layoutColumn',
								content: [
									{
										type: 'panel_c1',
										attrs: {
											panelType: 'info',
										},
										content: [
											{
												type: 'paragraph',
												content: [
													{
														type: 'text',
														text: 'Hello world',
														marks: [
															{
																type: 'annotation',
																attrs: { id: 'annotation-id' },
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		} as unknown as PMNode;

		expect(convertSyncBlockPMNodeToSyncBlockData(node)).toEqual({
			blockInstanceId: 'local-id',
			resourceId: 'resource-id',
			content: [
				{
					type: 'layoutSection',
					content: [
						{
							type: 'layoutColumn',
							content: [
								{
									type: 'panel',
									attrs: {
										panelType: 'info',
									},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Hello world',
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		});
	});

	it('keeps panel_c1 when only stripping annotation marks', () => {
		expect(
			stripAnnotationMarksFromJSONContent([
				{
					type: 'panel_c1',
					attrs: {
						panelType: 'info',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Hello world',
									marks: [
										{
											type: 'annotation',
											attrs: { id: 'annotation-id' },
										},
									],
								},
							],
						},
					],
				},
			]),
		).toEqual([
			{
				type: 'panel_c1',
				attrs: {
					panelType: 'info',
				},
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Hello world',
							},
						],
					},
				],
			},
		]);
	});
});
