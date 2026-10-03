import React, {
	Children,
	isValidElement,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { FormSubmitContext } from './form-submit-context';
import type { MessageProps } from './message';
import { type MessageTransition, MessageWrapperContext } from './message-context';
import MessageGroup from './message-group';
import messageMotion from './message-motion-capability';

/**
 * __Message wrapper __
 *
 * A message wrapper is used to allow assistive technologies, like screen readers, to announce error or
 * valid messages. This must be loaded into the DOM before the
 * ErrorMessage, ValidMessage is loaded. Otherwise, assistive technologies
 * may not render the message.
 *
 */
export const MessageWrapper: ({ children }: MessageProps) => JSX.Element = ({
	children,
}: MessageProps) => {
	const contextValue = {
		isWrapper: true,
		hasMotionBoundary: false,
		transition: 'row' as const,
	};
	const shouldProvideMotionBoundary =
		fg('platform-dst-motion-uplift-input') &&
		Children.toArray(children).every(messageMotion.isCapable);

	return (
		<MessageWrapperContext.Provider value={contextValue}>
			<div aria-live="polite" data-testid="message-wrapper">
				{shouldProvideMotionBoundary ? <MotionMessages>{children}</MotionMessages> : children}
			</div>
		</MessageWrapperContext.Provider>
	);
};

const getChildKeys = (children: ReactNode): string[] =>
	Children.toArray(children)
		.filter(isValidElement)
		.map((child) => child.key)
		.filter((key): key is string => key !== null);

const getTransition = (previousKeys: string[], currentKeys: string[]): MessageTransition => {
	const previous = new Set(previousKeys);
	const current = new Set(currentKeys);
	const removedCount = previousKeys.filter((key) => !current.has(key)).length;
	const addedCount = currentKeys.filter((key) => !previous.has(key)).length;

	if (removedCount > 0 && addedCount > 0) {
		return 'instant';
	}
	if (previousKeys.length === 0 && addedCount > 1) {
		return 'groupEnter';
	}
	if (currentKeys.length === 0 && removedCount > 1) {
		return 'groupExit';
	}
	return 'row';
};

const MotionMessages = ({ children }: { children: ReactNode }): JSX.Element => {
	const currentKeys = getChildKeys(children);
	const submitCount = useContext(FormSubmitContext);
	const [transition, setTransition] = useState<{
		keys: string[];
		mode: MessageTransition;
		submitCount: number;
	}>(() => ({ keys: currentKeys, mode: 'row', submitCount }));

	const hasKeyChange =
		currentKeys.length !== transition.keys.length ||
		currentKeys.some((key, index) => key !== transition.keys[index]);
	const isSubmitUpdate = submitCount !== transition.submitCount;

	if (hasKeyChange || isSubmitUpdate) {
		setTransition({
			keys: currentKeys,
			mode: !hasKeyChange
				? transition.mode
				: isSubmitUpdate
					? 'instant'
					: getTransition(transition.keys, currentKeys),
			submitCount,
		});
	}
	const motionContextValue = useMemo(
		() => ({
			isWrapper: true,
			hasMotionBoundary: true,
			transition: transition.mode,
		}),
		[transition.mode],
	);

	return (
		<MessageWrapperContext.Provider value={motionContextValue}>
			<MessageGroup transition={transition.mode}>
				<ExitingPersistence appear>{children}</ExitingPersistence>
			</MessageGroup>
		</MessageWrapperContext.Provider>
	);
};
