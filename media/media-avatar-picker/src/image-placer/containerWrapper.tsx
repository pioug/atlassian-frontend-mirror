/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';
import { checkeredBg } from './styles';

const containerWrapperStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	background: `url('${checkeredBg}')`,
	position: `relative`,
	cursor: `move`,
	userSelect: `none`,
	overflow: `hidden`,
});

export type ContainerWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	width: number;
	height: number;
	margin: number;
};

export const ContainerWrapper = ({
	width,
	height,
	margin,
	children,
	...props
}: ContainerWrapperProps) => {
	const containerWrapperDimensions = xcss({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${width !== undefined ? width! + margin * 2 : 0}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${height !== undefined ? height! + margin * 2 : 0}px`,
	});

	return (
		<Box
			id={'container-wrapper'}
			xcss={[containerWrapperStyles, containerWrapperDimensions]}
			{...props}
		>
			{children}
		</Box>
	);
};
