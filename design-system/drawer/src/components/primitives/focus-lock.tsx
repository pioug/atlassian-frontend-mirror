import React, { useEffect } from 'react';

import ReactFocusLock from 'react-focus-lock';
import ScrollLock from 'react-scrolllock';
import invariant from 'tiny-invariant';

import { type FocusLockProps } from '../types';

/**
 * __Focus lock__
 *
 * Thin wrapper over react-focus-lock. This wrapper only exists to ensure API compatibility.
 * This component should be deleted during https://ecosystem.atlassian.net/browse/AK-5658
 */
const FocusLock = ({
	isFocusLockEnabled = true,
	autoFocusFirstElem = true,
	shouldReturnFocus = true,
	children,
}: FocusLockProps) => {
	useEffect(() => {
		if (
			typeof process !== 'undefined' &&
			process.env.NODE_ENV !== 'production' &&
			!process.env.CI
		) {
			invariant(
				typeof autoFocusFirstElem === 'boolean',
				'@atlaskit/drawer: Passing a function as autoFocus is deprecated. Instead call focus on the element ref or use the autofocus property.',
			);
		}
		if (typeof autoFocusFirstElem === 'function' && isFocusLockEnabled) {
			const elem = autoFocusFirstElem();
			if (elem && elem.focus) {
				elem.focus();
			}
		}
	}, [autoFocusFirstElem, isFocusLockEnabled]);

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
			autoFocus={!!autoFocusFirstElem}
			returnFocus={getFocusTarget()}
			onDeactivation={onDeactivation}
		>
			<ScrollLock>{children}</ScrollLock>
		</ReactFocusLock>
	);
};

export default FocusLock;
