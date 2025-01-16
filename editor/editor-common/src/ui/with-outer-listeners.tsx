import type { ComponentClass, MutableRefObject } from 'react';
import React, { PureComponent } from 'react';

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
	return class WithOutsideClick extends PureComponent<P & WithOutsideClickProps, Object> {
		private outsideClickTargetRef: MutableRefObject<WeakRef<HTMLElement> | null> =
			React.createRef();

		componentDidMount() {
			if (this.props.handleClickOutside) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				document.addEventListener('click', this.handleClick, false);
			}

			if (this.props.handleEscapeKeydown) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				document.addEventListener('keydown', this.handleKeydown, false);
			}
		}

		componentWillUnmount() {
			if (this.props.handleClickOutside) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				document.removeEventListener('click', this.handleClick, false);
			}

			if (this.props.handleEscapeKeydown) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				document.removeEventListener('keydown', this.handleKeydown, false);
			}
		}

		handleClick = (evt: MouseEvent) => {
			const domNode = this.outsideClickTargetRef.current?.deref();

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
					<Component
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...this.props}
					/>
				</PlainOutsideClickTargetRefContext.Provider>
			);
		}
	};
}
