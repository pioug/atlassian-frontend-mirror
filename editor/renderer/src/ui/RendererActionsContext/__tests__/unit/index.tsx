import React from 'react';
import { create, act } from 'react-test-renderer';
import { type DocNode } from '@atlaskit/adf-schema';
import { render } from '@testing-library/react';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import Renderer from '../../../Renderer';
import { initialDoc } from '../../../../__tests__/__fixtures__/initial-doc';
import { RendererActionsContext, RendererContext } from '../../index';
import { ReactRenderer } from '../../../../index';
import RendererActions from '../../../../actions/index';

describe('Registering renderer actions', () => {
	it('should capture and report a11y violations', async () => {
		const actions = new RendererActions();
		const extensionHandlers: ExtensionHandlers = {
			'fake.confluence': (ext) => {
				return (
					<RendererContext.Provider value={actions}>
						<ReactRenderer
							adfStage="stage0"
							document={{ type: 'doc', version: 1, content: ext.content as any }}
							allowAnnotations={false}
						/>
					</RendererContext.Provider>
				);
			},
		};

		const { container } = render(
			<RendererContext.Provider value={actions}>
				<Renderer document={exampleDocumentWithExtension} extensionHandlers={extensionHandlers} />
			</RendererContext.Provider>,
		);

		await expect(container).toBeAccessible();
	});

	it('cannot register two Renderer instances under the same context', () => {
		expect(() => {
			act(() => {
				create(
					<RendererActionsContext>
						<>
							<Renderer document={initialDoc} />
							<Renderer document={initialDoc} />
						</>
					</RendererActionsContext>,
				);
			});
		}).toThrowError(
			`Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.`,
		);
	});

	it('can register a single Renderer instance', () => {
		expect(() => {
			act(() => {
				create(
					<RendererActionsContext>
						<Renderer document={initialDoc} />
					</RendererActionsContext>,
				);
			});
		}).not.toThrowError();
	});

	it('can render multiple Renderers without a wrapping context', () => {
		expect(() => {
			act(() => {
				create(
					<>
						<Renderer document={initialDoc} />
						<Renderer document={initialDoc} />
					</>,
				);
			});
		}).not.toThrowError();
	});

	eeTest.describe('comment_on_bodied_extensions', 'nested renderers').variant(true, () => {
		it('the nested renderers actions are registered with the root renderers doc', async () => {
			const actions = new RendererActions();

			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (ext) => {
					return (
						<RendererContext.Provider value={actions}>
							<ReactRenderer
								adfStage="stage0"
								document={{ type: 'doc', version: 1, content: ext.content as any }}
								allowAnnotations={false}
							/>
						</RendererContext.Provider>
					);
				},
			};

			const actionsRegisterRendererSpy = jest.spyOn(actions, '_privateRegisterRenderer');

			render(
				<RendererContext.Provider value={actions}>
					<Renderer document={exampleDocumentWithExtension} extensionHandlers={extensionHandlers} />
				</RendererContext.Provider>,
			);

			expect(actionsRegisterRendererSpy).toHaveBeenCalledTimes(2);
			expect(actionsRegisterRendererSpy.mock.calls[0][1].toJSON().content).toMatchObject(
				exampleDocumentWithExtension.content,
			);
			expect(actionsRegisterRendererSpy.mock.calls[1][1].toJSON().content).toMatchObject(
				exampleDocumentWithExtension.content,
			);
		});
	});
});

const exampleDocumentWithExtension: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{ type: 'paragraph', content: [{ type: 'text', text: 'this is a paragraph' }] },
		{
			type: 'bodiedExtension',
			attrs: {
				extensionKey: 'bodied-eh',
				extensionType: 'fake.confluence',
				parameters: {},
			},
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'this is an example bodied extension' }],
				},
			],
		},
	],
};
