import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/sticky-headers.adf.json';

import Sidebar from './helper/NavigationNext';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example(): React.JSX.Element {
	const [height, setHeight] = React.useState(30);
	return (
		<>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'fixed',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: 0,
					height: `${height}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					background: 'green',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					color: 'white',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					textAlign: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					lineHeight: '30px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					zIndex: 99,
				}}
			>
				Hello world <button onClick={() => setHeight(height * 1.5)}>bigger</button>{' '}
				<button onClick={() => setHeight(height * 0.8)}>smaller</button>
			</div>
			<Sidebar showSidebar={true}>
				{(additionalProps: object) => (
					<Renderer
						dataProviders={providerFactory}
						document={document}
						allowColumnSorting
						stickyHeaders={{
							offsetTop: height,
							show: true,
						}}
						{...additionalProps}
					/>
				)}
			</Sidebar>
		</>
	);
}
