/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	DEFAULT_LEFT_PANEL_WIDTH,
	LEFT_PANEL,
	LEFT_PANEL_WIDTH,
	VAR_LEFT_PANEL_WIDTH,
} from '../../common/constants';
import { type SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector, resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

const leftPanelStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridArea: LEFT_PANEL,
});

const leftPanelFixedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: LEFT_PANEL_WIDTH,
	position: 'fixed',
	insetBlockEnd: 0,
	insetBlockStart: 0,
	insetInlineStart: 0,
});

/**
 * __Left panel__
 *
 * Provides a slot for a left panel within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const LeftPanel = (props: SlotWidthProps) => {
	const {
		children,
		isFixed,
		width = DEFAULT_LEFT_PANEL_WIDTH,
		shouldPersistWidth,
		testId,
		id,
		skipLinkTitle,
	} = props;

	const leftPanelWidth = resolveDimension(VAR_LEFT_PANEL_WIDTH, width, shouldPersistWidth);

	useEffect(() => {
		publishGridState({ [VAR_LEFT_PANEL_WIDTH]: leftPanelWidth });
		return () => {
			publishGridState({ [VAR_LEFT_PANEL_WIDTH]: 0 });
		};
	}, [leftPanelWidth]);

	useSkipLink(id, skipLinkTitle);

	return (
		<SlotFocusRing>
			{({ className }) => (
				<div
					css={[leftPanelStyles, isFixed && leftPanelFixedStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					data-testid={testId}
					id={id}
					{...getPageLayoutSlotSelector('left-panel')}
				>
					<SlotDimensions variableName={VAR_LEFT_PANEL_WIDTH} value={leftPanelWidth} />
					{children}
				</div>
			)}
		</SlotFocusRing>
	);
};

export default LeftPanel;
