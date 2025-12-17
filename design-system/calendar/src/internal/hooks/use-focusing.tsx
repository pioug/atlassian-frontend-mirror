import { type default as React, useCallback } from 'react';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useFocusing({
	onBlur,
	onFocus,
}: {
	onBlur: React.FocusEventHandler;
	onFocus: React.FocusEventHandler;
}) {
	const handleContainerBlur = useCallback(
		(event: React.FocusEvent): void => {
			onBlur(event);
		},
		[onBlur],
	);

	const handleContainerFocus = useCallback(
		(event: React.FocusEvent): void => {
			onFocus(event);
		},
		[onFocus],
	);

	return {
		handleContainerBlur,
		handleContainerFocus,
	};
}
