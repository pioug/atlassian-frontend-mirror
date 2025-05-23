import { token } from '@atlaskit/tokens';
import { Text } from '@atlaskit/primitives/compiled';
import React from 'react';
import serializeJavascript from 'serialize-javascript';
import MentionResource, { type MentionResourceConfig } from '../src/api/MentionResource';

export interface Props {
	children?: any;
	config: MentionResourceConfig;
}

export interface State {
	resourceProvider: MentionResource;
}

export default class ConfigurableMentionPicker extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			resourceProvider: new MentionResource(props.config),
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		this.refreshMentions(nextProps.config);
	}

	refreshMentions(config: MentionResourceConfig) {
		this.setState({
			resourceProvider: new MentionResource(config),
		});
	}

	mentionConfigChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
		// eslint-disable-next-line no-new-func
		const config = new Function('', `return (${event.target.value})`)();
		this.refreshMentions(config);
	};

	render() {
		const { resourceProvider } = this.state;

		return (
			<div style={{ padding: `${token('space.150', '12px')}` }}>
				{React.cloneElement(this.props.children, { resourceProvider })}
				<Text as="p">
					<label htmlFor="mention-urls">MentionResource config</label>
				</Text>
				<Text as="p">
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-textarea */}
					<textarea
						id="mention-urls"
						rows={15}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: '400px' }}
						onChange={this.mentionConfigChange}
						defaultValue={serializeJavascript(this.props.config).replace(/\\u002F/g, '/')}
					/>
				</Text>
			</div>
		);
	}
}
