/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component } from 'react';

import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import { Code } from '@atlaskit/code';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

import { Highlight } from './styled';

const wrapperStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

const buttonGroupStyles = css({
	display: 'flex',
});

const buttonStyles = css({
	display: 'flex',
	width: '36px',
	height: '32px',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
	border: 0,
	borderRadius: '0.2em',
	color: 'inherit',
	cursor: 'pointer',
	marginInlineEnd: token('space.050', '4px'),
	opacity: 0.75,
	'&:hover, &:focus': {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		opacity: 1,
		outline: 0,
	},
	'&:active': {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		opacity: 0.5,
	},
});

type State = { value: number | null };

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightDialogWidthExample extends Component<{}, State> {
	state: State = { value: null };

	start = (): void => this.setState({ value: 300 });

	increment = (): void =>
		this.setState(({ value }) => ({
			value: Math.min((value || 0) + 100, 600),
		}));

	decrement = (): void =>
		this.setState(({ value }) => ({
			value: Math.max((value || 0) - 100, 160),
		}));

	finish = (): void => this.setState({ value: null });

	render() {
		const { value } = this.state;
		const deltaButtons = (
			<div css={buttonGroupStyles}>
				<button type="button" css={buttonStyles} onClick={this.decrement}>
					<ArrowDownIcon spacing="spacious" label="Decrement" />
				</button>
				<button type="button" css={buttonStyles} onClick={this.increment}>
					<ArrowUpIcon spacing="spacious" label="Increment" />
				</button>
			</div>
		);

		return (
			<div css={wrapperStyles}>
				<SpotlightManager>
					<SpotlightTarget name="width-example">
						<Highlight color="neutral">Target</Highlight>
					</SpotlightTarget>

					<p>
						Spotlight&apos;s supported dialog widths are between <Code>160px</Code> and{' '}
						<Code>600px</Code>.
					</p>
					<p>
						+/- buttons passed to the <Code>actionsBeforeElement</Code> property.
					</p>
					<p>
						<button type="button" data-testid="spotlight-dialog-trigger" onClick={this.start}>
							Show
						</button>
					</p>

					<SpotlightTransition>
						{value && (
							<Spotlight
								actions={[{ onClick: this.finish, text: 'Done' }]}
								actionsBeforeElement={deltaButtons}
								dialogPlacement="top center"
								dialogWidth={value}
								heading={`${value}px`}
								key="width-example"
								target="width-example"
							>
								<Lorem count={1} />
							</Spotlight>
						)}
					</SpotlightTransition>
				</SpotlightManager>
			</div>
		);
	}
}
