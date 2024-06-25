import React from 'react';

import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';

import adf from '../example-helpers/templates/media-with-caption.adf.json';

import { default as FullPageExample } from './5-full-page';

export default class ExampleEditor extends React.Component {
	render() {
		const mediaOptions: MediaOptions = {
			allowMediaSingle: true,
			allowCaptions: true,
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
