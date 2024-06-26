import React from 'react';

import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';

import { token } from '@atlaskit/tokens';

import { MacroFallbackCard } from '../src/ui';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const MacroWrapper = styled.div({
	padding: `${token('space.200', '16px')} ${token('space.400', '32px')}`,
});

export default function MacroFallbackCardIconsExample() {
	return (
		<IntlProvider locale="en">
			<MacroWrapper>
				<MacroFallbackCard
					macroName="Table Of Contents"
					extensionKey="toc"
					action="Cancel"
					loading={false}
					secondaryAction=""
				/>
			</MacroWrapper>
			<MacroWrapper>
				<MacroFallbackCard
					macroName="Jira"
					extensionKey="jira"
					action="Cancel"
					loading={false}
					secondaryAction=""
				/>
			</MacroWrapper>
			<MacroWrapper>
				<MacroFallbackCard
					macroName="Chart"
					extensionKey="chart:default"
					action="Cancel"
					loading={false}
					secondaryAction=""
				/>
			</MacroWrapper>
		</IntlProvider>
	);
}
