/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { Example } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

const backColor = token('color.background.neutral.subtle', '#FFFFFF');
const frontColor = token('color.background.neutral.subtle.hovered', '#091E420F');
const backgroundStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.AKExampleShowcase': {
		backgroundColor: backColor,
		opacity: 1,
		backgroundImage: `repeating-linear-gradient( 45deg, ${frontColor} 25%, transparent 25%, transparent 75%, ${frontColor} 75%, ${frontColor} ), repeating-linear-gradient( 45deg, ${frontColor} 25%, ${backColor} 25%, ${backColor} 75%, ${frontColor} 75%, ${frontColor} )`,
		backgroundPosition: '0 0, 6px 6px',
		backgroundSize: '12px 12px',
	},
});

const toggleStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.AKExampleWrapper': {
		paddingTop: token('space.300', '24px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.AKExampleToggle': {
		display: 'none',
	},
});

type FlexibleUiExampleProps = {
	background?: boolean;
} & typeof Example;

const CustomExample = ({ background, sourceVisible, source, ...props }: FlexibleUiExampleProps) => {
	// Fix hover card entrypoint
	const replaceCode = source.replace('../src/hoverCard', '../src/hover-card');

	return (
		<div css={[sourceVisible === false && toggleStyles, background && backgroundStyles]}>
			<Example
				packageName="@atlaskit/smart-card"
				source={replaceCode}
				sourceVisible={sourceVisible}
				{...props}
			/>
		</div>
	);
};

export default CustomExample;
