import { Component } from 'react';

export const createGenericComponent = <T extends any = any>(
	displayName: string,
	renderChildren: boolean = true,
	childrenParams?: unknown,
): T =>
	class extends Component<any> {
		static displayName = displayName;

		render() {
			if (renderChildren && typeof this.props.children === 'function') {
				if (childrenParams) {
					return this.props.children(childrenParams);
				}
				return this.props.children();
			}
			if (renderChildren && this.props.children) {
				return this.props.children;
			}
			return null;
		}
	} as T;
