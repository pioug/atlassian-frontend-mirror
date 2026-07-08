/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */

import React from 'react';

import { jsx } from '@compiled/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import {
	buildAnchorDecorationKey,
	AnchorTypeKey,
} from '../../pm-plugins/decorations/decorationKeys';
import type { DiffDescriptor, ShowDiffPlugin } from '../../showDiffPluginType';

import { IndicatorBar } from './IndicatorBar';

const renderIndicatorBar = (descriptor: DiffDescriptor) => {
	switch (descriptor.type) {
		case 'inline': {
			return (
				<IndicatorBar
					key={descriptor.id}
					anchorTop={buildAnchorDecorationKey({
						diffId: descriptor.id,
						anchorType: AnchorTypeKey.from,
					})}
					anchorBottom={buildAnchorDecorationKey({
						diffId: descriptor.id,
						anchorType: AnchorTypeKey.to,
					})}
					anchorLeft={buildAnchorDecorationKey({
						diffId: descriptor.id,
						anchorType: AnchorTypeKey.left,
					})}
				/>
			);
		}
		case 'block': {
			// The block anchor is a single element (keyed by diffId with no
			// anchorType) sized to the full height of the block node, so top,
			// bottom and left all resolve against it.
			const blockAnchor = buildAnchorDecorationKey({
				diffId: descriptor.id,
			});
			return (
				<IndicatorBar
					key={descriptor.id}
					anchorTop={blockAnchor}
					anchorBottom={blockAnchor}
					anchorLeft={buildAnchorDecorationKey({
						diffId: descriptor.id,
						anchorType: AnchorTypeKey.left,
					})}
				/>
			);
		}
		case 'widget': {
			return (
				<IndicatorBar
					key={descriptor.id}
					anchorTop={buildAnchorDecorationKey({
						diffId: descriptor.id,
					})}
					anchorBottom={buildAnchorDecorationKey({
						diffId: descriptor.id,
					})}
					anchorLeft={buildAnchorDecorationKey({
						diffId: descriptor.id,
						anchorType: AnchorTypeKey.left,
					})}
					anchorLeftFallback={buildAnchorDecorationKey({
						diffId: descriptor.id,
					})}
				/>
			);
		}
		default:
			return null;
	}
};

/**
 * Renders IndicatorBar elements for each diff ID in the current plugin state.
 *
 * This is rendered as a contentComponent so that the IndicatorBar elements
 * share the same DOM context as their CSS anchor spans, allowing the browser
 * to resolve anchor-name references correctly.
 */

export const IndicatorBarContentComponent = ({
	api,
}: {
	api?: ExtractInjectionAPI<ShowDiffPlugin>;
}): JSX.Element | null => {
	const { showIndicators, isDisplayingChanges, diffDescriptors } = useSharedPluginStateWithSelector(
		api,
		['showDiff'],
		(state) => {
			return {
				showIndicators: state.showDiffState?.showIndicators,
				isDisplayingChanges: state.showDiffState?.isDisplayingChanges,
				diffDescriptors: state.showDiffState?.diffDescriptors,
			};
		},
	);

	if (!showIndicators || !isDisplayingChanges || !diffDescriptors?.length) {
		return null;
	}

	return <>{diffDescriptors.map(renderIndicatorBar)}</>;
};
