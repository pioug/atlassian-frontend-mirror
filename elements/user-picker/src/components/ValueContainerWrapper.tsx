/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

/**
 * Conditional wrapper for the ValueContainer in Select. Provides a workaround
 * for issues using react-select on react-beautiful-dnd Draggable elements.
 * @returns
 */
const ValueContainerWrapper = ({
	children,
	isEnabled,
	onMouseDown,
}: {
	children: React.ReactElement;
	isEnabled: boolean;
	onMouseDown: () => void;
}) => {
	return isEnabled ? (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={css({ flexGrow: 1 })} onMouseDown={onMouseDown}>
			{children}
		</div>
	) : (
		children
	);
};

export default ValueContainerWrapper;
