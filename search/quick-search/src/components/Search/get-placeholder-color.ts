// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type InterpolationValue } from 'styled-components';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const getPlaceholderColor: InterpolationValue[] = css({
	color: token('color.text.subtlest'),
});
