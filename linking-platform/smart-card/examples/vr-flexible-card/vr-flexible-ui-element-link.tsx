/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { SmartLinkSize, SmartLinkStatus, SmartLinkTheme } from '../../src/constants';
import { FlexibleCardContext, FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { Title } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const overrideCss = css({
	color: token('color.text.accent.green', '#226E4E'),
	fontStyle: 'italic',
});
const context = getContext();
const renderTitle = (maxLines = 2, size = SmartLinkSize.Medium, theme = SmartLinkTheme.Link) => (
	<Title maxLines={maxLines} size={size} theme={theme} testId="vr-test-title" />
);

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context, status: SmartLinkStatus.Resolved }}>
				{/* Remove FlexibleUiContext on cleanup of platform-linking-flexible-card-context */}
				<FlexibleUiContext.Provider value={context}>
					{Object.values(SmartLinkSize).map((size, idx) => (
						<React.Fragment key={idx}>
							<h5>Size: {size}</h5>
							{renderTitle(2, size, SmartLinkTheme.Link)}
						</React.Fragment>
					))}
					{Object.values(SmartLinkTheme).map((theme, idx) => (
						<React.Fragment key={idx}>
							<h5>Theme: {theme}</h5>
							{renderTitle(2, SmartLinkSize.Medium, theme)}
						</React.Fragment>
					))}
					{[2, 1].map((maxLines, idx) => (
						<React.Fragment key={idx}>
							<h5>Max lines: {maxLines}</h5>
							{renderTitle(maxLines, SmartLinkSize.Medium, SmartLinkTheme.Link)}
						</React.Fragment>
					))}
					<h5>Override CSS</h5>
					<Title css={overrideCss} />
				</FlexibleUiContext.Provider>
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
