import type { ComponentClass, MutableRefObject } from 'react';
import React, { PureComponent } from 'react';

import ReactDOM from 'react-dom';

import { fg } from '@atlaskit/platform-feature-flags';

type SimpleEventHandler<T> = (event: T) => void;

export interface WithOutsideClickProps {
	handleClickOutside?: SimpleEventHandler<MouseEvent>;
	handleEscapeKeydown?: SimpleEventHandler<KeyboardEvent>;
}

// Use this context to pass in the reference of the element that should be considered as the outside click target
// The outside click target is the element that should be clicked outside of to trigger the `handleClickOutside` event
export const PlainOutsideClickTargetRefContext = React.createContext<
	(el: HTMLElement | null) => void
>(() => {});

export default function withOuterListeners<P>(
	Component: React.ComponentType<React.PropsWithChildren<P>>,
): ComponentClass<P & WithOutsideClickProps> {
	return class WithOutsideClick extends PureComponent<P & WithOutsideClickProps, {}> {
		private outsideClickTargetRef: MutableRefObject<WeakRef<HTMLElement> | null> =
			React.createRef();

		componentDidMount() {
			if (this.props.handleClickOutside) {
				document.addEventListener('click', this.handleClick, false);
			}

			if (this.props.handleEscapeKeydown) {
				document.addEventListener('keydown', this.handleKeydown, false);
			}
		}

		componentWillUnmount() {
			if (this.props.handleClickOutside) {
				document.removeEventListener('click', this.handleClick, false);
			}

			if (this.props.handleEscapeKeydown) {
				document.removeEventListener('keydown', this.handleKeydown, false);
			}
		}

		handleClick = (evt: MouseEvent) => {
			const domNode = fg('platform_editor_replace_finddomnode_in_common')
				? this.outsideClickTargetRef.current?.deref()
				: ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

			if (!domNode || (evt.target instanceof Node && !domNode.contains(evt.target))) {
				this.props.handleClickOutside?.(evt);
			}
		};

		handleKeydown = (evt: KeyboardEvent) => {
			if (evt.code === 'Escape' && this.props.handleEscapeKeydown) {
				this.props.handleEscapeKeydown(evt);
			}
		};

		private setOutsideClickTargetRef = (el: HTMLElement | null) => {
			this.outsideClickTargetRef.current = el && new WeakRef(el);
		};

		render() {
			return (
				<PlainOutsideClickTargetRefContext.Provider value={this.setOutsideClickTargetRef}>
					<Component {...this.props} />
				</PlainOutsideClickTargetRefContext.Provider>
			);
		}
	};
}
