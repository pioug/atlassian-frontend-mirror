/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	PureComponent,
	type MouseEvent,
	type KeyboardEvent,
	type FocusEvent,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from 'react';
import { css, jsx } from '@compiled/react';
import Lozenge from '@atlaskit/lozenge/lozenge';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { createStatusAnalyticsAndFire } from './analytics';
import { ANALYTICS_HOVER_DELAY } from './constants';
import { getLozengeAppearance, type NamedColor, normalizeColor } from './status-colors';

/**
 * What the ADF `color` attribute can hold. `HexColor` is the closed set we persist — do
 * not substitute it here, or graceful rendering of unknown hex becomes a type error.
 */
export type Color = NamedColor | `#${string}`;
export type StatusStyle = 'bold' | 'subtle';

const MAX_WIDTH = 200;

/**
 * This is to account for a bug in android chromium and should be removed
 * when the editor fixes its focus handling with respect to Status.
 *
 * See DSP-7701 for additional context.
 */
const inlineBlockStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'inline-block !important',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
		verticalAlign: 'middle',
	},
});

// Bound the Lozenge to its parent while keeping short statuses content-sized.
const constrainedToParentStyles = css({
	display: 'inline-block',
	maxWidth: '100%',
});

// eg. Version/4.0 Chrome/95.0.4638.50
const isAndroidChromium =
	typeof window !== 'undefined' && /Version\/.* Chrome\/.*/.test(window.navigator.userAgent);

export interface OwnProps {
	color: Color;
	isBold?: boolean;
	isConstrainedToParent?: boolean;
	localId?: string;
	onClick?: (event: React.SyntheticEvent<any>) => void;
	onHover?: () => void;
	role?: string;
	style?: StatusStyle;
	text: string;
}

export type Props = OwnProps & WithAnalyticsEventsProps;

class StatusInternal extends PureComponent<Props, any> {
	static displayName = 'StatusInternal';

	private hoverStartTime: number = 0;

	private handleMouseEnter = (_e: MouseEvent<HTMLSpanElement>) => {
		this.hoverStartTime = Date.now();
	};

	private handleMouseLeave = (_e: MouseEvent<HTMLSpanElement>) => {
		const { onHover } = this.props;
		const delay = Date.now() - this.hoverStartTime;

		if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
			onHover();
		}
		this.hoverStartTime = 0;
	};

	private handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
		const { onClick } = this.props;
		if (onClick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onClick(e);
		}
	};

	private handleFocus = (_e: FocusEvent<HTMLSpanElement>) => {
		this.hoverStartTime = Date.now();
	};

	private handleBlur = (_e: FocusEvent<HTMLSpanElement>) => {
		const { onHover } = this.props;
		const delay = Date.now() - this.hoverStartTime;

		if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
			onHover();
		}
		this.hoverStartTime = 0;
	};

	componentWillUnmount() {
		this.hoverStartTime = 0;
	}

	render() {
		const { text, color, style, role, onClick, isBold, isConstrainedToParent } = this.props;
		if (text.trim().length === 0) {
			return null;
		}

		const appearance = getLozengeAppearance(color);
		// Note: ommitted data-local-id attribute to avoid copying/pasting the same localId
		return (
			<span
				css={[
					isAndroidChromium ? inlineBlockStyles : undefined,
					isConstrainedToParent ? constrainedToParentStyles : undefined,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="status-lozenge-span"
				onClick={onClick}
				onKeyDown={onClick ? this.handleKeyDown : undefined}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				tabIndex={onClick ? -1 : undefined}
				data-node-type="status"
				data-color={normalizeColor(color)}
				data-style={style}
				role={role}
			>
				<Lozenge appearance={appearance} maxWidth={MAX_WIDTH} isBold={isBold}>
					{text}
				</Lozenge>
			</span>
		);
	}
}

export const Status: ForwardRefExoticComponent<
	Omit<OwnProps, keyof WithAnalyticsEventsProps> & RefAttributes<any>
> = withAnalyticsEvents({
	onClick: (createEvent: CreateUIAnalyticsEvent, props: Props): UIAnalyticsEvent => {
		const { localId } = props;
		return createStatusAnalyticsAndFire(createEvent)({
			action: 'clicked',
			actionSubject: 'statusLozenge',
			attributes: {
				localId,
			},
		});
	},
	onHover: (createEvent: CreateUIAnalyticsEvent, props: Props): UIAnalyticsEvent => {
		const { localId } = props;
		return createStatusAnalyticsAndFire(createEvent)({
			action: 'hovered',
			actionSubject: 'statusLozenge',
			attributes: {
				localId,
			},
		});
	},
})(StatusInternal);
