/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef, useEffect } from 'react';
import { jsx } from '@compiled/react';
import { cssMap } from '@atlaskit/css';
import * as exenv from 'exenv';
export interface EllipsifyProps {
	text?: string;
	lines: number;
	endLength?: number;
	inline?: boolean;
	testId?: string;
}

const styleMap = cssMap({
	inline: { display: 'inline' },
	notInline: {},
});

export const Ellipsify = ({
	text,
	lines,
	endLength,
	inline,
	testId,
}: EllipsifyProps): JSX.Element => {
	const element = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!element.current) {
			return;
		}
		setEllipsis(element.current, { lines, endLength });
	}, [element, lines, endLength]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="ellipsed-text"
			ref={element}
			aria-label={text}
			css={styleMap[inline ? 'inline' : 'notInline']}
			data-testid={testId}
		>
			{text}
		</div>
	);
};

const setEllipsis = (element: HTMLElement, props: EllipsifyProps) => {
	const maximumLines = props.lines;
	const height = element.getBoundingClientRect().height;
	const text = element.textContent as string;
	element.textContent = 'a';
	const lineHeight = element.getBoundingClientRect().height;
	const lineCount = height / lineHeight;
	const maximumHeight = lineHeight * maximumLines;

	if (lineCount <= maximumLines) {
		element.textContent = text;
		return;
	}

	let textContent = text;
	const endLength =
		typeof props.endLength === 'number' && props.endLength >= 0 ? props.endLength : 8;
	const beginningText = text.substr(0, (text.length * maximumLines) / lineCount - endLength);
	const endText = text.substr(text.length - endLength, endLength);
	element.textContent = textContent = `${beginningText}...${endText}`;
	const finalHeight = element.getBoundingClientRect().height;

	if (finalHeight > maximumHeight) {
		const adjustedBeginningText = beginningText.substr(
			0,
			beginningText.length - (beginningText.length / maximumLines) * 0.25,
		);
		textContent = `${adjustedBeginningText}...${endText}`;
	}

	delayRun(() => (element.textContent = textContent));
};

const timeout = (fn: Function) => setTimeout(fn, 1);
const delayRun =
	exenv.canUseDOM && window.requestAnimationFrame ? window.requestAnimationFrame : timeout;

export default Ellipsify;
