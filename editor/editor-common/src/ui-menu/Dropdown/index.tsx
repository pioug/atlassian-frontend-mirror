import React, { PureComponent } from 'react';

import { withReactEditorViewOuterListeners } from '../../ui-react';
import type { WithOutsideClickProps } from '../../ui-react/with-react-editor-view-outer-listeners';
import type { OpenChangedEvent } from '../../ui/DropList';
import DropdownList from '../../ui/DropList';
import Popup from '../../ui/Popup';
import { ArrowKeyNavigationProvider } from '../ArrowKeyNavigationProvider';
import type { ArrowKeyNavigationProviderOptions } from '../ArrowKeyNavigationProvider/types';

export interface Props {
	children?: React.ReactNode;
	mountTo?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	trigger: React.ReactElement<any>;
	isOpen?: boolean;
	onOpenChange?: (attrs: OpenChangedEvent) => void;
	fitWidth?: number;
	fitHeight?: number;
	zIndex?: number;
	arrowKeyNavigationProviderOptions: ArrowKeyNavigationProviderOptions;
	dropdownListId?: string;
	alignDropdownWithParentElement?: boolean;
}

export interface State {
	target?: HTMLElement;
	popupPlacement: [string, string];
}

/**
 * Wrapper around @atlaskit/droplist which uses Popup and Portal to render
 * droplist outside of "overflow: hidden" containers when needed.
 *
 * Also it controls popper's placement.
 */
export class Dropdown extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			popupPlacement: ['bottom', 'left'],
		};
	}

	private handleRef = (target: HTMLElement | null) => {
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
		} = this.props;

		return (
			<Popup
				target={
					alignDropdownWithParentElement
						? (target?.closest("[data-testid='editor-floating-toolbar']") as HTMLElement)
						: target
				}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				onPlacementChanged={this.updatePopupPlacement}
				fitHeight={fitHeight}
				fitWidth={fitWidth}
				zIndex={zIndex}
				allowOutOfBounds={alignDropdownWithParentElement}
			>
				<ArrowKeyNavigationProvider
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
							shouldFitContainer={true}
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

		return (
			<>
				<div ref={this.handleRef}>{trigger}</div>
				{isOpen ? this.renderDropdown() : null}
			</>
		);
	}
}

export type DropdownPropsWithOutsideClickProps = Props & WithOutsideClickProps;

const DropdownWithOuterListeners = withReactEditorViewOuterListeners(
	Dropdown,
) as React.ComponentType<React.PropsWithChildren<DropdownPropsWithOutsideClickProps>>;

export default DropdownWithOuterListeners;
