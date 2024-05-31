/** @jsx jsx */
import { Component } from 'react';
import type { CSSProperties } from 'react';

import { jsx } from '@emotion/react';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { getExtensionLozengeData } from '../../../utils';
import { styledImage } from '../styles';

import { LozengeComponent } from './LozengeComponent';

export interface Props {
	node: PmNode;
	showMacroInteractionDesignUpdates?: boolean;
	isNodeSelected?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	customContainerStyles?: CSSProperties;
	setIsNodeHovered?: (isHovered: boolean) => void;
	isBodiedMacro?: boolean;
}

export interface LozengeData {
	url: string;
	height?: number;
	width?: number;
}

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
			/>
		);
	};
}
