import React, { useEffect, useRef, useState } from 'react';

import Heading from '@atlaskit/heading/heading';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { PanelActionCloseSmart } from '@atlassian/panel-system/panel-action/close-smart';
import { PanelActionGroup } from '@atlassian/panel-system/panel-action/group';
import { PanelBody } from '@atlassian/panel-system/panel-body';
import { PanelContainer } from '@atlassian/panel-system/panel-container';
import { PanelContent } from '@atlassian/panel-system/panel-content';
import { PanelHeader } from '@atlassian/panel-system/panel-header';
import { PanelTitle } from '@atlassian/panel-system/panel-title';

function PanelWidthReadout(): React.JSX.Element {
	const markerRef = useRef<HTMLSpanElement>(null);
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		const panel = markerRef.current?.closest("[data-testid='layout-with-panel--panel-slot']");

		if (!panel) {
			return;
		}

		const updateWidth = () => setWidth(Math.round(panel.getBoundingClientRect().width));
		const resizeObserver = new ResizeObserver(updateWidth);

		updateWidth();
		resizeObserver.observe(panel);

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<span ref={markerRef}>
			<Text size="large">Panel: {width === null ? 'measuring…' : `${width}px`}</Text>
		</span>
	);
}

export default function LocalPanel(): React.JSX.Element {
	return (
		<PanelContainer>
			<PanelHeader>
				<PanelTitle>Local panel</PanelTitle>
				<PanelActionGroup>
					<PanelActionCloseSmart label="Close local panel" />
				</PanelActionGroup>
			</PanelHeader>
			<PanelContent>
				<PanelBody>
					<Stack space="space.200">
						<PanelWidthReadout />
						<Heading size="small" as="h2">
							LayoutWithPanel content
						</Heading>
						<Text>
							This panel is rendered by panel-system's local PanelSlot inside the Main layout area.
						</Text>
					</Stack>
				</PanelBody>
			</PanelContent>
		</PanelContainer>
	);
}
