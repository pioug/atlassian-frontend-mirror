/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { token } from '@atlaskit/tokens';

import { MessageWrapperContext } from './message-context';

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

/**
 * __Message__
 *
 * A message component for displaying messages in a form.
 */
const Message = ({
	children,
	appearance = 'default',
	fieldId,
	testId,
}: InternalMessageProps): React.ReactNode => {
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

export default Message;
