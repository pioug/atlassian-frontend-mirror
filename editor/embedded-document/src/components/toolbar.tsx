import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button';
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
	padding: `0 ${token('space.250')}`,
	height: token('space.1000'),
});

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: { editorActions?: any; mode: Mode }): React.JSX.Element => {
	const { mode, editorActions } = props;

	return (
		<WithDocumentActions
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			render={(actions) => {
				switch (mode) {
					case 'edit':
					case 'create':
						return (
							<ButtonGroup>
								<Button
									appearance="primary"
									// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
									onClick={async () => {
										// Ignored via go/ees005
										// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
										const value = await editorActions!.getValue();
										try {
											await (mode === 'create'
												? actions.createDocument(value)
												: actions.updateDocument(value));
											// eslint-disable-next-line no-unused-vars
										} catch (err) {}
									}}
									// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
								>
									Publish
								</Button>
								{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */}
								<Button appearance="subtle" onClick={() => actions.cancelEdit()}>
									Close
								</Button>
							</ButtonGroup>
						);

					default:
						return (
							<Toolbar>
								<ButtonGroup>
									{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */}
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
