import React, { useLayoutEffect, useRef } from 'react';

import type { SmartLinkChoreographerProps } from './state/context/types';
import { useSmartCardContext } from './state/context/useSmartCardContext';

/** Coordinates display only. Eligibility, analytics and dismissal policy belong to the caller. */
export function ChoreographedContent(props: SmartLinkChoreographerProps): React.JSX.Element {
	const { value } = useSmartCardContext();
	const Choreographer = value?.choreographer;
	const unavailable = useRef(props.onUnavailable);
	useLayoutEffect(() => {
		unavailable.current = props.onUnavailable;
	}, [props.onUnavailable]);
	useLayoutEffect(() => {
		if (props.isActive && !Choreographer) unavailable.current();
	}, [props.isActive, Choreographer]);
	return Choreographer ? (
		<Choreographer key={props.messageId} {...props} />
	) : (
		<>{props.children({ hasPermission: false })}</>
	);
}
