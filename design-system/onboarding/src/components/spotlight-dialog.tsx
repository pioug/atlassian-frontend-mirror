import React, { Component, type ComponentType, type ReactNode } from 'react';

import FocusLock from 'react-focus-lock';

import { type Placement, Popper } from '@atlaskit/popper';
import { Box } from '@atlaskit/primitives/compiled';

import { DialogImage } from '../styled/dialog';
import { type Actions } from '../types';

import SpotlightCard from './spotlight-card';
import ValueChanged from './value-changed';

interface SpotlightDialogProps {
	/**
	 * Buttons to render in the footer.
	 */
	actions?: Actions;
	/**
	 * An optional element rendered beside the footer actions.
	 */
	actionsBeforeElement?: ReactNode;
	/**
	 * The elements rendered in the modal.
	 */
	children?: ReactNode;
	/**
	 * Where the dialog should appear, relative to the contents of the children.
	 */
	dialogPlacement?:
		| 'top left'
		| 'top center'
		| 'top right'
		| 'right top'
		| 'right middle'
		| 'right bottom'
		| 'bottom left'
		| 'bottom center'
		| 'bottom right'
		| 'left top'
		| 'left middle'
		| 'left bottom';
	/**
	 * The width of the dialog in pixels. The minimum possible width is 160px and the maximum width is 600px.
	 */
	dialogWidth: number;
	/**
	 * Optional element rendered below the body.
	 */
	footer?: ComponentType<any>;
	/**
	 * Optional element rendered above the body.
	 */
	header?: ComponentType<any>;
	/**
	 * Heading text rendered above the body.
	 */
	heading?: string;
	/**
	 * An optional element rendered to the right of the heading.
	 */
	headingAfterElement?: ReactNode;
	/**
	 * Path to the image.
	 */
	image?: string;
	/**
	 * The spotlight target node.
	 */
	targetNode: HTMLElement;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the spotlight dialog wrapper to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` prop is strongly recommended to improve accessibility.
	 */
	label?: string;
	/**
	 * Refers to a value of an `aria-labelledby` attribute. References an element to define accessible name for the spotlight dialog.
	 * Usage of either this, or the `label` prop is strongly recommended to improve accessibility.
	 */
	titleId?: string;
}

interface State {
	focusLockDisabled: boolean;
}

/**
 * __Spotlight dialog__
 *
 * An onboarding spotlight introduces new features to users through focused messages or multi-step tours.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
class SpotlightDialogComponent extends Component<SpotlightDialogProps, State> {
	state = {
		focusLockDisabled: true,
	};

	private focusLockTimeoutId: number | undefined;

	componentDidMount(): void {
		this.focusLockTimeoutId = window.setTimeout(() => {
			// we delay the enabling of the focus lock to avoid the scroll position
			// jumping around in some situations
			this.setState({ focusLockDisabled: false });
		}, 200);
	}

	componentWillUnmount(): void {
		window.clearTimeout(this.focusLockTimeoutId);
	}

	render(): React.JSX.Element {
		const {
			actions,
			actionsBeforeElement,
			children,
			dialogPlacement,
			dialogWidth,
			footer,
			header,
			heading,
			headingAfterElement,
			image,
			label = 'Introducing new feature',
			titleId,
			targetNode,
			testId,
		} = this.props;
		const { focusLockDisabled } = this.state;

		const dialogLabel = !heading && !titleId ? label : undefined;

		const dialogLabelledBy = titleId || (heading ? 'spotlight-dialog-label' : undefined);

		const translatedPlacement: Placement | undefined = dialogPlacement
			? ({
					'top left': 'top-start',
					'top center': 'top',
					'top right': 'top-end',
					'right top': 'right-start',
					'right middle': 'right',
					'right bottom': 'right-end',
					'bottom left': 'bottom-start',
					'bottom center': 'bottom',
					'bottom right': 'bottom-end',
					'left top': 'left-start',
					'left middle': 'left',
					'left bottom': 'left-end',
				}[dialogPlacement] as Placement)
			: undefined;

		// If there's no room on either side of the popper, it will extend off-screen.
		//  This looks buggy when scroll-lock and focus is placed on the dialog, so we
		//  customise popper so it overflows the spotlight instead with altAxis=true.
		const modifiers = [
			{
				name: 'preventOverflow',
				options: {
					padding: 5,
					rootBoundary: 'document',
					altAxis: true,
					tether: false,
				},
			},
		];

		return (
			<Popper modifiers={modifiers} referenceElement={targetNode} placement={translatedPlacement}>
				{({ ref, style, update }) => (
					<ValueChanged value={dialogWidth} onChange={update}>
						<FocusLock disabled={focusLockDisabled} returnFocus={false} autoFocus>
							<Box
								style={style}
								ref={ref}
								aria-modal={true}
								role="dialog"
								aria-label={dialogLabel}
								aria-labelledby={dialogLabelledBy}
								testId={`${testId}-container`}
							>
								<SpotlightCard
									testId={testId}
									width={dialogWidth}
									actions={actions}
									actionsBeforeElement={actionsBeforeElement}
									image={image && <DialogImage alt={heading} src={image} />}
									components={{
										Header: header,
										Footer: footer,
									}}
									heading={heading}
									headingId="spotlight-dialog-label"
									headingAfterElement={headingAfterElement}
									// This should be heading level 1 since this is technically a modal, including a focus lock on the modal window.
									// But because it is not a _true_ modal, we are setting it to `2` until that is fixed.
									headingLevel={2}
								>
									{children}
								</SpotlightCard>
							</Box>
						</FocusLock>
					</ValueChanged>
				)}
			</Popper>
		);
	}
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default SpotlightDialogComponent;
