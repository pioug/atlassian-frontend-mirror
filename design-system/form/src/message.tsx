/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode, useContext } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { FormContext } from './form-context';
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
	/**
	 * Accessible label for the status icon. Use your internationalization library to provide a localized string.
	 */
	iconLabel?: string;
}
/**
 * Public API of the various message components.
 */
export type MessageProps = Pick<InternalMessageProps, 'children' | 'testId'>;

/**
 * Public API of message components that render a status icon.
 */
export type StatusMessageProps = MessageProps & Pick<InternalMessageProps, 'iconLabel'>;

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

const getMessageIcon = (
	appearance: MessageAppearance,
	iconLabel?: string,
): JSX.Element | undefined => {
	if (appearance === 'error') {
		return <ErrorIcon color="currentColor" label={iconLabel ?? 'error'} size="small" />;
	}

	if (appearance === 'valid') {
		return <SuccessIcon color="currentColor" label={iconLabel ?? 'success'} size="small" />;
	}
};

const getContextIconLabel = (
	appearance: MessageAppearance,
	errorMessageLabel?: string,
	validMessageLabel?: string,
): string | undefined => {
	if (appearance === 'error') {
		return errorMessageLabel;
	}

	if (appearance === 'valid') {
		return validMessageLabel;
	}
};

interface MessageRowProps extends InternalMessageProps {
	isExiting?: boolean;
}

const MessageRow = ({
	children,
	appearance = 'default',
	fieldId,
	iconLabel,
	isExiting = false,
	testId,
}: MessageRowProps): React.ReactNode => {
	const { errorMessageLabel, validMessageLabel } = useContext(FormContext);
	const contextIconLabel = getContextIconLabel(appearance, errorMessageLabel, validMessageLabel);
	const icon = getMessageIcon(appearance, iconLabel ?? contextIconLabel);
	const { isWrapper } = useContext(MessageWrapperContext);

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
			// Let the wrapper own announcements from the first render when present.
			aria-live={isWrapper ? undefined : 'polite'}
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
			iconLabel={props.iconLabel}
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
			<MessageRow
				appearance={props.appearance}
				fieldId={props.fieldId}
				iconLabel={props.iconLabel}
				testId={props.testId}
			>
				{props.children}
			</MessageRow>
		);
	}

	return (
		<MotionMessage
			appearance={props.appearance}
			fieldId={props.fieldId}
			iconLabel={props.iconLabel}
			testId={props.testId}
		>
			{props.children}
		</MotionMessage>
	);
};

export default Message;
