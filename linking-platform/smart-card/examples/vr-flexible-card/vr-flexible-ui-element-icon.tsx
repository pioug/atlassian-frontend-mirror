/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { smallImage } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';

import { IconType, SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { LinkIcon } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const boxStyles = css({
	color: token('color.text.inverse', '#FFFFFF'),
	backgroundColor: token('color.icon.brand', '#0C66E4'),
	borderRadius: token('radius.medium', '6px'),
});
const linkIconStyles = css({
	backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	borderRadius: token('radius.full', '15px'),
});

const context = getContext();

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context }}>
				{Object.values(SmartLinkSize).map((size, sIdx) => (
					<React.Fragment key={sIdx}>
						<h5>Size: {size}</h5>
						<HorizontalWrapper>
							{Object.values(IconType)
								.filter((iconType) => !iconType.startsWith('Badge:'))
								.map((iconType, tIdx) => (
									<LinkIcon
										key={`${sIdx}-${tIdx}`}
										icon={iconType}
										label={iconType}
										size={size}
										testId={`vr-test-icon-${sIdx}-${tIdx}`}
									/>
								))}
						</HorizontalWrapper>
					</React.Fragment>
				))}
				<h5>Custom icon</h5>
				<HorizontalWrapper>
					{Object.values(SmartLinkSize).map((size, idx) => (
						<LinkIcon key={idx} render={() => 'LP'} size={size} />
					))}
					{Object.values(SmartLinkSize).map((size, idx) => (
						<LinkIcon key={idx} render={() => <div css={boxStyles}>LP</div>} size={size} />
					))}
					{Object.values(SmartLinkSize).map((size, idx) => (
						// eslint-disable-next-line jsx-a11y/alt-text
						<LinkIcon key={idx} render={() => <img src={smallImage} alt="" />} size={size} />
					))}
				</HorizontalWrapper>
				<h5>Override CSS</h5>
				<LinkIcon
					icon={IconType.Default}
					label="Override css"
					css={linkIconStyles}
					size={SmartLinkSize.XLarge}
				/>
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
