/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { UNSAFE_media } from '@atlaskit/primitives/responsive';

import {
	BANNER,
	BANNER_HEIGHT,
	CONTENT,
	DEFAULT_I18N_PROPS_SKIP_LINKS,
	LEFT_PANEL,
	LEFT_PANEL_WIDTH,
	PAGE_LAYOUT_CONTAINER_SELECTOR,
	RIGHT_PANEL,
	RIGHT_PANEL_WIDTH,
	TOP_NAVIGATION,
	TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { type PageLayoutProps } from '../../common/types';
import { SidebarResizeController, SkipLinksController } from '../../controllers';
import { SkipLinkWrapper } from '../skip-links';

const pageLayoutSelector = { [PAGE_LAYOUT_CONTAINER_SELECTOR]: true };

const gridTemplateAreasMobile = `
${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${BANNER}"
  ${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${TOP_NAVIGATION}"
  ${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${CONTENT}"
 `;

const gridTemplateAreas = `
${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${BANNER} ${RIGHT_PANEL}"
  ${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${TOP_NAVIGATION} ${RIGHT_PANEL}"
${/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766 */ ''}
  "${LEFT_PANEL} ${CONTENT} ${RIGHT_PANEL}"
 `;

const gridStyles = css({
	display: 'grid',
	height: '100%',
	gridTemplateAreas,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridTemplateColumns: `${LEFT_PANEL_WIDTH} minmax(0, 1fr) ${RIGHT_PANEL_WIDTH}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridTemplateRows: `${BANNER_HEIGHT} ${TOP_NAVIGATION_HEIGHT} auto`,
	outline: 'none',
});

const gridStylesMobileStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[UNSAFE_media.below.sm]: {
		gridTemplateAreas: gridTemplateAreasMobile,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		gridTemplateColumns: `${LEFT_PANEL_WIDTH} minmax(0, 1fr)`,
	},
});

/**
 * __Page layout__
 *
 * A collection of components which let you compose an application's page layout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const PageLayout = ({
	skipLinksLabel = DEFAULT_I18N_PROPS_SKIP_LINKS,
	children,
	testId,
	onLeftSidebarExpand,
	onLeftSidebarCollapse,
}: PageLayoutProps) => {
	return (
		<Fragment>
			<SkipLinksController>
				<SkipLinkWrapper skipLinksLabel={skipLinksLabel} />
				<div
					{...pageLayoutSelector}
					data-testid={testId}
					css={[gridStyles, gridStylesMobileStyles]}
					tabIndex={-1}
					data-vc="page-layout"
				>
					<SidebarResizeController
						onLeftSidebarCollapse={onLeftSidebarCollapse}
						onLeftSidebarExpand={onLeftSidebarExpand}
					>
						{children}
					</SidebarResizeController>
				</div>
			</SkipLinksController>
		</Fragment>
	);
};

export default PageLayout;
