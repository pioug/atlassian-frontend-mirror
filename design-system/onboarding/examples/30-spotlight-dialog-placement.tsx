/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';

import { css, jsx } from '@compiled/react';

import Button, { IconButton } from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

import { Highlight } from './styled';

type Placement = (typeof options)[number];

const options = [
	'top right',
	'top center',
	'top left',
	'right bottom',
	'right middle',
	'right top',
	'bottom left',
	'bottom center',
	'bottom right',
	'left top',
	'left middle',
	'left bottom',
] as const;

const wrapperStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

interface State {
	index?: number;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightDialogPlacementExample extends Component<{}, State> {
	state: State = {};

	next = () => this.setState((state) => ({ index: (state.index || 0) + 1 }));

	start = () => this.setState({ index: 0 });

	finish = () => this.setState({ index: undefined });

	render() {
		const { index } = this.state;
		const placement = isNaN(index as number) ? null : options[(index || 0) % options.length];

		return (
			<div css={wrapperStyles}>
				<SpotlightManager>
					<SpotlightTarget name="placement-example">
						<Highlight color="neutral">Target</Highlight>
					</SpotlightTarget>

					<p>Click the target to change the dialog&apos;s placement.</p>
					<p>
						Achieved by passing our handler to the <Code>targetOnClick</Code> property.
					</p>
					<p>
						<Button testId="open-spotlight" onClick={this.start}>
							Show
						</Button>
					</p>

					<SpotlightTransition>
						{placement ? (
							<Spotlight
								headingAfterElement={
									<IconButton
										onClick={this.finish}
										icon={CrossIcon}
										appearance="subtle"
										label="Close"
										color="currentColor"
									/>
								}
								actions={[{ onClick: this.finish, text: 'Done' }]}
								dialogPlacement={placement as Placement}
								dialogWidth={300}
								heading={`"${placement}"`}
								key="placement-example"
								target="placement-example"
								targetOnClick={this.next}
							>
								A single line of innocuous text.
							</Spotlight>
						) : null}
					</SpotlightTransition>
				</SpotlightManager>
			</div>
		);
	}
}
