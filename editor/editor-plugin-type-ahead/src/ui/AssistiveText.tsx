/** @jsx jsx */

import React from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

type Cancelable = ReturnType<typeof debounce>;

type AssistiveTextProps = {
	assistiveText: string;
	isInFocus: boolean;
	id: string;
	statusDebounceMillis?: number;
	debounce?: boolean;
};

type AssistiveTextState = {
	bump: boolean;
	debounced: boolean;
	silenced: boolean;
};

const statusDebounceMillis = 1400;
const assitiveTextStyles = css({
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: '1px',
	marginbottom: '-1px',
	marginright: '-1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	whitespace: 'nowrap',
	width: '1px',
});

class AssistveTextComponent extends React.Component<AssistiveTextProps, AssistiveTextState> {
	static defaultProps: AssistiveTextProps = {
		statusDebounceMillis: 1400,
		debounce: true,
		assistiveText: '',
		isInFocus: false,
		id: '',
	};

	debounceStatusUpdate!: (() => void) & Cancelable;
	state = {
		bump: false, //when the same text needs to be read again, Hence it needs to be toggled between __status--A and __status--B
		debounced: false,
		silenced: false,
	};

	UNSAFE_componentWillMount() {
		this.debounceStatusUpdate = debounce(() => {
			if (!this.state.debounced) {
				const shouldSilence = !this.props.isInFocus;
				this.setState(({ bump }) => ({
					bump: !bump,
					debounced: true,
					silenced: shouldSilence,
				}));
			}
		}, statusDebounceMillis);
	}

	UNSAFE_componentWillUnmount() {
		this.debounceStatusUpdate.cancel();
	}

	UNSAFE_componentWillReceiveProps() {
		this.setState(({ bump }) => ({ bump: !bump, debounced: false }));
	}

	render() {
		const { assistiveText, id } = this.props;
		const { bump, debounced, silenced } = this.state;

		this.debounceStatusUpdate();

		return (
			<div css={assitiveTextStyles}>
				<div id={id + '__status--A'} role="status" aria-atomic="true" aria-live="polite">
					{`${!silenced && debounced && bump ? assistiveText : ''}`}
				</div>
				<div id={id + '__status--B'} role="status" aria-atomic="true" aria-live="polite">
					{`${!silenced && debounced && !bump ? assistiveText : ''}`}
				</div>
			</div>
		);
	}
}

export const AssistiveText = AssistveTextComponent;
