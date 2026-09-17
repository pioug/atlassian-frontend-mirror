import React from 'react';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { render } from '@atlassian/testing-library/render';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';

import { initialDoc } from '../../../../__tests__/__fixtures__/initial-doc';
import { RendererActionsContext, RendererContext } from '../../index';
import { Renderer } from '../../../../entry-points/renderer-default';
import RendererActions from '../../../../actions/index';

describe('Registering renderer actions', () => {
	it('should capture and report a11y violations', async () => {
		const actions = new RendererActions();
		const extensionHandlers: ExtensionHandlers = {
			'fake.confluence': (ext) => {
				return (
					<RendererContext.Provider value={actions}>
						<Renderer
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
		// React reports the error thrown while rendering to the console before rethrowing it
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(
				<RendererActionsContext>
					<>
						<Renderer document={initialDoc} />
						<Renderer document={initialDoc} />
					</>
				</RendererActionsContext>,
			);
		}).toThrow(
			`Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.`,
		);

		consoleErrorSpy.mockRestore();
	});

	it('can register a single Renderer instance', () => {
		expect(() => {
			render(
				<RendererActionsContext>
					<Renderer document={initialDoc} />
				</RendererActionsContext>,
			);
		}).not.toThrow();
	});

	it('can render multiple Renderers without a wrapping context', () => {
		expect(() => {
			render(
				<>
					<Renderer document={initialDoc} />
					<Renderer document={initialDoc} />
				</>,
			);
		}).not.toThrow();
	});

	describe('nested renderers', () => {
		it('the nested renderers actions are registered with the root renderers doc', async () => {
			const actions = new RendererActions();

			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (ext) => {
					return (
						<RendererContext.Provider value={actions}>
							<Renderer
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
