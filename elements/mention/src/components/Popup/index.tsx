import React from 'react';
import { createPortal } from 'react-dom';

export interface Props {
	children?: any;
	offsetX?: number;
	offsetY?: number;
	relativePosition?: 'above' | 'below' | 'auto';
	target?: string;
	zIndex?: number | string;
}

export default class Popup extends React.PureComponent<Props, {}> {
	private portalStyles: Record<string, string | number | null>;

	constructor(props: Props) {
		super(props);
		this.portalStyles = {
			position: 'absolute',
			top: null,
			bottom: null,
			left: null,
			zIndex: null,
		};
	}

	setPortalStyles(styles: Record<string, string | number | null>) {
		this.portalStyles = {
			...this.portalStyles,
			...styles,
		};
	}

	static defaultProps = {
		relativePosition: 'auto',
		offsetX: 0,
		offsetY: 0,
		zIndex: 0,
	};

	componentDidMount() {
		this._applyAbsolutePosition();
	}

	_applyBelowPosition() {
		const targetNode = this.props.target && document.getElementById(this.props.target);
		if (targetNode) {
			const box = targetNode.getBoundingClientRect();
			const top = box.bottom + (this.props.offsetY || 0);
			const left = box.left + (this.props.offsetX || 0);
			this.setPortalStyles({ top: `${top}px`, bottom: '', left: `${left}px` });
		}
	}

	_applyAbovePosition() {
		const targetNode = this.props.target && document.getElementById(this.props.target);
		if (targetNode) {
			const box = targetNode.getBoundingClientRect();
			const bottom = window.innerHeight - box.top + (this.props.offsetY || 0);
			const left = box.left + (this.props.offsetX || 0);
			this.setPortalStyles({ top: '', bottom: `${bottom}px`, left: `${left}px` });
		}
	}

	_applyAbsolutePosition() {
		if (this.props.relativePosition === 'above') {
			this._applyAbovePosition();
		} else if (this.props.relativePosition === 'below') {
			this._applyBelowPosition();
		} else {
			const targetNode = this.props.target && document.getElementById(this.props.target);
			if (targetNode) {
				const box = targetNode.getBoundingClientRect();
				const viewPortHeight = window.innerHeight;
				if (box.top < viewPortHeight / 2) {
					this._applyBelowPosition();
				} else {
					this._applyAbovePosition();
				}
			}
		}
		if (this.props.zIndex) {
			this.setPortalStyles({ zIndex: this.props.zIndex });
		}
	}

	render() {
		// https://atlassian.design/components/eslint-plugin-ui-styling-standard/migration-guide#dynamic-styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		const content = <div style={this.portalStyles}>{this.props.children}</div>;
		return <>{createPortal(content, document.body)}</>;
	}
}
