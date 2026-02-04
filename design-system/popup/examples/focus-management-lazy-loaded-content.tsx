/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Popup from '@atlaskit/popup';
import {
	Popup as CompositionalPopup,
	PopupContent,
	PopupTrigger,
} from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

const contentContainerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

function LoadingPlaceholder() {
	return <div css={contentContainerStyles.root}>Loading...</div>;
}

function LazyLoadedContent() {
	/**
	 * We cannot use the `setInitialFocusRef` render prop to set focus on the initial focus button,
	 * as it is lazy loaded in **after** the popup has opened.
	 *
	 * `setInitialFocusRef` is a focus-trap utility (https://github.com/focus-trap/focus-trap#initialfocus),
	 * which only sets the focus to the specified element when the focus trap is activated - which is
	 * right after the popup has opened. Lazy loaded content is not in the DOM yet, so cannot use this
	 * functionality. Instead, focused needs to be manually set once the content has mounted.
	 */
	const initialFocusRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (initialFocusRef.current) {
			initialFocusRef.current.focus();
		}
	}, []);

	return (
		<div css={contentContainerStyles.root}>
			<Button ref={initialFocusRef}>Initial focus button</Button>
			<Button>Button 2</Button>
		</div>
	);
}

const exampleContainerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		alignItems: 'start',
	},
});

function RegularPopupExample() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleOpenPopup = useCallback(() => {
		setIsOpen((val) => !val);
		setTimeout(() => setIsLoaded(true), 1000);
	}, []);

	const handleClosePopup = useCallback(() => {
		setIsOpen(false);

		if (triggerRef.current) {
			triggerRef.current.focus();
		}
	}, []);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={handleClosePopup}
			autoFocus={false}
			content={() => (isLoaded ? <LazyLoadedContent /> : <LoadingPlaceholder />)}
			trigger={(triggerProps) => (
				<Button
					id="popup-trigger"
					{...triggerProps}
					onClick={handleOpenPopup}
					ref={mergeRefs([triggerRef, triggerProps.ref])}
				>
					Toggle popup (regular)
				</Button>
			)}
		/>
	);
}

function CompositionalPopupExample() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleOpenPopup = useCallback(() => {
		setIsOpen((val) => !val);
		setTimeout(() => setIsLoaded(true), 1000);
	}, []);

	const handleClosePopup = useCallback(() => {
		setIsOpen(false);

		if (triggerRef.current) {
			triggerRef.current.focus();
		}
	}, []);

	return (
		<CompositionalPopup isOpen={isOpen}>
			<PopupTrigger>
				{(triggerProps) => (
					<Button
						onClick={handleOpenPopup}
						{...triggerProps}
						ref={mergeRefs([triggerRef, triggerProps.ref])}
					>
						Toggle popup (compositional)
					</Button>
				)}
			</PopupTrigger>
			<PopupContent onClose={handleClosePopup} autoFocus={false}>
				{() => (isLoaded ? <LazyLoadedContent /> : <LoadingPlaceholder />)}
			</PopupContent>
		</CompositionalPopup>
	);
}

export default function FocusManagementLazyLoadedContentExample(): JSX.Element {
	return (
		<div css={exampleContainerStyles.root}>
			<RegularPopupExample />

			<CompositionalPopupExample />
		</div>
	);
}
