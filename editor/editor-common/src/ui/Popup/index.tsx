import React from 'react';

import type { FocusTrap } from 'focus-trap';
import createFocusTrap from 'focus-trap';
import rafSchedule from 'raf-schd';
import { createPortal, flushSync } from 'react-dom';

import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Position } from './utils';
import {
	calculatePlacement,
	calculatePosition,
	findOverflowScrollParent,
	validatePosition,
} from './utils';
export interface Props {
	zIndex?: number;
	// The alignments are using the same placements from Popper
	// https://popper.js.org/popper-documentation.html#Popper.placements
	alignX?: 'left' | 'right' | 'center' | 'end';
	alignY?: 'top' | 'bottom' | 'start';
	target?: HTMLElement;
	fitHeight?: number;
	fitWidth?: number;
	boundariesElement?: HTMLElement;
	mountTo?: HTMLElement;
	// horizontal offset, vertical offset
	offset?: number[];
	onUnmount?: () => void;
	onPositionCalculated?: (position: Position) => Position;
	onPlacementChanged?: (placement: [string, string]) => void;
	shouldRenderPopup?: (position: Position) => boolean;
	scrollableElement?: HTMLElement;
	stick?: boolean;
	/** `null` should only be used if we provide enough context to screen readers to exclude aria-label attribute */
	ariaLabel?: string | null;
	forcePlacement?: boolean;
	allowOutOfBounds?: boolean; // Allow to correct position elements inside table: https://product-fabric.atlassian.net/browse/ED-7191
	rect?: DOMRect;
	style?: React.CSSProperties;
	/** Enable focus trap to contain the user's focus within the popup */
	focusTrap?: boolean;
	preventOverflow?: boolean;
	absoluteOffset?: Position;
	children?: React.ReactNode;
}

export interface State {
	// Popup Html element reference
	popup?: HTMLElement;

