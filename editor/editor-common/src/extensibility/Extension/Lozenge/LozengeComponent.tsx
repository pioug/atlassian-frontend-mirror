/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';

import { placeholderFallback, placeholderFallbackParams } from '../styles';

import { EditToggle } from './EditToggle';
import { ExtensionLabel } from './ExtensionLabel';

import type { LozengeData } from './index';

export const ICON_SIZE = 24;
const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

type LozengeComponentProps = {
	lozengeData?: LozengeData;
	extensionName: string;
	title: string;
	params: any;
	renderImage: (lozengeData: LozengeData) => void;
	isNodeSelected?: boolean;
	showMacroInteractionDesignUpdates?: boolean;
	showMacroButtonUpdates?: boolean;
	customContainerStyles?: CSSProperties;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	setIsNodeHovered?: (isHovered: boolean) => void;
	isBodiedMacro?: boolean;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
	showBodiedExtensionRendererView?: boolean;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
};

export const LozengeComponent = ({
	lozengeData,
	extensionName,
	title,
	params,
	renderImage,
	showMacroInteractionDesignUpdates,
	showMacroButtonUpdates,
	customContainerStyles,
	isNodeHovered,
	isNodeNested,
	setIsNodeHovered,
	isBodiedMacro,
	showLivePagesBodiedMacrosRendererView,
	showUpdatedLivePages1PBodiedExtensionUI,
	showBodiedExtensionRendererView,
	setShowBodiedExtensionRendererView,
}: LozengeComponentProps) => {
	const capitalizedTitle = capitalizeFirstLetter(title);
	if (showMacroInteractionDesignUpdates) {
		return (
			<Fragment>
				<ExtensionLabel
					text={capitalizedTitle}
					extensionName={extensionName}
					isNodeHovered={isNodeHovered}
					isNodeNested={isNodeNested}
					customContainerStyles={customContainerStyles}
					setIsNodeHovered={setIsNodeHovered}
					isBodiedMacro={isBodiedMacro}
					showMacroButtonUpdates={showMacroButtonUpdates}
					showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
					showUpdatedLivePages1PBodiedExtensionUI={showUpdatedLivePages1PBodiedExtensionUI}
					showBodiedExtensionRendererView={showBodiedExtensionRendererView}
				/>
				{showLivePagesBodiedMacrosRendererView && isBodiedMacro && (
					<EditToggle
						isNodeHovered={isNodeHovered}
						setIsNodeHovered={setIsNodeHovered}
						customContainerStyles={customContainerStyles}
						showBodiedExtensionRendererView={showBodiedExtensionRendererView}
						setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
					/>
				)}
			</Fragment>
		);
	}
	const isBlockExtension = extensionName === 'extension';
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div data-testid="lozenge-fallback" css={placeholderFallback}>
			{lozengeData && !isBlockExtension ? (
				renderImage({
					height: ICON_SIZE,
					width: ICON_SIZE,
					...lozengeData,
				})
			) : (
				<EditorFileIcon label={title} />
			)}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<span className="extension-title">{capitalizedTitle}</span>
			{params && !isBlockExtension && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={placeholderFallbackParams}>
					{Object.keys(params).map((key) => key && ` | ${key} = ${params[key].value}`)}
				</span>
			)}
		</div>
	);
};
