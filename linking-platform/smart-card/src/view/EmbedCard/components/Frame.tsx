/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type MutableRefObject,
	type Ref,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';

// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getIframeSandboxAttribute } from '../../../utils';

import { IFrame } from './IFrame';
import { IframeDwellTracker } from './IframeDwellTracker';

export interface FrameProps {
	extensionKey?: string;
	isTrusted?: boolean;
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
	onIframeFocus?: () => void;
	testId?: string;
	title?: string;
	url?: string;
}

export interface FrameUpdatedProps extends FrameProps {
	isMouseOver?: boolean;
	onIframeMouseEnter?: () => void;
	onIframeMouseLeave?: () => void;
}

type Refs =
	| Ref<HTMLElement | null>
	| RefObject<HTMLElement | null>
	| ((node: HTMLElement | null) => void);

function mergeRefs(refs: Refs[]) {
	return (value: HTMLElement | null) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref !== null) {
				(ref as MutableRefObject<HTMLElement | null>).current = value;
			}
		});
	};
}

const iframeStyles = css({
	border: 0,
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	position: 'relative',
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
});

export const Frame = React.forwardRef<HTMLIFrameElement, FrameProps>(
	(
		{ url, isTrusted = false, testId, onIframeDwell, onIframeFocus, title, extensionKey },
		iframeRef,
	) => {
		di(IFrame);
		const doc = getDocument();
		const [isIframeLoaded, setIframeLoaded] = useState(false);
		const [isMouseOver, setMouseOver] = useState(false);
		const [isWindowFocused, setWindowFocused] = useState(true);

		const ref = useRef<HTMLIFrameElement>();
		const mergedRef = mergeRefs([iframeRef, ref as RefObject<HTMLIFrameElement>]);

		const [percentVisible, setPercentVisible] = useState(0);

		/**
		 * These are the 'percent visible' thresholds at which the intersectionObserver will
		 * trigger a state change. Eg. when the user scrolls and moves from 74% to 76%, or
		 * vice versa. It's in a state object so that its static for the useEffect
		 */
		const [threshold] = useState([0.75, 0.8, 0.85, 0.9, 0.95, 1]);
		useEffect(() => {
			if (!ref || !ref.current) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						setPercentVisible(entry?.intersectionRatio);
					});
				},
				{ threshold },
			);

			observer.observe(ref.current);

			return () => {
				observer.disconnect();
			};
		}, [threshold, mergedRef]);

		useEffect(() => {
			const onBlur = () => {
				setWindowFocused(false);
				if (fg('jpx-1074-smart-links-iframe')) {
					if (doc?.activeElement === ref.current) {
						onIframeFocus && onIframeFocus();
					}
				} else {
					// The below will be removed as part of FG cleanup
					// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
					if (document.activeElement === ref.current) {
						onIframeFocus && onIframeFocus();
					}
				}
			};

			const onFocus = () => {
				setWindowFocused(true);
			};

			window.addEventListener('blur', onBlur);
			window.addEventListener('focus', onFocus);
			return () => {
				window.removeEventListener('blur', onBlur);
				window.removeEventListener('focus', onFocus);
			};
		}, [ref, onIframeFocus, doc]);

		if (!url) {
			return null;
		}

		return (
			<React.Fragment>
				<IframeDwellTracker
					isIframeLoaded={isIframeLoaded}
					isMouseOver={isMouseOver}
					isWindowFocused={isWindowFocused}
					iframePercentVisible={percentVisible}
					onIframeDwell={onIframeDwell}
				/>
				<IFrame
					childRef={mergedRef}
					src={url}
					data-testid={`${testId}-frame`}
					data-test-iframe-loaded={isIframeLoaded}
					css={iframeStyles}
					onMouseEnter={() => {
						setMouseOver(true);
					}}
					onMouseLeave={() => {
						setMouseOver(false);
					}}
					allowFullScreen
					scrolling="yes"
					allow="autoplay; encrypted-media; clipboard-write"
					onLoad={() => {
						setIframeLoaded(true);
					}}
					sandbox={getIframeSandboxAttribute(isTrusted)}
					title={title}
					extensionKey={extensionKey}
				/>
			</React.Fragment>
		);
	},
);

