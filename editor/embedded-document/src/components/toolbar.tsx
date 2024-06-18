import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import WithDocumentActions from '../consumers/with-document-actions';
import type { Mode } from '../context/context';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Toolbar = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: `0 ${token('space.250', '20px')}`,
	height: token('space.1000', '80px'),
});

export default (props: { mode: Mode; editorActions?: any }) => {
	const { mode, editorActions } = props;

	return (
		<WithDocumentActions
			render={(actions) => {
				switch (mode) {
					case 'edit':
					case 'create':
						return (
							<ButtonGroup>
								<Button
									appearance="primary"
									onClick={async () => {
										const value = await editorActions!.getValue();
										try {
											await (mode === 'create'
												? actions.createDocument(value)
												: actions.updateDocument(value));
										} catch (err) {}
									}}
								>
									Publish
								</Button>
								<Button appearance="subtle" onClick={() => actions.cancelEdit()}>
									Close
								</Button>
							</ButtonGroup>
						);

					default:
						return (
							<Toolbar>
								<ButtonGroup>
									<Button appearance="primary" onClick={() => actions.editDocument()}>
										Edit
									</Button>
								</ButtonGroup>
							</Toolbar>
						);
				}
			}}
		/>
	);
};
