import React, { PureComponent, useCallback, useEffect, useRef, useState } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import ReactEditorViewContext from './ReactEditorViewContext';

type SimpleEventHandler<T> = (event: T) => void;

// Use this context to pass in the reference of the element that should be considered as the outside click target
// The outside click target is the element that should be clicked outside of to trigger the `handleClickOutside` event
export const OutsideClickTargetRefContext = React.createContext<(el: HTMLElement | null) => void>(
	() => Object,
);

// This needs exporting to be used alongside `withReactEditorViewOuterListeners`
export interface WithOutsideClickProps {
	handleClickOutside?: SimpleEventHandler<MouseEvent>;
	handleEscapeKeydown?: SimpleEventHandler<KeyboardEvent>;
	handleEnterKeydown?: SimpleEventHandler<KeyboardEvent>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	targetRef?: any;
	closeOnTab?: boolean;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class WithOutsideClick extends PureComponent<
	WithOutsideClickProps & {
		isActiveComponent: boolean;
		editorView?: EditorView;
		editorRef?: React.RefObject<HTMLDivElement>;
		popupsMountPoint?: HTMLElement;
		children?: React.ReactNode;
		outsideClickTargetRef: React.MutableRefObject<WeakRef<HTMLElement> | null>;
	},
	Object
> {
	componentDidMount() {
		if (this.props.handleClickOutside) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.addEventListener('click', this.handleClick, false);
		}

		if (this.props.handleEscapeKeydown) {
			// Attached event to the menu so that 'ESC' events from the opened menu also will be handled.
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			(this.props.popupsMountPoint
				? this.props.popupsMountPoint
				: undefined || this.props.editorRef?.current || this.props.targetRef || document
			)
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.addEventListener('keydown', this.handleKeydown as any, false);
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
			(this.props.popupsMountPoint
				? this.props.popupsMountPoint
				: undefined || this.props.editorRef?.current || this.props.targetRef || document
			)
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.removeEventListener('keydown', this.handleKeydown as any, false);
		}
	}

	handleClick = (evt: MouseEvent) => {
		if (!this.props.isActiveComponent || !this.props.handleClickOutside) {
			return;
		}

		const domNode = this.props.outsideClickTargetRef.current?.deref();

		if (!domNode || (evt.target instanceof Node && !domNode.contains(evt.target))) {
			this.props.handleClickOutside(evt);
			// When the menus are closed by clicking outside the focus is set on editor.
			if (!this.props.editorView?.hasFocus()) {
				this.props.editorView?.focus();
			}
		}
	};

	handleKeydown = (evt: KeyboardEvent) => {
		if (!this.props.isActiveComponent) {
			return;
		}
		if (evt.code === 'Escape' && this.props.handleEscapeKeydown) {
			evt.preventDefault();
			evt.stopPropagation();

			this.props.handleEscapeKeydown(evt);
			// on 'Esc', Focus is handled in 'handleEscapeKeydown'.
			return false;
		} else if (evt.code === 'Enter' && this.props.handleEnterKeydown) {
			this.props.handleEnterKeydown(evt);
		} else if (evt.code === 'Tab' && this.props.handleEscapeKeydown && this.props.closeOnTab) {
			// The menus should be closed when the tab is pressed as it takes the focus out of the menu
			this.props.handleEscapeKeydown(evt);
		}
	};

	render() {
		return this.props.children;
	}
}

type HasIsOpen = {
	isOpen: boolean;
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasIsOpen(props: any): props is HasIsOpen {
	return 'isOpen' in props;
}

export default function withReactEditorViewOuterListeners<P extends Object>(
	Component: React.ComponentType<React.PropsWithChildren<P>>,
): React.ComponentType<React.PropsWithChildren<P & WithOutsideClickProps>> {
	return ({
		handleClickOutside,
		handleEnterKeydown,
		handleEscapeKeydown,
		closeOnTab,
		...props
	}) => {
		const isActiveProp = hasIsOpen(props) ? props.isOpen : true;
		const [isActiveComponent, setActiveComponent] = useState(false);
		const outsideClickTargetRef = useRef<WeakRef<HTMLElement> | null>(null);
		const setOutsideClickTargetRef = useCallback(
			(el: HTMLElement | null) => {
				outsideClickTargetRef.current = el && new WeakRef(el);
			},
			[outsideClickTargetRef],
		);

		useEffect(() => {
			requestAnimationFrame(() => {
				setActiveComponent(isActiveProp);
			});
		}, [isActiveProp]);

		return (
			<ReactEditorViewContext.Consumer>
				{({ editorView, popupsMountPoint, editorRef }) => (
					<OutsideClickTargetRefContext.Provider value={setOutsideClickTargetRef}>
						<WithOutsideClick
							editorView={editorView}
							editorRef={editorRef}
							targetRef={props.targetRef}
							outsideClickTargetRef={outsideClickTargetRef}
							popupsMountPoint={popupsMountPoint}
							isActiveComponent={isActiveComponent}
							handleClickOutside={handleClickOutside}
							handleEnterKeydown={handleEnterKeydown}
							handleEscapeKeydown={handleEscapeKeydown}
							closeOnTab={closeOnTab}
						>
							<Component
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...(props as P)}
							/>
						</WithOutsideClick>
					</OutsideClickTargetRefContext.Provider>
				)}
			</ReactEditorViewContext.Consumer>
		);
	};
}
