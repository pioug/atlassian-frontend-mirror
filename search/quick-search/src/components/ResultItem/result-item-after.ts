// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponentClass } from 'styled-components';
import type { ClassAttributes, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const ResultItemAfter: StyledComponentClass<
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			shouldTakeSpace: boolean;
		},
	any,
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			shouldTakeSpace: boolean;
		}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles
> = styled.div<{ shouldTakeSpace: boolean }>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: props.shouldTakeSpace ? '24px' : 0,
}));
