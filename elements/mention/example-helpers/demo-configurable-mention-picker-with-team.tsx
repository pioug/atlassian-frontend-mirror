import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';
import { Text } from '@atlaskit/primitives';
import React from 'react';
import { type MentionResourceConfig } from '../src/api/MentionResource';
import TeamMentionResource from '../src/api/TeamMentionResource';

export interface Props {
	children?: any;
	userMentionConfig: MentionResourceConfig;
	teamMentionConfig: MentionResourceConfig;
}

export interface State {
	resourceProvider: TeamMentionResource | null;
	teamMentionConfig: MentionResourceConfig;
	userMentionConfig: MentionResourceConfig;
}

export default class ConfigurableTeamMentionPicker extends React.Component<Props, State> {
	state: State = {
		resourceProvider: new TeamMentionResource(
			this.props.userMentionConfig,
			this.props.teamMentionConfig,
		),
		teamMentionConfig: this.props.teamMentionConfig,
		userMentionConfig: this.props.userMentionConfig,
	};

	componentDidMount() {
		this.refreshMentions();
	}

	refreshMentions() {
		const resourceProvider = new TeamMentionResource(
			this.state.userMentionConfig,
			this.state.teamMentionConfig,
		);
		this.setState({
			resourceProvider,
		});
	}

	componentDidUpdate(_: Readonly<Props>, prevState: Readonly<State>): void {
		const { teamMentionConfig, userMentionConfig } = this.state;

		if (
			teamMentionConfig !== prevState.teamMentionConfig ||
			userMentionConfig !== prevState.userMentionConfig
		) {
			this.refreshMentions();
		}
	}

	configTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		try {
			const config = JSON.parse(event.target.value.trim()) as MentionResourceConfig;
			const stateName = event.target.name;
			if (stateName === 'userMentionConfig') {
				this.setState({ userMentionConfig: config });
			} else if (stateName === 'teamMentionConfig') {
				this.setState({ teamMentionConfig: config });
			}
		} catch (err) {
			// eslint-disable-next-line
			console.error('ERROR: cannot parse JSON', event.target.value);
		}
	};

	render() {
		const { userMentionConfig, teamMentionConfig } = this.props;
		const { resourceProvider } = this.state;

		return (
			<div style={{ padding: `${token('space.150', '12px')}` }}>
				{React.cloneElement(this.props.children, { resourceProvider })}
				<Text as="p">
					<label htmlFor="mention-urls">MentionResource config</label>
				</Text>

				<div>
					<Heading size="medium">Default mention config</Heading>
					<textarea
						id="mention-urls"
						rows={15}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: '400px' }}
						name="userMentionConfig"
						onChange={this.configTextAreaChange}
						defaultValue={JSON.stringify(userMentionConfig, null, 2)}
					/>
				</div>

				<div>
					<Heading size="medium">Team service config</Heading>
					<textarea
						id="mention-urls-team"
						name="teamMentionConfig"
						rows={15}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: '400px' }}
						onChange={this.configTextAreaChange}
						defaultValue={JSON.stringify(teamMentionConfig, null, 2)}
					/>
				</div>
			</div>
		);
	}
}
