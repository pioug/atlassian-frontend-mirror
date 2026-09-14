import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';
import type {
	AnnotationProviders,
	InlineCommentViewComponentProps,
} from '@atlaskit/editor-common/types';
import RendererActions from '../../../../actions/index';
import { ProvidersContext } from '../../context';
import React from 'react';
import { AnnotationView } from '../../view';
import { render } from '@testing-library/react';
import { RendererContext } from '../../../RendererActionsContext';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';

jest.mock('../../hooks/use-events', () => ({
	useAnnotationClickEvent: jest.fn().mockReturnValue([
		{
			id: '',
			type: '',
		},
	]),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Annotation view component', () => {
	let providers: AnnotationProviders;
	let actionsFake: RendererActions;
	let updateSubscriberFake: AnnotationUpdateEmitter;
	let getStateFake: jest.Mock;

	const DummyComponent = jest.fn<
		React.ReactElement,
		[React.PropsWithChildren<InlineCommentViewComponentProps>]
	>(() => <div />);

	const viewComponentProps = () => DummyComponent.mock.lastCall?.[0];

	const adfDoc: JSONDocNode = {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'some',
				content: [],
			},
		],
	};

	beforeEach(() => {
		RendererActions.prototype.deleteAnnotation = jest.fn().mockReturnValue({ doc: adfDoc });
		actionsFake = new RendererActions();
		updateSubscriberFake = new AnnotationUpdateEmitter();
		providers = {
			inlineComment: {
				// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
				getState: getStateFake,
				updateSubscriber: updateSubscriberFake,
				viewComponent: DummyComponent,
			},
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it(`should pass delete annotation as props to the view component`, () => {
		render(
			<ProvidersContext.Provider value={providers}>
				<AnnotationView isNestedRender={false} />
			</ProvidersContext.Provider>,
		);

		expect((DummyComponent as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({ deleteAnnotation: expect.any(Function) }),
		);
	});

	it(`should call delete annotation of renderer action
    context when delete annotation prop method is called`, () => {
		render(
			<RendererContext.Provider value={actionsFake}>
				<ProvidersContext.Provider value={providers}>
					<AnnotationView isNestedRender={false} />
				</ProvidersContext.Provider>
			</RendererContext.Provider>,
		);
		const result = viewComponentProps()!.deleteAnnotation({
			id: 'annotation-id',
			type: AnnotationTypes.INLINE_COMMENT,
		});

		expect(RendererActions.prototype.deleteAnnotation).toHaveBeenCalledTimes(1);
		expect(result && result.doc).toEqual(adfDoc);
	});
});
