/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';
import { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import Layer from '../Layer';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

const halfFocusRing = 1;
const dropOffset = '0, 8';

const fadeIn = keyframes({
	'0%': {
		opacity: 0,
	},
	'100%': {
		opacity: 1,
	},
});

export interface Props extends WithAnalyticsEventsProps {
	children?: ReactNode;
	id?: string;
	isOpen?: boolean;
	onDroplistRef?: (ref: HTMLDivElement | null) => unknown;
	onOpenChange?: (event: OpenChangedEvent) => void;
	onPositioned?: () => void;
	position: string;
	shouldFitContainer: boolean;
	testId?: string;
	trigger?: React.ReactNode;
}

export type OpenChangedEvent = {
	event: MouseEvent | KeyboardEvent;
	isOpen: boolean;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class DropList extends Component<Props> {
	private dropContentRef?: HTMLDivElement;
	private triggerRef?: HTMLDivElement;

	private wrapperStyles = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		display: this.props.shouldFitContainer ? 'block' : 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		flex: this.props.shouldFitContainer ? '1 1 auto' : undefined,
		transitionDuration: '0.2s',
		transition: 'box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	});

	private triggerStyles = css({
		transitionDuration: '0.2s',
		transition: 'box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		display: this.props.shouldFitContainer ? 'block' : 'inline-flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxSizing: this.props.shouldFitContainer ? 'border-box' : undefined,
	});

	private motionStyles = css({
		animationName: `${fadeIn}`,
		animationDuration: '360ms',
		animationTimingFunction: 'cubic-bezier(0.8, 0, 0, 1)',
	});

	/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
	private menuWrapper = () => {
		return css({
			color: token('color.text.subtle'),
			backgroundColor: token('elevation.surface.overlay'),
			borderRadius: token('border.radius', '3px'),
			boxShadow: token('elevation.shadow.overlay'),
			boxSizing: 'border-box',
			overflow: 'auto',
			padding: `${token('space.050', '4px')} 0`,
			maxHeight: '90vh',
		});
	};
	/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

	componentDidMount = () => {
		this.setContentWidth();
		// We use a captured event here to avoid a radio or checkbox dropdown item firing its
		// click event first, which would cause a re-render of the element and prevent DropList
		// from detecting the actual source of this original click event.
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('click', this.handleClickOutside, true);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('keydown', this.handleEsc);
	};

	componentDidUpdate = () => {
		if (this.props.isOpen) {
			this.setContentWidth();
		}
	};

	componentWillUnmount = () => {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.removeEventListener('click', this.handleClickOutside, true);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.removeEventListener('keydown', this.handleEsc);
	};

	setContentWidth = () => {
		const { dropContentRef, triggerRef } = this;
		const { shouldFitContainer } = this.props;

		// We need to manually set the content width to match the trigger width
		if (shouldFitContainer && dropContentRef && triggerRef) {
			dropContentRef.style.width = `${triggerRef.offsetWidth - halfFocusRing * 2}px`;
		}
	};

	handleEsc = (event: KeyboardEvent) => {
		if ((event.key === 'Escape' || event.key === 'Esc') && this.props.isOpen) {
			this.close(event);
		}
	};

	handleClickOutside = (event: MouseEvent) => {
		if (this.props.isOpen) {
			if (event.target instanceof Node) {
				// Rather than check for the target within the entire DropList, we specify the trigger/content.
				// This aids with future effort in scroll-locking DropList when isMenuFixed is enabled; the scroll
				// blanket which stretches to the viewport should not stop 'close' from being triggered.
				const withinTrigger = this.triggerRef && this.triggerRef.contains(event.target);
				const withinContent = this.dropContentRef && this.dropContentRef.contains(event.target);

				if (!withinTrigger && !withinContent) {
					this.close(event);
				}
			}
		}
	};

	close = (event: MouseEvent | KeyboardEvent) => {
		if (this.props.onOpenChange) {
			this.props.onOpenChange({ isOpen: false, event });
		}
	};

	handleContentRef = (ref: HTMLDivElement) => {
		this.dropContentRef = ref;

		// If the dropdown has just been opened, we focus on the containing element so the
		// user can tab to the first dropdown item. We will only receive this ref if isOpen
		// is true or null, so no need to check for truthiness here.
		if (ref) {
			ref.focus();
		}
	};

	private handleDroplistRef = (ref: HTMLDivElement | null) => {
		this.props.onDroplistRef?.(ref);
	};

	handleTriggerRef = (ref: HTMLDivElement) => {
		this.triggerRef = ref;
	};

	render() {
		const { children, isOpen, position, trigger, onPositioned, testId, id } = this.props;

		const layerContent = isOpen ? (
			<div
				css={this.menuWrapper}
				data-role="droplistContent"
				data-testid={testId && `${testId}--content`}
				ref={this.handleContentRef}
				id={id}
				role="presentation"
			>
				{children}
			</div>
		) : null;

		return (
			<div
				css={[this.wrapperStyles, fg('p2m-drop-down-motion') && this.motionStyles]}
				ref={this.handleDroplistRef}
			>
				<Layer
					content={layerContent}
					offset={dropOffset}
					position={position}
					onPositioned={onPositioned}
				>
					<div
						css={[this.triggerStyles, fg('p2m-drop-down-motion') && this.motionStyles]}
						ref={this.handleTriggerRef}
					>
						{trigger}
					</div>
				</Layer>
			</div>
		);
	}
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
	componentName: 'droplist',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onOpenChange: createAndFireEventOnAtlaskit({
			action: 'toggled',
			actionSubject: 'droplist',

			attributes: {
				componentName: 'droplist',
				packageName,
				packageVersion,
			},
		}),
	})(DropList),
);
