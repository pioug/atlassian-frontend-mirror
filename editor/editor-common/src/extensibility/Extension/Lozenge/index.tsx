/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { getExtensionLozengeData } from '../../../utils';
import { type ExtensionsPluginInjectionAPI } from '../../types';
import { styledImage } from '../styles';

import { LozengeComponent } from './LozengeComponent';

export interface Props {
	customContainerStyles?: CSSProperties;
	isBodiedMacro?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	isNodeSelected?: boolean;
	node: PmNode;
	pluginInjectionApi?: ExtensionsPluginInjectionAPI;
	setIsNodeHovered?: (isHovered: boolean) => void;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
	showBodiedExtensionRendererView?: boolean;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showMacroInteractionDesignUpdates?: boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
}

export interface LozengeData {
	height?: number;
	url: string;
	width?: number;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export default class ExtensionLozenge extends Component<Props, any> {
	render() {
		const { node, showMacroInteractionDesignUpdates } = this.props;

		const imageData = getExtensionLozengeData({ node, type: 'image' });
		if (!showMacroInteractionDesignUpdates && imageData && node.type.name !== 'extension') {
			return this.renderImage(imageData);
		}

		const iconData = getExtensionLozengeData({ node, type: 'icon' });
		return this.renderFallback(iconData);
	}

	private renderImage = (lozengeData: LozengeData) => {
		const { extensionKey } = this.props.node.attrs;
		const { url, ...rest } = lozengeData;
		// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		return <img css={styledImage} src={url} {...rest} alt={extensionKey} />;
	};

	private renderFallback = (lozengeData?: LozengeData) => {
		const {
			showMacroInteractionDesignUpdates,
			isNodeSelected,
			isNodeHovered,
			isNodeNested,
			customContainerStyles,
			setIsNodeHovered,
			isBodiedMacro,
			showLivePagesBodiedMacrosRendererView,
			showUpdatedLivePages1PBodiedExtensionUI,
			showBodiedExtensionRendererView,
			setShowBodiedExtensionRendererView,
			pluginInjectionApi,
		} = this.props;
		const { parameters, extensionKey } = this.props.node.attrs;
		const { name } = this.props.node.type;
		const params = parameters && parameters.macroParams;
		const title =
			(parameters && parameters.extensionTitle) ||
			(parameters && parameters.macroMetadata && parameters.macroMetadata.title) ||
			extensionKey;

		return (
			<LozengeComponent
				isNodeHovered={isNodeHovered}
				isNodeSelected={isNodeSelected}
				isNodeNested={isNodeNested}
				showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
				extensionName={name}
				lozengeData={lozengeData}
				params={params}
				title={title}
				renderImage={this.renderImage}
				customContainerStyles={customContainerStyles}
				setIsNodeHovered={setIsNodeHovered}
				isBodiedMacro={isBodiedMacro}
				showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
				showUpdatedLivePages1PBodiedExtensionUI={showUpdatedLivePages1PBodiedExtensionUI}
				showBodiedExtensionRendererView={showBodiedExtensionRendererView}
				setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
				pluginInjectionApi={pluginInjectionApi}
			/>
		);
	};
}
