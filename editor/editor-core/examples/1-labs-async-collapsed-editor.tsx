import React from 'react';

import { IntlProvider } from 'react-intl-next';

import CollapsedEditor from '../src/CollapsedEditor';

export interface State {
	isExpanded: boolean;
}
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends React.Component<{}, State> {
	state = { isExpanded: false };

	toggleExpanded = (): void => {
		this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
	};

	render(): React.JSX.Element {
		return (
			<IntlProvider locale="en">
				<CollapsedEditor
					placeholder="What would you like to say?"
					isExpanded={this.state.isExpanded}
					onClickToExpand={this.toggleExpanded}
					renderEditor={(Editor) => (
						<Editor
							appearance="comment"
							quickInsert={true}
							onSave={() => alert('Saved!')}
							onCancel={this.toggleExpanded}
						/>
					)}
				/>
			</IntlProvider>
		);
	}
}
