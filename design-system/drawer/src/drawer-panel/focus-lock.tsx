import React from 'react';

import ReactFocusLock from 'react-focus-lock';

import { type FocusLockProps } from '../types';

/**
 * __Focus lock__
 *
 * Thin wrapper around react-focus-lock.
 */
const FocusLock = ({
	isFocusLockEnabled = true,
	autoFocusFirstElem = true,
	shouldReturnFocus = true,
	children,
}: FocusLockProps): React.JSX.Element => {
	const getFocusTarget = () => {
		if (typeof shouldReturnFocus === 'boolean') {
			return shouldReturnFocus;
		}

		return false;
	};

	const onDeactivation = () => {
		if (typeof shouldReturnFocus !== 'boolean') {
			window.setTimeout(() => {
				shouldReturnFocus?.current?.focus();
			}, 0);
		}
	};

	return (
		<ReactFocusLock
			disabled={!isFocusLockEnabled}
			autoFocus={autoFocusFirstElem}
			returnFocus={getFocusTarget()}
			onDeactivation={onDeactivation}
		>
			{children}
		</ReactFocusLock>
	);
};

export default FocusLock;
