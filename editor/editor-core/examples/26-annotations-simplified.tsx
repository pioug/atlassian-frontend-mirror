import React from 'react';

import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import {
	ExampleCreateInlineCommentComponent,
	ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-helpers';

import { exampleDocumentWithText } from '../example-helpers/example-doc-with-text';

import { default as FullPageExample } from './5-full-page';

const emitter = new AnnotationUpdateEmitter();

export default function ExampleAnnotationExperiment(): React.JSX.Element {
	return (
		<FullPageExample
			key={1}
			editorProps={{
				defaultValue: exampleDocumentWithText,
				allowHelpDialog: true,
				annotationProviders: {
					inlineComment: {
						createComponent: ExampleCreateInlineCommentComponent,
						viewComponent: ExampleViewInlineCommentComponent,
						updateSubscriber: emitter,
						getState: async (annotationsIds: string[]) => {
							return annotationsIds.map((id) => ({
								id,
								annotationType: 'inlineComment',
								state: { resolved: false },
							})) as any;
						},
						disallowOnWhitespace: true,
					},
				},
			}}
		/>
	);
}
