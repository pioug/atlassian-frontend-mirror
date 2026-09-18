import React, { useCallback, useMemo, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import Button from '@atlaskit/button/standard-button';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { EnvironmentsKeys } from '@atlaskit/linking-common/types';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Range from '@atlaskit/range/range';
import { token } from '@atlaskit/tokens';

import { Card } from '../../src';
import ActionBlock from '../../src/view/FlexibleCard/components/blocks/action-block';
import AIFooterBlock from '../../src/view/FlexibleCard/components/blocks/ai-footer-block';
import FooterBlock from '../../src/view/FlexibleCard/components/blocks/footer-block';
import ResolvedHoverCardFooterBlock from '../../src/view/FlexibleCard/components/blocks/hover-card-footer-block';
import MetadataBlock from '../../src/view/FlexibleCard/components/blocks/metadata-block';
import PreviewBlock from '../../src/view/FlexibleCard/components/blocks/preview-block';
import SnippetBlock from '../../src/view/FlexibleCard/components/blocks/snippet-block';
import TitleBlock from '../../src/view/FlexibleCard/components/blocks/title-block';
import withJsonldEditorProvider from '../jsonld-editor/jsonld-editor-provider';
import FlexibleDataView from '../utils/flexible-data-view';
import { type BlockTemplate, type FlexibleTemplate } from './types';

const backColor = token('color.background.neutral.subtle');
const frontColor = token('color.background.neutral.subtle.hovered');
const backgroundStyles = xcss({
	backgroundColor: 'color.background.neutral.subtle',
	opacity: 1,
	backgroundImage: `repeating-linear-gradient( 45deg, ${frontColor} 25%, transparent 25%, transparent 75%, ${frontColor} 75%, ${frontColor} ), repeating-linear-gradient( 45deg, ${frontColor} 25%, ${backColor} 25%, ${backColor} 75%, ${frontColor} 75%, ${frontColor} )`,
	backgroundPosition: '0 0, 6px 6px',
	backgroundSize: '12px 12px',
	borderRadius: 'radius.xsmall',
	padding: 'space.100',
	marginBottom: 'space.100',
	position: 'relative',
});

const cardContainerStyles = xcss({
	margin: '0 auto',
	minWidth: '10rem',
});

const dataContainerStyles = xcss({
	margin: '0 auto',
	minWidth: '25rem',
	width: '60%',
});

const toggleContainerStyles = xcss({
	position: 'absolute',
	right: '0.5rem',
});

const Blocks = {
	ActionBlock,
	AIFooterBlock,
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
	ResolvedHoverCardFooterBlock,
};

const renderBlock = ({ name, ...props }: BlockTemplate, key: string) => {
	const Block = Blocks[name];
	return Block ? <Block key={key} {...props} /> : null;
};

const TemplateRenderer = ({ template, url }: { template: FlexibleTemplate; url?: string }) => {
	const [width, setWidth] = useState(60);
	const handleOnChange = useCallback((width: number) => setWidth(width), []);

	const [showDataView, setShowDataView] = useState(false);
	const handleViewChange = useCallback(() => setShowDataView((prev) => !prev), []);

	const showToggle = useMemo(
		() => template && template.blocks && template.blocks.length > 0,
		[template],
	);

	return (
		<React.Fragment>
			<Range max={100} min={20} step={1} value={width} onChange={handleOnChange} />
			<Box xcss={backgroundStyles}>
				{showToggle && (
					<Box xcss={toggleContainerStyles}>
						<DropdownMenu
							trigger={({ triggerRef, ...props }) => (
								<Button
									{...props}
									iconBefore={<MoreIcon label="more" color="currentColor" />}
									ref={triggerRef}
									spacing="compact"
								/>
							)}
						>
							<DropdownItemRadioGroup id="renderer-actions">
								<DropdownItemRadio id="card" isSelected={!showDataView} onClick={handleViewChange}>
									Card view
								</DropdownItemRadio>
								<DropdownItemRadio id="data" isSelected={showDataView} onClick={handleViewChange}>
									Data view
								</DropdownItemRadio>
							</DropdownItemRadioGroup>
						</DropdownMenu>
					</Box>
				)}
				<ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
					<Box
						xcss={dataContainerStyles}
						style={{
							opacity: showDataView ? 1 : 0,
							display: showDataView ? 'block' : 'none',
						}}
					>
						<FlexibleDataView url={url} />
					</Box>
					<Box
						xcss={cardContainerStyles}
						style={{
							opacity: showDataView ? 0 : 1,
							display: showDataView ? 'none' : 'block',
							width: `${width}%`,
						}}
					>
						<Card appearance="block" {...template.cardProps} ui={template.ui} url={url}>
							{template.blocks?.map((block, idx) => renderBlock(block, block.name + idx))}
						</Card>
					</Box>
				</ErrorBoundary>
			</Box>
		</React.Fragment>
	);
};

const _default_1: (
	props: {
		template: FlexibleTemplate;
		url?: string;
	} & {
		ari?: string;
		branchDeploy?: string;
		envKey?: EnvironmentsKeys;
		json?: JsonLd.Response;
		onError?: (error: Error) => void;
		onFetch?: () => JsonLd.Response | undefined;
		onResolve?: (json: JsonLd.Response) => void;
		url: string;
	} & {
		children?: React.ReactNode | undefined;
	},
) => React.JSX.Element = withJsonldEditorProvider(TemplateRenderer);
export default _default_1;
