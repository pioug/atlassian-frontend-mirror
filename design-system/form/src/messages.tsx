/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { FieldId } from './field-id-context';

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
type MessageProps = Pick<InternalMessageProps, 'children' | 'testId'>;

const messageStyles = css({
	display: 'flex',
	justifyContent: 'baseline',
	gap: token('space.050', '4px'),
	font: token('font.body.UNSAFE_small'),
	marginBlockStart: token('space.050', '4px'),
});

const messageAppearanceStyles: Record<MessageAppearance, SerializedStyles> = {
	default: css({
		color: token('color.text.subtlest', N200),
	}),
	error: css({
		color: token('color.text.danger', '#AE2A19'),
	}),
	valid: css({
		color: token('color.text.success', '#216E4E'),
	}),
};

const iconWrapperStyles = css({
	display: 'flex',
});

const IconWrapper = ({ children }: { children: ReactNode }) => {
	return <span css={iconWrapperStyles}>{children}</span>;
};

const messageIcons: Partial<Record<MessageAppearance, JSX.Element>> = {
	error: <ErrorIcon size="small" label="error" />,
	valid: <SuccessIcon size="small" label="success" />,
};

const Message = ({ children, appearance = 'default', fieldId, testId }: InternalMessageProps) => {
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
			id={fieldId}
			ref={messageRef}
			// For backwards compatability, if there is a wrapper, aria-live is not needed
			aria-live={!hasMessageWrapper ? 'polite' : undefined}
		>
			{icon && <IconWrapper>{icon}</IconWrapper>}
			{content}
		</div>
	);
};

/**
 * __Helper message__
 *
 * A helper message tells the user what kind of input the field takes. For example, a helper message could be
 * 'Password should be more than 4 characters'
 *
 */
export const HelperMessage = ({ children, testId }: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message fieldId={fieldId ? `${fieldId}-helper` : undefined} testId={testId}>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);

/**
 * __Error message__
 *
 * An error message is used to tell a user that the field input is invalid. For example, an error message could be
 * 'Invalid username, needs to be more than 4 characters'.
 *
 */
export const ErrorMessage = ({ children, testId }: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="error"
				fieldId={fieldId ? `${fieldId}-error` : undefined}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);

/**
 * __Valid message__
 *
 * A valid message is used to tell a user that the field input is valid. For example,
 * a helper message could be 'Nice one, this username is available'.
 *
 */
export const ValidMessage = ({ children, testId }: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="valid"
				fieldId={fieldId ? `${fieldId}-valid` : undefined}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);

/**
 * __Message wrapper context__
 *
 * A message wrapper context allows the children to check
 * if it is contained within the MessageWrapper.
 */
export const MessageWrapperContext = createContext<{ isWrapper: boolean }>({
	isWrapper: false,
});

/**
 * __Message wrapper __
 *
 * A message wrapper is used to allow assistive technologies, like screen readers, to announce error or
 * valid messages. This must be loaded into the DOM before the
 * ErrorMessage, ValidMessage is loaded. Otherwise, assistive technologies
 * may not render the message.
 *
 */
export const MessageWrapper = ({ children }: MessageProps) => {
	const contextValue = {
		isWrapper: true,
	};

	return (
		<MessageWrapperContext.Provider value={contextValue}>
			<div aria-live="polite" data-testid="message-wrapper">
				{children}
			</div>
		</MessageWrapperContext.Provider>
	);
};
