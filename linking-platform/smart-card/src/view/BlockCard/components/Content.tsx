/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { gs, mq } from '../../common/utils';

export interface ContentProps {
	children: React.ReactNode;
	/* Reduces padding by half to visualize content more compactly */
	isCompact?: boolean;
}

/**
 * Class name for selecting non-flexible block card content
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardContentClassName = 'block-card-content';

const baseStyles = css({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
});

export const Content = ({ children, isCompact = false }: ContentProps) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={[
			baseStyles,
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			mq({
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				padding: isCompact ? gs(1) : gs(2),
				justifyContent: isCompact ? 'unset' : ['unset', 'space-between'],
			}),
		]}
		data-trello-do-not-use-override="block-card-content"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={blockCardContentClassName}
	>
		{children}
	</div>
);
