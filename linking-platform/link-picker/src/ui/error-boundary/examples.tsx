import React from 'react';

import { token } from '@atlaskit/tokens';

import { LINK_PICKER_WIDTH_IN_PX } from '../../common/constants';

import { ErrorBoundaryFallback } from './error-boundary-fallback';

const createExample = (): React.ComponentType => {
	return function Example() {
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					border: '1px solid red',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					width: `${LINK_PICKER_WIDTH_IN_PX}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-left' as string]: token('space.200', '16px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-right' as string]: token('space.200', '16px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-top' as string]: token('space.200', '16px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-bottom' as string]: token('space.200', '16px'),
				}}
			>
				<ErrorBoundaryFallback />
			</div>
		);
	};
};

export const ErrorBoundary = createExample();
