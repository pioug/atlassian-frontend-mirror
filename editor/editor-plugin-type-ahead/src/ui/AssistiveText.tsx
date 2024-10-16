/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

import { fg } from '@atlaskit/platform-feature-flags';

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

class AssistveTextOld extends React.Component<AssistiveTextProps, AssistiveTextState> {
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
				<div
					data-testId={id + '__status--A'}
					id={id + '__status--A'}
					role="status"
					aria-atomic="true"
					aria-live="polite"
				>
					{`${!silenced && debounced && bump ? assistiveText : ''}`}
				</div>
				<div
					data-testId={id + '__status--B'}
					id={id + '__status--B'}
					role="status"
					aria-atomic="true"
					aria-live="polite"
				>
					{`${!silenced && debounced && !bump ? assistiveText : ''}`}
				</div>
			</div>
		);
	}
}

export const AssistiveTextNew = ({
	assistiveText = '',
	isInFocus = false,
	id = '',
	statusDebounceMillis = 1400,
}: AssistiveTextProps) => {
	const [bump, setBump] = useState(false);
	const [debounced, setDebounced] = useState(false);
	const [silenced, setSilenced] = useState(false);

	const debounceStatusUpdate = useMemo(
		() =>
			debounce(() => {
				const shouldSilence = !isInFocus;
				setBump((prevBump) => !prevBump);
				setDebounced(true);
				setSilenced(shouldSilence);
			}),
		[isInFocus],
	);

	useEffect(() => {
		if (!debounced) {
			debounceStatusUpdate();
			return () => {
				debounceStatusUpdate.cancel();
			};
		}
	}, [assistiveText, isInFocus, debounced, debounceStatusUpdate]);

	useEffect(() => {
		if (debounced) {
			setBump((prevBump) => !prevBump);
			setDebounced(true);
			setSilenced(!isInFocus);
		}
	}, [assistiveText, isInFocus, debounced]);

	return (
		<div css={assitiveTextStyles}>
			<div
				data-testid={id + '__status--A'}
				id={id + '__status--A'}
				role="status"
				aria-atomic="true"
				aria-live="polite"
			>
				{!silenced && debounced && bump ? assistiveText : ''}
			</div>
			<div
				data-testid={id + '__status--B'}
				id={id + '__status--B'}
				role="status"
				aria-atomic="true"
				aria-live="polite"
			>
				{!silenced && debounced && !bump ? assistiveText : ''}
			</div>
		</div>
	);
};

export const AssistiveText = (props: AssistiveTextProps) => {
	if (fg('platform_editor_react18_phase2')) {
		return <AssistiveTextNew {...props} />;
	} else {
		return <AssistveTextOld {...props} />;
	}
};
