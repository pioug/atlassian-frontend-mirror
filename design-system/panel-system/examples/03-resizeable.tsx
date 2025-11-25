/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type CSSProperties, useCallback, useState } from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap, jsx } from '@atlaskit/css';
import {
	PanelBody,
	PanelContainer,
	PanelFooter,
	PanelHeader,
	PanelTitle,
} from '@atlaskit/panel-system';
import { Box, Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const CSS_VAR_PANEL_WIDTH = '--example-panel-width';

const styles = cssMap({
	layout: {
		height: '100vh',
		width: '100%',
	},
	mainContent: {
		flex: 1,
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
	panelWrapper: {
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
});

const unboundedStyles = unboundedCssMap({
	panelWrapper: {
		width: `var(${CSS_VAR_PANEL_WIDTH})`,
	},
});

export function SimpleResizeExample() {
	const [panelWidth, setPanelWidth] = useState(300);

	const handleResize = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.preventDefault();
			const startX = event.clientX;
			const startWidth = panelWidth;

			const handleMouseMove = (e: MouseEvent) => {
				e.preventDefault();
				const deltaX = e.clientX - startX;
				const newWidth = Math.max(150, Math.min(600, startWidth - deltaX));
				setPanelWidth(newWidth);
			};

			const handleMouseUp = () => {
				unbind();
			};

			const unbindMove = bind(document, {
				type: 'mousemove',
				listener: handleMouseMove,
			});
			const unbindUp = bind(document, {
				type: 'mouseup',
				listener: handleMouseUp,
			});
			const unbind = () => {
				unbindMove();
				unbindUp();
			};
		},
		[panelWidth],
	);

	return (
		<Flex xcss={styles.layout}>
			<Box xcss={styles.mainContent}>
				<Text>
					<strong>Simple Resize Example</strong>
				</Text>
				<Text>
					Click and drag the left edge of the panel to resize it. Current width: {panelWidth}px
				</Text>
			</Box>

			<div
				css={[styles.panelWrapper, unboundedStyles.panelWrapper]}
				style={{ [CSS_VAR_PANEL_WIDTH]: `${panelWidth}px` } as CSSProperties}
			>
				<PanelContainer onResize={handleResize}>
					<PanelHeader>
						<PanelTitle>Resizable Panel</PanelTitle>
					</PanelHeader>
					<PanelBody>
						<Text>This is a simple example showing the resize functionality.</Text>
					</PanelBody>
					<PanelFooter>
						<Checkbox label="Create another" isChecked={false} onChange={() => {}} />
						<Button appearance="primary" onClick={() => {}}>
							Create
						</Button>
					</PanelFooter>
				</PanelContainer>
			</div>
		</Flex>
	);
}

export default SimpleResizeExample;