export const FrameUpdated = React.forwardRef<HTMLIFrameElement, FrameUpdatedProps>(
	(
		{
			url,
			isTrusted = false,
			testId,
			onIframeDwell,
			onIframeFocus,
			onIframeMouseEnter,
			onIframeMouseLeave,
			isMouseOver: isMouseOverProp,
			title,
			extensionKey,
		},
		iframeRef,
	) => {
		di(IFrame);
		const doc = getDocument();
		const [isIframeLoaded, setIframeLoaded] = useState(false);
		const [isMouseOver, setMouseOver] = useState(false);
		// Accessing the document here for SSR where document.hasFocus may be absent breaks SSR
		// when we're trying to load things like Loom frames in SSR
		// We _could_ either throw a guard in here (i.e check for the existence of document)
		// _or_
		// we can default to false, and set this state once the frame ref is available in a useEffect (safer IMO)
		// which already seems to be existing behavior in a useEffect below.
		const [isWindowFocused, setWindowFocused] = useState(
			// The below will be removed as part of FG cleanup
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
			fg('jpx-1074-smart-links-iframe') ? (doc?.hasFocus() ?? false) : document.hasFocus(),
		);

		// Use prop if provided (from wrapper), otherwise use local state (for backward compatibility)
		const effectiveMouseOver = isMouseOverProp !== undefined ? isMouseOverProp : isMouseOver;

		const ref = useRef<HTMLIFrameElement>();
		const mergedRef = mergeRefs([iframeRef, ref as RefObject<HTMLIFrameElement>]);

		const [percentVisible, setPercentVisible] = useState(0);

		/**
		 * These are the 'percent visible' thresholds at which the intersectionObserver will
		 * trigger a state change. Eg. when the user scrolls and moves from 74% to 76%, or
		 * vice versa. It's in a state object so that its static for the useEffect
		 */
		const [threshold] = useState([0.75, 0.8, 0.85, 0.9, 0.95, 1]);
		useEffect(() => {
			if (!ref || !ref.current) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						setPercentVisible(entry?.intersectionRatio);
					});
				},
				{ threshold },
			);

			observer.observe(ref.current);

			return () => {
				observer.disconnect();
			};
		}, [threshold, mergedRef]);

		useEffect(() => {
			// Initialize with current focus state
			// The below will be removed as part of FG cleanup
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
			setWindowFocused(
				fg('jpx-1074-smart-links-iframe') ? (doc?.hasFocus() ?? false) : document.hasFocus(),
			);

			const onBlur = () => {
				setWindowFocused(false);
				if (fg('jpx-1074-smart-links-iframe')) {
					if (doc?.activeElement === ref.current) {
						onIframeFocus && onIframeFocus();
					}
				} else {
					// The below will be removed as part of FG cleanup
					// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
					if (document.activeElement === ref.current) {
						onIframeFocus && onIframeFocus();
					}
				}
			};

			const onFocus = () => {
				setWindowFocused(true);
			};

			window.addEventListener('blur', onBlur);
			window.addEventListener('focus', onFocus);
			return () => {
				window.removeEventListener('blur', onBlur);
				window.removeEventListener('focus', onFocus);
			};
		}, [ref, onIframeFocus, doc]);

		if (!url) {
			return null;
		}

		return (
			<React.Fragment>
				<IframeDwellTracker
					isIframeLoaded={isIframeLoaded}
					isMouseOver={effectiveMouseOver}
					isWindowFocused={isWindowFocused}
					iframePercentVisible={percentVisible}
					onIframeDwell={onIframeDwell}
				/>
				<IFrame
					childRef={mergedRef}
					src={url}
					data-testid={`${testId}-frame`}
					data-test-iframe-loaded={isIframeLoaded}
					css={iframeStyles}
					onMouseEnter={() => {
						onIframeMouseEnter?.();
						// Use local state if prop not provided, otherwise prop takes precedence
						if (isMouseOverProp === undefined) {
							setMouseOver(true);
						}
					}}
					onMouseLeave={() => {
						onIframeMouseLeave?.();
						// Use local state if prop not provided, otherwise prop takes precedence
						if (isMouseOverProp === undefined) {
							setMouseOver(false);
						}
					}}
					allowFullScreen
					scrolling="yes"
					allow="autoplay; encrypted-media; clipboard-write"
					onLoad={() => {
						setIframeLoaded(true);
					}}
					sandbox={getIframeSandboxAttribute(isTrusted)}
					title={title}
					extensionKey={extensionKey}
				/>
			</React.Fragment>
		);
	},
);
