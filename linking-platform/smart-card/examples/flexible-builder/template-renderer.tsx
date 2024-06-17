/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '@atlaskit/dropdown-menu';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Range from '@atlaskit/range/range';
import { Card } from '../../src';
import { type BlockTemplate, type FlexibleTemplate } from './types';
import { token } from '@atlaskit/tokens';
import * as Blocks from '../../src/view/FlexibleCard/components/blocks';
import withJsonldEditorProvider from '../jsonld-editor/jsonld-editor-provider';
import FlexibleDataView from '../utils/flexible-data-view';

const backColor = token('color.background.neutral.subtle', '#FFFFFF');
const frontColor = token('color.background.neutral.subtle.hovered', '#091E420F');
const backgroundStyles = css({
	backgroundColor: backColor,
	opacity: 1,
	backgroundImage: `repeating-linear-gradient( 45deg, ${frontColor} 25%, transparent 25%, transparent 75%, ${frontColor} 75%, ${frontColor} ), repeating-linear-gradient( 45deg, ${frontColor} 25%, ${backColor} 25%, ${backColor} 75%, ${frontColor} 75%, ${frontColor} )`,
	backgroundPosition: '0 0, 6px 6px',
	backgroundSize: '12px 12px',
	borderRadius: '0.125rem',
	padding: '0.5rem',
	marginBottom: '1rem',
	position: 'relative',
});

const toggleStyles = (show: boolean) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		opacity: show ? 1 : 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		display: show ? 'block' : 'none',
	});

const cardContainerStyles = (width: number, show: boolean = true) =>
	css(
		{
			margin: '0 auto',
			minWidth: '10rem',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `${width}%`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		toggleStyles(show),
	);

const dataContainerStyles = (show: boolean) =>
	css(
		{
			margin: '0 auto',
			minWidth: '25rem',
			width: '60%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		toggleStyles(show),
	);

const toggleContainerStyles = css({
	position: 'absolute',
	right: '0.5rem',
});

const renderBlock = ({ name, ...props }: BlockTemplate, key: string) => {
	const Block = Blocks[name];
	return Block ? <Block key={key} {...props} /> : null;
};

const TemplateRenderer: React.FC<{
	template: FlexibleTemplate;
	url?: string;
}> = ({ template, url }) => {
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
			<div css={backgroundStyles}>
				{showToggle && (
					<span css={toggleContainerStyles}>
						<DropdownMenu
							trigger={({ triggerRef, ...props }) => (
								<Button
									{...props}
									iconBefore={<MoreIcon label="more" />}
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
					</span>
				)}
				<ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={dataContainerStyles(showDataView)}>
						<FlexibleDataView url={url} />
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={cardContainerStyles(width, !showDataView)}>
						<Card appearance="block" {...template.cardProps} ui={template.ui} url={url}>
							{template.blocks?.map((block, idx) => renderBlock(block, block.name + idx))}
						</Card>
					</div>
				</ErrorBoundary>
			</div>
		</React.Fragment>
	);
};

export default withJsonldEditorProvider(TemplateRenderer);
