import React from 'react';

import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';

import adf from '../example-helpers/templates/media-without-caption.adf.json';

import { default as FullPageExample } from './5-full-page';

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export default class ExampleEditor extends React.Component {
	render(): React.JSX.Element {
		const mediaOptions: MediaOptions = {
			allowMediaSingle: true,
			allowCaptions: false,
		};

		return (
			<FullPageExample
				editorProps={{
					defaultValue: adf,
					allowHelpDialog: true,
					media: mediaOptions,
				}}
			/>
		);
	}
}