	position?: Position;
	validPosition: boolean;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Popup extends React.Component<Props, State> {
	scrollElement: undefined | false | HTMLElement;
	scrollParentElement: undefined | false | HTMLElement;
	rafIds: Set<number> = new Set();
	static defaultProps = {
		offset: [0, 0],
		allowOutOfBound: false,
	};

	state: State = {
		validPosition: true,
	};

	private popupRef: React.MutableRefObject<HTMLElement | null> = React.createRef<HTMLDivElement>();

	private focusTrap?: FocusTrap;

	private placement: [string, string] = ['', ''];

	/**
	 * Calculates new popup position
	 */
	private calculatePosition(props: Props, popup?: HTMLElement) {
		const {
			target,
			fitHeight,
			fitWidth,
			boundariesElement,
			offset,
			onPositionCalculated,
			onPlacementChanged,
			alignX,
			alignY,
			stick,
			forcePlacement,
			allowOutOfBounds,
			rect,
			preventOverflow,
			absoluteOffset,
		} = props;

		if (!target || !popup) {
			return {};
		}

		const placement = calculatePlacement(
			target,
			boundariesElement || document.body,
			fitWidth,
			fitHeight,
			alignX,
			alignY,
			forcePlacement,
			preventOverflow,
		);

		if (onPlacementChanged && this.placement.join('') !== placement.join('')) {
			onPlacementChanged(placement);
			this.placement = placement;
		}

		let position = calculatePosition({
			placement,
			popup,
			target,
			stick,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			offset: offset!,
			allowOutOfBounds,
			rect,
		});
		position = onPositionCalculated ? onPositionCalculated(position) : position;

		if (typeof position.top !== 'undefined' && absoluteOffset?.top) {
			position.top = position.top + absoluteOffset.top;
		}

		if (typeof position.bottom !== 'undefined' && absoluteOffset?.bottom) {
			position.bottom = position.bottom + absoluteOffset.bottom;
		}

		if (typeof position.right !== 'undefined' && absoluteOffset?.right) {
			position.right = position.right + absoluteOffset.right;
		}

		if (typeof position.left !== 'undefined' && absoluteOffset?.left) {
			position.left = position.left + absoluteOffset.left;
		}

		return {
			position,
			validPosition: validatePosition(target),
		};
	}

	private updatePosition(props = this.props, state = this.state) {
		const { popup } = state;
		const { position, validPosition } = this.calculatePosition(props, popup);

		if (position && validPosition) {
			flushSync(() => {
				this.setState({
					position,
					validPosition,
				});
			});
		}
	}

	private cannotSetPopup(
		popup: HTMLElement,
		target?: HTMLElement,
		overflowScrollParent?: HTMLElement | false,
	) {
		/**
		 * Check whether:
		 * 1. Popup's offset targets which means whether or not its possible to correctly position popup along with given target.
		 * 2. Popup is inside "overflow: scroll" container, but its offset parent isn't.
		 *
		 * Currently Popup isn't capable of position itself correctly in case 2,
		 * Add "position: relative" to "overflow: scroll" container or to some other FloatingPanel wrapper inside it.
		 */
		return (
			!target ||
			(document.body.contains(target) &&
				popup.offsetParent &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				!popup.offsetParent.contains(target!)) ||
			(overflowScrollParent && !overflowScrollParent.contains(popup.offsetParent))
		);
	}

	/**
	 * Popup initialization.
	 * Checks whether it's possible to position popup along given target, and if it's not throws an error.
	 */
	private initPopup(popup: HTMLElement) {
		this.popupRef.current = popup;

		const { target } = this.props;
		const overflowScrollParent = findOverflowScrollParent(popup);

		if (this.cannotSetPopup(popup, target, overflowScrollParent)) {
			return;
		}

		this.setState({
			popup,
		});
		/**
		 * Some plugins (like image) have async rendering of component in floating toolbar(which is popup).
		 * Now, floating toolbar position depends on it's size.
		 * Size of floating toolbar changes, when async component renders.
		 * There is currently, no way to re position floating toolbar or
		 *  better to not show floating toolbar till all the async component are ready to render.
		 * Also, it is not even Popup's responsibility to take care of it as popup's children are passed
		 *  as a prop.
		 * So, calling scheduledUpdatePosition to position popup on next request animation frame,
		 * which is currently working for most of the floating toolbar and other popups.
		 */
		this.scheduledUpdatePosition(this.props);

		if (this.props.focusTrap) {
			this.initFocusTrap();
		}
	}

	private handleRef = (popup: HTMLDivElement) => {
		if (!popup) {
			return;
		}

		this.initPopup(popup);
	};

	private scheduledUpdatePosition = rafSchedule((props: Props) => {
		this.updatePosition(this.props);
	});

	onResize = () => this.scheduledUpdatePosition(this.props);

	// Ignored via go/ees005
	// eslint-disable-next-line react/no-unsafe
	UNSAFE_componentWillReceiveProps(newProps: Props) {
		// We are delaying `updatePosition` otherwise it happens before the children
		// get rendered and we end up with a wrong position
		if (!fg('platform_editor_react18_phase2_v2')) {
			this.scheduledUpdatePosition(newProps);
		}
	}

	resizeObserver = window?.ResizeObserver
		? new ResizeObserver(() => {
				this.scheduledUpdatePosition(this.props);
			})
		: undefined;

	/**
	 * Raf scheduled so that it also occurs after the initial update position
	 */
	private initFocusTrap = rafSchedule(() => {
		const popup = this.popupRef.current;
		if (!popup) {
			return;
		}

		const trapConfig = {
			clickOutsideDeactivates: true,
			escapeDeactivates: true,
			initialFocus: popup,
			fallbackFocus: popup,
			returnFocusOnDeactivate: false,
		};

		this.focusTrap = createFocusTrap(popup, trapConfig);
		this.focusTrap.activate();
	});

	/**
	 * Cancels the initialisation of the focus trap if it has not yet occured
	 * Deactivates the focus trap if it exists
	 */
	private destroyFocusTrap() {
		this.initFocusTrap.cancel();
		this.focusTrap?.deactivate();
	}

	/**
	 * Handle pausing, unpausing, and initialising (if not yet initialised) of the focus trap
	 */
	handleChangedFocusTrapProp(prevProps: Props) {
		if (prevProps.focusTrap !== this.props.focusTrap) {
			// If currently set to disable, then pause the trap if it exists
			if (!this.props.focusTrap) {
				return this.focusTrap?.pause();
			}

			// If set to enabled and trap already exists, unpause
			if (this.focusTrap) {
				this.focusTrap.unpause();
			}

			// Else initialise the focus trap
			return this.initFocusTrap();
		}
	}

	componentDidUpdate(prevProps: Props) {
		this.handleChangedFocusTrapProp(prevProps);

		if (fg('platform_editor_react18_phase2_v2')) {
			if (this.props !== prevProps) {
				this.scheduledUpdatePosition(prevProps);
			}
		}
	}

	componentDidMount() {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('resize', this.onResize);
		const { stick } = this.props;

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.scrollParentElement = findOverflowScrollParent(this.props.target!);
		if (this.scrollParentElement && this.resizeObserver) {
			this.resizeObserver.observe(this.scrollParentElement);
		}

		if (stick) {
			this.scrollElement = this.scrollParentElement;
		} else {
			this.scrollElement = this.props.scrollableElement;
		}
		if (this.scrollElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.scrollElement.addEventListener('scroll', this.onResize);
		}
	}

	componentWillUnmount() {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.removeEventListener('resize', this.onResize);
		if (this.scrollElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.scrollElement.removeEventListener('scroll', this.onResize);
		}

		if (this.scrollParentElement && this.resizeObserver) {
			this.resizeObserver.unobserve(this.scrollParentElement);
		}
		this.scheduledUpdatePosition.cancel();

		this.destroyFocusTrap();

		const { onUnmount } = this.props;
		if (onUnmount) {
			onUnmount();
		}
	}

	private renderPopup() {
		const { position } = this.state;
		const { shouldRenderPopup } = this.props;

		if (shouldRenderPopup && !shouldRenderPopup(position || {})) {
			return null;
		}

		//In some cases we don't want to use default "Popup" text as an aria-label. It might be tedious for screen reader users.
		const ariaLabel = this.props.ariaLabel === null ? undefined : this.props.ariaLabel || 'Popup';

		return (
			<div
				ref={this.handleRef}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					zIndex: this.props.zIndex || akEditorFloatingPanelZIndex,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					...position,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					...this.props.style,
				}}
				aria-label={ariaLabel}
				data-testid="popup-wrapper"
				// Indicates component is an editor pop. Required for focus handling in Message.tsx
				data-editor-popup
			>
				{this.props.children}
			</div>
		);
	}

	render() {
		const { target, mountTo } = this.props;
		const { validPosition } = this.state;

		if (!target || !validPosition) {
			return null;
		}

		if (mountTo) {
			return createPortal(this.renderPopup(), mountTo);
		}

		// Without mountTo property renders popup as is,
		// which means it will be cropped by "overflow: hidden" container.
		return this.renderPopup();
	}
}
