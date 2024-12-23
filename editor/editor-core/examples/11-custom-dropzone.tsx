import React from 'react';

import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';

type State = {
	dropzoneRef?: HTMLElement;
};

const mediaProvider = storyMediaProviderFactory();

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class DemoEditor extends React.PureComponent<any, State> {
	state: State = {};

	private handleDropzoneRef = (ref: HTMLDivElement) => {
		this.setState({ dropzoneRef: ref });
	};

	render() {
		const { dropzoneRef } = this.state;
		const editor = !dropzoneRef ? null : (
			<Editor
				appearance="comment"
				quickInsert={true}
				media={{
					provider: mediaProvider,
					customDropzoneContainer: dropzoneRef,
				}}
			/>
		);

		return (
			<div>
				<div
					ref={this.handleDropzoneRef}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						background: '#172B4D',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						height: 80,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'flex',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						flexDirection: 'row',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						alignItems: 'center',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						justifyContent: 'center',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						margin: token('space.150', '12px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						borderRadius: '25px',
					}}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<h4 style={{ textAlign: 'center', color: '#FFF' }}>Drag and Drop files here</h4>
				</div>
				{editor}
			</div>
		);
	}
}

export default function Example() {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex' }}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginRight: token('space.150', '12px') }}>
				<DemoEditor />
			</div>
			<div style={{}}>
				<DemoEditor />
			</div>
		</div>
	);
}
