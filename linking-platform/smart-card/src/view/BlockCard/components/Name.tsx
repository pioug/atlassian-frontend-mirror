/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { gs } from '../../common/utils';

export interface NameProps {
	name: React.ReactNode;
	isLeftPadded?: boolean;
	testId?: string;
	children?: React.ReactNode;
	textColor?: string;
}

/**
 * Class name for selecting non-flexible block card header name
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardContentHeaderNameClassName = 'block-card-content-header-name';

const baseStyles = css({
	font: token('font.heading.xsmall'),
	/**
	 * The xsmall heading token has a line height of 20px in the modernized/refreshed themes,
	 * but 16px in legacy theme which causes alignment issues.
	 * Remove this lineHeight once all consuming apps are using modernized/refreshed themes.
	 */
	lineHeight: '20px',
	// Spec: show max two lines.
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
	// Fallback options.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxHeight: gs(6),
});

export const Name = ({ name, isLeftPadded = true, testId, textColor }: NameProps) => {
	return (
		<span
			css={[
				baseStyles,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					marginLeft: isLeftPadded ? gs(1) : '0',
					color: textColor ? textColor : 'inherit',
				},
			]}
			data-testid={testId}
			data-trello-do-not-use-override="block-card-content-header-name"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blockCardContentHeaderNameClassName}
		>
			{name}
		</span>
	);
};
