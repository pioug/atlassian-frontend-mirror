/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { IconType } from '../../src/constants';
import { IconGrid, IconVariant, sizes } from '../utils/icon-element-variations-shared';
import VRTestWrapper from '../utils/vr-test-wrapper';

const gridTemplateColumns = `repeat(auto-fill, minmax(40px, 1fr))`;
const activeSizes = sizes;
const tileVariants = [false, true];
const contentStyles = css({ maxWidth: '1200px' });

const mockProviderIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" rx="6" fill="#0C66E4"/></svg>')}`;

const allIconTypes = Object.entries(IconType) as [string, IconType][];

export const IconElementAllVariations = (): React.JSX.Element => (
	<VRTestWrapper>
		<div css={contentStyles}>
			<Stack space="space.200">
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					{allIconTypes.map(([name, value]) => (
						<IconVariant
							key={name}
							label={name}
							icon={value}
							activeSizes={activeSizes}
							showBorder={false}
							showSizingOverlay={false}
							showTitle={false}
							tileVariants={tileVariants}
						/>
					))}
				</IconGrid>

				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					<IconVariant
						label="url-provider"
						url={mockProviderIconUrl}
						activeSizes={activeSizes}
						showBorder={false}
						showSizingOverlay={false}
						showTitle={false}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="Emoji render"
						render={() => (
							<span role="img" aria-label="rocket">
								🚀
							</span>
						)}
						activeSizes={activeSizes}
						showBorder={false}
						showSizingOverlay={false}
						showTitle={false}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="Text render"
						render={() => <span>AB</span>}
						activeSizes={activeSizes}
						showBorder={false}
						showSizingOverlay={false}
						showTitle={false}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="SVG render"
						render={() => (
							<svg viewBox="0 0 16 16" width="16" height="16">
								<circle cx="8" cy="8" r="7" fill={token('color.icon.brand')} />
							</svg>
						)}
						activeSizes={activeSizes}
						showBorder={false}
						showSizingOverlay={false}
						showTitle={false}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="(default LinkIcon)"
						activeSizes={activeSizes}
						showBorder={false}
						showSizingOverlay={false}
						showTitle={false}
						tileVariants={tileVariants}
					/>
				</IconGrid>
			</Stack>
		</div>
	</VRTestWrapper>
);
