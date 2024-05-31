import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.full-page';
const LOCALSTORAGE_defaultTitleKey = 'fabric.editor.example.full-page.title';

import { default as Renderer } from '../src/ui/Renderer';
import Sidebar from './helper/NavigationNext';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default class ExampleRenderer extends React.Component {
	constructor(props: object) {
		super(props);

		// opens an iframe
		if (window.top && window.top !== window.self) {
			window.top.location.replace(location.href);
		}
	}

	render() {
		return (
			<Sidebar showSidebar={true}>
				{(additionalProps: object) => (
					<React.Fragment>
						<div
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								display: 'flex',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								justifyContent: 'flex-end',
							}}
						>
							<Button tabIndex={-1} onClick={this.handleRedirect}>
								Edit
							</Button>
						</div>
						<h1 style={{ margin: `${token('space.250', '20px')} 0` }}>
							{localStorage ? localStorage.getItem(LOCALSTORAGE_defaultTitleKey) : null}
						</h1>
						<Renderer
							dataProviders={providerFactory}
							{...additionalProps}
							extensionHandlers={extensionHandlers}
							document={
								localStorage
									? JSON.parse(localStorage.getItem(LOCALSTORAGE_defaultDocKey) || '{}')
									: undefined
							}
						/>
					</React.Fragment>
				)}
			</Sidebar>
		);
	}

	private handleRedirect = () => {
		location.href = location.href.replace('renderer', 'editor-core');
	};
}
