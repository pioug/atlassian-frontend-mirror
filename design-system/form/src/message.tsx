/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { MessageWrapperContext } from './message-context';
import MessageTrack from './message-track';

type MessageAppearance = 'default' | 'error' | 'valid';

/**
 * API for the internal `<Message />` component. This is not public API.
 */
interface InternalMessageProps {
	/**
	 * The content of the message
	 */
	children: ReactNode;
	/**
	 * A testId prop is provided for specified elements, which is a unique string
	 *  that appears as a data attribute data-testid in the rendered code,
	 *  serving as a hook for automated tests
	 */
	testId?: string;
	/**
	 * Determines the appearance of the message.
	 */
	appearance?: MessageAppearance;
	fieldId?: string;
}
/**
 * Public API of the various message components.
 */
export type MessageProps = Pick<InternalMessageProps, 'children' | 'testId'>;

const messageStyles = css({
	display: 'flex',
	justifyContent: 'baseline',
	gap: token('space.075'),
	font: token('font.body.small'),
	marginBlockStart: token('space.050'),
});

const messageAppearanceStyles = cssMap({
	default: {
		color: token('color.text.subtlest'),
	},
	error: {
		color: token('color.text.danger'),
	},
	valid: {
		color: token('color.text.success'),
	},
});

const iconWrapperStyles = cssMap({
	root: {
		display: 'flex',
		height: '16px',
		alignItems: 'center',
	},
});

const IconWrapper = ({ children }: { children: ReactNode }) => (
	<span css={iconWrapperStyles.root}>{children}</span>
);

const messageIcons: Partial<Record<MessageAppearance, JSX.Element>> = {
	error: <ErrorIcon color="currentColor" label="error" size="small" />,
	valid: <SuccessIcon color="currentColor" label="success" size="small" />,
};

interface MessageRowProps extends InternalMessageProps {
	isExiting?: boolean;
}

const MessageRow = ({
	children,
	appearance = 'default',
	fieldId,
	isExiting = false,
	testId,
}: MessageRowProps): React.ReactNode => {
	const icon = messageIcons[appearance];
	const messageRef = useRef<HTMLDivElement>(null);
	const [hasMessageWrapper, setHasMessageWrapper] = useState(false);
	const { isWrapper } = useContext(MessageWrapperContext);

	useEffect(() => {
		if (messageRef.current) {
			setHasMessageWrapper(isWrapper);
		}
	}, [isWrapper]);

	/**
	 * The wrapping span is necessary to preserve spaces between children.
	 * Otherwise the flex layout of the message will remove any whitespace
	 * between children.
	 *
	 * If the child is just a string, this is not required and we can use one
	 * less DOM element.
	 */
	const content = typeof children === 'string' ? children : <span>{children}</span>;

	return (
		<div
			css={[messageStyles, messageAppearanceStyles[appearance]]}
			data-testid={testId}
			id={isExiting ? undefined : fieldId}
			ref={messageRef}
			// For backwards compatability, if there is a wrapper, aria-live is not needed
			aria-live={!hasMessageWrapper ? 'polite' : undefined}
			aria-hidden={isExiting ? true : undefined}
		>
			{icon && <IconWrapper>{icon}</IconWrapper>}
			{content}
		</div>
	);
};

const MotionMessage = (props: InternalMessageProps): React.ReactNode => {
	const isErrorMessage = props.appearance === 'error';
	const { hasMotionBoundary, transition } = useContext(MessageWrapperContext);
	const shouldAnimate = isErrorMessage || hasMotionBoundary;
	const { ref, state } = useMotion<HTMLDivElement>({
		initialState: shouldAnimate && transition !== 'instant' ? undefined : 'visible',
	});
	const row = (
		<MessageRow
			appearance={props.appearance}
			fieldId={props.fieldId}
			isExiting={state === 'exiting'}
			testId={props.testId}
		>
			{props.children}
		</MessageRow>
	);

	if (!shouldAnimate) {
		return row;
	}

	return (
		<MessageTrack
			state={state}
			transition={transition}
			motionRef={ref}
			testId={props.testId && `${props.testId}-motion`}
		>
			{row}
		</MessageTrack>
	);
};

/**
 * __Message__
 *
 * A message component for displaying messages in a form.
 */
const Message = (props: InternalMessageProps): React.ReactNode => {
	if (!fg('platform-dst-motion-uplift-input')) {
		return (
			<MessageRow appearance={props.appearance} fieldId={props.fieldId} testId={props.testId}>
				{props.children}
			</MessageRow>
		);
	}

	return (
		<MotionMessage appearance={props.appearance} fieldId={props.fieldId} testId={props.testId}>
			{props.children}
		</MotionMessage>
	);
};

export default Message;
