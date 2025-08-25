/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

type AssistiveTextProps = {
	assistiveText: string;
	debounce?: boolean;
	id: string;
	isInFocus: boolean;
	statusDebounceMillis?: number;
};

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

export const AssistiveText = ({
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
