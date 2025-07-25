import React from 'react';

import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Flag } from '../src/types';

type RenderChildren = (showFlags: (flags: Array<Flag>) => void) => React.ReactNode;

type Props = {
	children: RenderChildren;
};

type State = {
	flags: Array<Flag>;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class AppWithFlag extends React.PureComponent<Props, State> {
	state = {
		flags: [],
	};

	handleDismiss = () => {
		this.setState((prevState: State) => ({
			flags: prevState.flags.slice(1),
		}));
	};

	addFlag = (flags: Array<Flag>) => {
		this.setState({ flags: [...this.state.flags, ...flags] });
	};

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: token('space.200', '16px') }}>
				{this.props.children(this.addFlag)}
				<FlagGroup onDismissed={this.handleDismiss}>
					{this.state.flags.map((flag: Flag, index) => {
						return (
							<AutoDismissFlag
								appearance="normal"
								id={index}
								icon={
									<SuccessIcon
										label="Success"
										LEGACY_size="medium"
										spacing="spacious"
										color={token('color.icon.success', G300)}
									/>
								}
								key={index}
								title={flag.title.defaultMessage}
							/>
						);
					})}
				</FlagGroup>
			</div>
		);
	}
}
