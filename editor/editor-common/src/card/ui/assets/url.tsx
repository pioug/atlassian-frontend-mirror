import React from 'react';
import type { ComponentProps } from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

// Custom icon ejection - these icons have been migrated away from the deprecated Custom / SVG components to native SVG. Please review whether this icon should be contributed to @atlaskit/icon-lab or whether it can be replaced by an existing icon from either @atlaskit/icon or @atlaskit/icon-lab
const IconUrlGlyph = ({
	'aria-label': ariaLabel,
	style,
}: Pick<ComponentProps<'svg'>, 'aria-label' | 'style'>) => {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={ariaLabel}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- style prop passed through from parent component
			style={style}
		>
			<rect x="6" y="15" width="20" height="2" rx="1" fill="currentColor" />
		</svg>
	);
};

const iconUrlStyle: React.CSSProperties = { width: '24px', height: '24px' };

export const IconUrl = ({ label }: { label: string }): React.JSX.Element => {
	const style = isExperimentEnabled('platform_editor_perf_lint_cleanup')
		? iconUrlStyle
		: // eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props
			{ width: '24px', height: '24px' };
	return (
		<IconUrlGlyph
			aria-label={label}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
		/>
	);
};
