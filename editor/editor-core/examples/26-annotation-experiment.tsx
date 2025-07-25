import React from 'react';

import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import {
	ExampleCreateInlineCommentComponent,
	ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-helpers';
import { token } from '@atlaskit/tokens';

import { exampleDocumentWithComments } from '../example-helpers/example-doc-with-comments';

import { default as FullPageExample } from './5-full-page';

const emitter = new AnnotationUpdateEmitter();

function AnnotationCheckbox(props: {
	id: string;
	checked: boolean;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const { id, checked, onChange } = props;
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<label style={{ display: 'block', lineHeight: '2em' }} htmlFor={id}>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input onChange={onChange} type="checkbox" id={id} checked={checked} />
			{id}
		</label>
	);
}

function EnableAnnotationTypeCheckbox(props: {
	id: string;
	checked: boolean;
	type: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const { id, checked, onChange, type } = props;
	return (
		<label htmlFor={id}>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input onChange={onChange} type="checkbox" id={id} checked={checked} />
			Enable {type}
		</label>
	);
}

function EnableDisallowOnWhiteSpaceCheckbox(props: {
	id: string;
	checked: boolean;
	type: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const { id, checked, onChange, type } = props;
	return (
		<label htmlFor={id}>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input onChange={onChange} type="checkbox" id={id} checked={checked} />
			{type}
		</label>
	);
}

type State = {
	annotationStates: Map<string, boolean>;
	isInlineCommentsEnabled: boolean;
	isDisallowOnWhiteSpaceEnabled: boolean;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export default class ExampleAnnotationExperiment extends React.Component<any, State> {
	state = {
		isInlineCommentsEnabled: true,
		isDisallowOnWhiteSpaceEnabled: false,
		annotationStates: new Map([
			['12e213d7-badd-4c2a-881e-f5d6b9af3752', false],
			['9714aedf-5300-43f4-ac10-a2e4326189d2', true],
			['13272b41-b9a9-427a-bd58-c00766999638', false],
			['68ac8f3f-2fb6-4720-8439-c9da1f17b0b2', true],
			['80f91695-4e24-433d-93e1-6458b8bb2415', false],
			['f963dc2a-797c-445d-9703-9381c82ccf55', true],
			['be3e7d44-053d-454b-93d2-2575c6fca2c1', false],
			['abb3279e-109a-4a05-b8b7-111363d81041', true],
			['98666c34-f666-49be-b17d-d01d112b5c1b', false],
			['d1257edc-604a-4f8a-b3fa-8e24cbd0894b', false],
			['75a321e5-ee26-41c2-8ef1-c81849df3f40', false],
			['eef53b24-17c6-46e8-bab4-6f0b0478e80a', true],
			['93e89148-ad5c-4bdd-965f-60b91b0e7774', true],
			['422510e2-3bff-4b67-a87f-e24e3ef38fe0', false],
			['9704428e-1b22-4bdd-8948-967658fda9b8', true],
			['a4ca35cb-8964-4f5a-b7ad-101c82c789f4', true],
		]),
	};

	inlineCommentGetState = async (annotationsIds: string[]) => {
		const { annotationStates } = this.state;
		return annotationsIds.map((id) => ({
			id,
			annotationType: AnnotationTypes.INLINE_COMMENT,
			state: { resolved: annotationStates.get(id) || false },
		}));
	};

	handleAnnotationChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const { id } = evt.target;
		const newState = !this.state.annotationStates.get(id);
		this.setState((prevState: State) => {
			prevState.annotationStates.set(id, newState);
			return prevState;
		});
		emitter.emit(newState ? 'resolve' : 'unresolve', id);
	};

	handleOnOffChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = evt.target;

		this.setState((prevState: State) => {
			return {
				isInlineCommentsEnabled: checked,
			};
		});

		emitter.emit('setvisibility', checked);
	};

	handleWhiteSpaceOnOffChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = evt.target;

		this.setState((prevState: State) => {
			return {
				isDisallowOnWhiteSpaceEnabled: checked,
			};
		});
	};

	/**
	 * Mimics behaviour of Confluence comments button - this will look for
	 * the first comment in the document and open it
	 */
	handleShowInlineComments = () => {
		const firstComment = document.querySelector(
			'.ak-editor-annotation-focus,.ak-editor-annotation-blur',
		);

		if (firstComment) {
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const firstCommentID = (firstComment.closest('.annotationView-content-wrap') as HTMLElement)
				.id;
			emitter.emit('setselectedannotation', firstCommentID);
		}
	};

	render() {
		const { annotationStates, isInlineCommentsEnabled, isDisallowOnWhiteSpaceEnabled } = this.state;

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ display: 'flex', height: '100%' }}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ flex: '20%', padding: token('space.200', '16px') }}>
					<h3>Annotations</h3>
					<button onClick={this.handleShowInlineComments}>Show inline comments</button>
					<div>
						<EnableAnnotationTypeCheckbox
							id="enable-inline-comments"
							checked={isInlineCommentsEnabled}
							onChange={this.handleOnOffChange}
							type="Inline Comments"
						/>
					</div>
					<div>
						<EnableDisallowOnWhiteSpaceCheckbox
							id="enable-disallow-on-whitespace"
							checked={isDisallowOnWhiteSpaceEnabled}
							onChange={this.handleWhiteSpaceOnOffChange}
							// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
							type="Disallow on white space"
						/>
					</div>
					Checked == resolved
					{[...annotationStates.entries()].map(([key, val]) => (
						<AnnotationCheckbox
							id={key}
							key={key}
							checked={val}
							onChange={this.handleAnnotationChange}
						/>
					))}
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ flex: '80%' }}>
					<FullPageExample
						key={this.state.isDisallowOnWhiteSpaceEnabled ? 1 : 0}
						editorProps={{
							defaultValue: exampleDocumentWithComments,
							allowHelpDialog: true,
							annotationProviders: {
								inlineComment: {
									createComponent: ExampleCreateInlineCommentComponent,
									viewComponent: ExampleViewInlineCommentComponent,
									updateSubscriber: emitter,
									getState: this.inlineCommentGetState,
									disallowOnWhitespace: this.state.isDisallowOnWhiteSpaceEnabled,
								},
							},
						}}
					/>
				</div>
			</div>
		);
	}
}
