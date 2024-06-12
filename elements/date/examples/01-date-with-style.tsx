import React from 'react';
import { Date, type DateProps } from '../src';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { borderRadius } from '@atlaskit/theme/constants';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type Props = {
	selected?: boolean;
} & DateProps;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const SelectableDate = styled(Date)((props: Props) =>
	props.selected
		? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css({
				display: "'relative'",
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'&:before': {
					content: "''",
					border: `2px solid ${token('color.border.selected', B200)}`,
					display: "'absolute'",
					background: 'transparent',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					borderRadius: `${borderRadius()}px`,
					boxSizing: 'border-box',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
				},
			})
		: null,
) as React.ComponentType<React.PropsWithChildren<Props>>;

export default () => (
	<div>
		<p>
			<SelectableDate value={586137600000} selected />
		</p>
		<p>
			<SelectableDate value={586137600000} />
		</p>
		<p>
			<SelectableDate value={586137600000} color="red" selected />
		</p>
	</div>
);
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
