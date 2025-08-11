import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';
import type {
	AnnotationProviders,
	InlineCommentViewComponentProps,
} from '@atlaskit/editor-common/types';
import RendererActions from '../../../../actions/index';
import { ProvidersContext } from '../../context';
import React from 'react';
import { AnnotationView } from '../../view';
import { mount } from 'enzyme';
import { RendererContext } from '../../../RendererActionsContext';
import { type JSONDocNode } from '@atlaskit/editor-json-transformer';
import { AnnotationTypes } from '@atlaskit/adf-schema';

jest.mock('../../hooks/use-events', () => ({
	useAnnotationClickEvent: jest.fn().mockReturnValue([
		{
			id: '',
			type: '',
		},
	]),
}));

describe('Annotation view component', () => {
	let providers: AnnotationProviders;
	let actionsFake: RendererActions;
	let updateSubscriberFake: AnnotationUpdateEmitter;
	let getStateFake: jest.Mock;
	let container: HTMLElement | null;

	const DummyComponent: React.ComponentType<
		React.PropsWithChildren<InlineCommentViewComponentProps>
	> = (_props) => {
		return <div></div>;
	};

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
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container!);
		container = null;
		jest.clearAllMocks();
	});

	it(`should pass delete annotation as props to the view component`, () => {
		const wrapper = mount(
			<ProvidersContext.Provider value={providers}>
				<AnnotationView isNestedRender={false} />
			</ProvidersContext.Provider>,
		);

		expect(wrapper.find('DummyComponent').prop('deleteAnnotation')).toBeDefined();
	});

	it(`should call delete annotation of renderer action
    context when delete annotation prop method is called`, () => {
		const wrapper = mount(
			<RendererContext.Provider value={actionsFake}>
				<ProvidersContext.Provider value={providers}>
					<AnnotationView isNestedRender={false} />
				</ProvidersContext.Provider>
			</RendererContext.Provider>,
		);
		const deleteAnnotationPropMethod: InlineCommentViewComponentProps['deleteAnnotation'] = wrapper
			.find('DummyComponent')
			.prop('deleteAnnotation');
		const result = deleteAnnotationPropMethod({
			id: 'annotation-id',
			type: AnnotationTypes.INLINE_COMMENT,
		});

		expect(RendererActions.prototype.deleteAnnotation).toHaveBeenCalledTimes(1);
		expect(result && result.doc).toEqual(adfDoc);
	});
});
