import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { fg } from '@atlaskit/platform-feature-flags';

export interface Props {
	children?: any;
	offsetX?: number;
	offsetY?: number;
	relativePosition?: 'above' | 'below' | 'auto';
	target?: string;
	zIndex?: number | string;
}

/*
 * Simple implementation of popup while waiting for ak-inline-dialog
 */
export default class Popup extends React.PureComponent<Props, {}> {
	private popup?: HTMLElement | null;
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
		if (!fg('mentions-migrate-react-dom')) {
			this.popup = document.createElement('div');
			document.body.appendChild(this.popup);
			this.popup.style.position = 'absolute';
		}
		this._applyAbsolutePosition();
		this._renderContent();
	}

	componentDidUpdate() {
		this._renderContent();
	}

	componentWillUnmount() {
		if (!fg('mentions-migrate-react-dom')) {
			if (this.popup) {
				ReactDOM.unmountComponentAtNode(this.popup);
				document.body.removeChild(this.popup);
			}
		}
	}

	_applyBelowPosition() {
		const targetNode = this.props.target && document.getElementById(this.props.target);
		if (targetNode) {
			const box = targetNode.getBoundingClientRect();
			const top = box.bottom + (this.props.offsetY || 0);
			const left = box.left + (this.props.offsetX || 0);
			if (fg('mentions-migrate-react-dom')) {
				this.setPortalStyles({ top: `${top}px`, bottom: '', left: `${left}px` });
			} else {
				if (this.popup) {
					this.popup.style.top = `${top}px`;
					this.popup.style.bottom = '';
					this.popup.style.left = `${left}px`;
				}
			}
		}
	}

	_applyAbovePosition() {
		const targetNode = this.props.target && document.getElementById(this.props.target);
		if (targetNode) {
			const box = targetNode.getBoundingClientRect();
			const bottom = window.innerHeight - box.top + (this.props.offsetY || 0);
			const left = box.left + (this.props.offsetX || 0);
			if (fg('mentions-migrate-react-dom')) {
				this.setPortalStyles({ top: '', bottom: `${bottom}px`, left: `${left}px` });
			} else {
				if (this.popup) {
					this.popup.style.top = '';
					this.popup.style.bottom = `${bottom}px`;
					this.popup.style.left = `${left}px`;
				}
			}
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
		if (fg('mentions-migrate-react-dom')) {
			if (this.props.zIndex) {
				this.setPortalStyles({ zIndex: this.props.zIndex });
			}
		} else {
			if (this.props.zIndex && this.popup) {
				this.popup.style.zIndex = `${this.props.zIndex}`;
			}
		}
	}

	_renderContent() {
		if (!fg('mentions-migrate-react-dom')) {
			if (this.popup) {
				ReactDOM.render(this.props.children, this.popup);
			}
		}
	}

	render() {
		if (fg('mentions-migrate-react-dom')) {
			// https://atlassian.design/components/eslint-plugin-ui-styling-standard/migration-guide#dynamic-styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			const content = <div style={this.portalStyles}>{this.props.children}</div>;
			return <>{createPortal(content, document.body)}</>;
		} else {
			// Placeholder element for react to render inplace
			<div />;
		}
	}
}
