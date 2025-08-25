import React, { PureComponent } from 'react';

import { OutsideClickTargetRefContext, withReactEditorViewOuterListeners } from '../../ui-react';
import type { WithOutsideClickProps } from '../../ui-react/with-react-editor-view-outer-listeners';
import type { OpenChangedEvent } from '../../ui/DropList';
import DropdownList from '../../ui/DropList';
import Popup from '../../ui/Popup';
import { calculatePlacement } from '../../ui/Popup/utils';
import { ArrowKeyNavigationProvider } from '../ArrowKeyNavigationProvider';
import type { ArrowKeyNavigationProviderOptions } from '../ArrowKeyNavigationProvider/types';

export interface Props {
	alignDropdownWithParentElement?: boolean;
	alignX?: 'left' | 'right' | 'center';
	alignY?: 'start' | 'bottom' | 'top';
	arrowKeyNavigationProviderOptions: ArrowKeyNavigationProviderOptions;
	boundariesElement?: HTMLElement;
	children?: React.ReactNode;
	dropdownListId?: string;
	fitHeight?: number;
	fitWidth?: number;
	forcePlacement?: boolean;
	isOpen?: boolean;
	mountTo?: HTMLElement;
	offset?: [number, number];
	onOpenChange?: (attrs: OpenChangedEvent) => void;
	scrollableElement?: HTMLElement;
	shouldFitContainer?: boolean;
	target?: HTMLElement;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	trigger?: React.ReactElement<any>;
	zIndex?: number;
}

export interface State {
	popupPlacement: [string, string];
	target?: HTMLElement;
}

/**
 * Wrapper around @atlaskit/droplist which uses Popup and Portal to render
 * droplist outside of "overflow: hidden" containers when needed.
 *
 * Also it controls popper's placement.
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class Dropdown extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			popupPlacement: ['bottom', 'left'],
		};
	}

	private handleRef =
		(setOutsideClickTargetRef: (el: HTMLElement | null) => void) =>
		(target: HTMLElement | null) => {
			setOutsideClickTargetRef(target);
			this.setState({ target: target || undefined });
		};

	private updatePopupPlacement = (placement: [string, string]) => {
		this.setState({ popupPlacement: placement });
	};

	private handleCloseAndFocus = (event: MouseEvent | KeyboardEvent) => {
		this.state.target?.querySelector('button')?.focus();
		this.handleClose(event);
	};

	private handleClose = (event: MouseEvent | KeyboardEvent) => {
		if (this.props.onOpenChange) {
			this.props.onOpenChange({ isOpen: false, event });
		}
	};

	componentDidUpdate(prevProps: Readonly<Props>): void {
		if (!prevProps.isOpen && this.props.isOpen && this.state.target) {
			// Dropdown flickers when opens as placement is calculated in Popup component and updated after the first render.
			// popupPlacement is set to ['bottom', 'left'] by default, but it may not be the correct placement and is required in DropdownList.
			// To avoid flicker we calculate placement here and set it to state when the dropdown opens.
			const initialPlacement = calculatePlacement(
				this.state.target,
				this.props.boundariesElement || document.body,
				this.props.fitWidth,
				this.props.fitHeight,
				this.props.alignX,
				this.props.alignY,
				this.props.forcePlacement,
			);
			this.setState({ popupPlacement: initialPlacement });
		}
	}

	private renderDropdown() {
		const { target, popupPlacement } = this.state;
		const {
			children,
			mountTo,
			boundariesElement,
			scrollableElement,
			onOpenChange,
			fitHeight,
			fitWidth,
			zIndex,
			arrowKeyNavigationProviderOptions,
			dropdownListId,
			alignDropdownWithParentElement,
			target: targetProp,
			forcePlacement,
			alignX,
			alignY,
			offset,
			shouldFitContainer = true,
		} = this.props;

		return (
			<Popup
				target={
					targetProp ??
					(alignDropdownWithParentElement
						? // Ignored via go/ees005
							// eslint-disable-next-line @atlaskit/editor/no-as-casting
							(target?.closest("[data-testid='editor-floating-toolbar']") as HTMLElement)
						: target)
				}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				onPlacementChanged={forcePlacement ? undefined : this.updatePopupPlacement}
				fitHeight={fitHeight}
				fitWidth={fitWidth}
				zIndex={zIndex}
				allowOutOfBounds={alignDropdownWithParentElement}
				alignX={alignX}
				alignY={alignY}
				forcePlacement={forcePlacement}
				offset={offset}
			>
				<ArrowKeyNavigationProvider
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...arrowKeyNavigationProviderOptions}
					closeOnTab={true}
					handleClose={this.handleCloseAndFocus}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ height: 0, minWidth: fitWidth || 0 }}>
						<DropdownList
							isOpen={true}
							onOpenChange={onOpenChange}
							position={popupPlacement.join(' ')}
							shouldFitContainer={shouldFitContainer}
							id={dropdownListId}
						>
							{children}
						</DropdownList>
					</div>
				</ArrowKeyNavigationProvider>
			</Popup>
		);
	}

	render() {
		const { trigger, isOpen } = this.props;

		return trigger ? (
			<OutsideClickTargetRefContext.Consumer>
				{(setOutsideClickTargetRef) => (
					<>
						<div ref={this.handleRef(setOutsideClickTargetRef)}>{trigger}</div>
						{isOpen ? this.renderDropdown() : null}
					</>
				)}
			</OutsideClickTargetRefContext.Consumer>
		) : (
			<>{isOpen ? this.renderDropdown() : null}</>
		);
	}
}

export type DropdownPropsWithOutsideClickProps = Props & WithOutsideClickProps;

const DropdownWithOuterListeners = withReactEditorViewOuterListeners(
	Dropdown,
) as React.ComponentType<React.PropsWithChildren<DropdownPropsWithOutsideClickProps>>;

export default DropdownWithOuterListeners;
