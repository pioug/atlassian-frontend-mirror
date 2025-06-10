import React, { type ErrorInfo, type PropsWithChildren } from 'react';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';
import { B300, R300, N30A, N900 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/core/migration/warning';
import { type AnalyticsErrorBoundaryInlinePayload, fireMediaCardEvent } from '../utils/analytics';
export type MediaInlineAnalyticsErrorBoundaryProps = PropsWithChildren<
	{
		isSelected?: boolean;
		data?: { [k: string]: any };
		featureFlags?: MediaFeatureFlags;
	} & WithAnalyticsEventsProps
>;

type MediaInlineAnalyticsErrorBoundaryState = {
	hasError: boolean;
};

interface ErrorBoundaryProps {
	message: string;
	isSelected: boolean;
}

const ErrorBoundaryComponent: React.FC<ErrorBoundaryProps> = ({ message, isSelected }) => {
	const selectedStyle: React.CSSProperties = {
		cursor: 'pointer',
		boxShadow: `0 0 0 1px ${token('color.border.selected', B300)}`,
		outline: 'none',
		userSelect: 'none',
		borderColor: 'transparent',
	};

	/* Note:
   - styling is borrowed from packages/media/media-ui/src/MediaInlineCard/Frame/styled.ts
   - because we are not using styled components, we are not able to use themed(), here is the "themed" property of color and backgroundColor

    color: `${themed({
      light: token('color.text', N900),
      dark: token('color.text', DN600),
    })}`,
    backgroundColor: `${themed({
      light: token('color.background.neutral', N30A),
      dark: token('color.background.neutral', DN80),
    })}`,

  */

	const style: React.CSSProperties = {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
		padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
		marginRight: token('space.negative.025', '-2px'),
		WebkitBoxDecorationBreak: 'clone',
		display: 'inline-flex',
		gap: token('space.050'),
		alignItems: 'center',
		borderRadius: '3px',
		color: token('color.text', N900),
		backgroundColor: token('color.background.neutral', N30A),
		userSelect: 'text',
		transition: 'all 0.1s ease-in-out 0s',
		cursor: 'pointer',
		...(isSelected ? { ...selectedStyle } : { userSelect: 'text' }),
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<span style={style}>
			<WarningIcon
				LEGACY_margin={`0 ${token('space.negative.050')} 0 0`}
				label="error"
				LEGACY_size="small"
				color={token('color.icon.danger', R300)}
				size="small"
			/>
			{message}
		</span>
	);
};

class WrappedMediaInlineAnalyticsErrorBoundary extends React.Component<
	MediaInlineAnalyticsErrorBoundaryProps,
	MediaInlineAnalyticsErrorBoundaryState
> {
	constructor(props: MediaInlineAnalyticsErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static displayName = 'MediaInlineAnalyticsErrorBoundary';
	private fireOperationalEvent = (error: Error | string, info?: ErrorInfo) => {
		const { data = {}, createAnalyticsEvent } = this.props;
		const payload: AnalyticsErrorBoundaryInlinePayload = {
			eventType: 'operational',
			action: 'failed',
			actionSubject: 'mediaInlineRender',
			attributes: {
				browserInfo: window?.navigator?.userAgent ? window.navigator.userAgent : 'unknown',
				error,
				failReason: 'unexpected-error',
				info,
				...data,
			},
		};
		fireMediaCardEvent(payload, createAnalyticsEvent);
	};

	componentDidCatch(error: Error, info?: ErrorInfo): void {
		try {
			this.fireOperationalEvent(error, info);
			this.setState({ hasError: true });
		} catch (e) {}
	}

	render() {
		const { hasError } = this.state;
		const { children, isSelected } = this.props;

		return hasError ? (
			<ErrorBoundaryComponent message="We couldn't load this content" isSelected={isSelected!} />
		) : (
			children
		);
	}
}

// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
const MediaInlineAnalyticsErrorBoundary: React.ComponentType<
	MediaInlineAnalyticsErrorBoundaryProps & WithAnalyticsEventsProps
> = withAnalyticsEvents()(WrappedMediaInlineAnalyticsErrorBoundary);

export default MediaInlineAnalyticsErrorBoundary;
