/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { token } from '@atlaskit/tokens';

interface TruncatedWrapperProps {
	backgroundColor?: string;
	children?: React.ReactNode;
	fadeHeight?: number;
	height?: number;
}

type FadeOutProps = React.PropsWithChildren<{
	backgroundColor: string;
	fadeHeight: number;
	height: number;
}>;

const fadeOutStyles = (maxHeight: number, top: number, backgroundColor: string) =>
	css({
		position: 'relative',
		overflowY: 'hidden',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxHeight: `${maxHeight}px`,
		'&::after': {
			content: "''",
			position: 'absolute',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			top: `${top}px`,
			bottom: 0,
			left: 0,
			right: 0,
			backgroundImage: `linear-gradient( ${token(
				'color.background.neutral.subtle',
				'rgba(255, 255, 255, 0)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			)}, ${backgroundColor} )`,
		},
	});

const FadeOut = (props: FadeOutProps) => {
	const { children, backgroundColor, fadeHeight, height } = props;
	const top = height - fadeHeight;
	const styles = fadeOutStyles(height, top, backgroundColor);
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
	return <div css={styles}>{children}</div>;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export class TruncatedWrapper extends Component<TruncatedWrapperProps, unknown> {
	constructor(props: TruncatedWrapperProps) {
		super(props);
	}

	// TODO: DSP-4123 - Quality ticket as elevation.surface will be issue when sits top of modal.
	render() {
		const {
			height = 95,
			fadeHeight = 24,
			backgroundColor = token('elevation.surface', 'white'),
			children,
		} = this.props;
		return (
			<FadeOut height={height} fadeHeight={fadeHeight} backgroundColor={backgroundColor}>
				{children}
			</FadeOut>
		);
	}
}
