import React, { Component, type ElementType, type ReactNode } from 'react';

import Button, { Theme as ButtonTheme } from '@atlaskit/button/custom-theme-button';
import Modal, {
	type ModalFooterProps as FooterComponentProps,
	type ModalHeaderProps as HeaderComponentProps,
	ModalBody,
	useModal,
} from '@atlaskit/modal-dialog';

import {
	ModalBody as Body,
	ModalHeading as Heading,
	ModalActionContainer,
	ModalActionItem,
	ModalImage,
} from '../styled/modal';
import { type Actions } from '../types';

import { modalButtonTheme } from './theme';

// TODO: DSP-1250 - use a composable API consistent with normal modal dialog
type ModalProps = {
	/**
	 * Buttons to render in the footer.
	 */
	actions?: Actions;
	/**
	 * The elements rendered in the modal.
	 */
	children: ReactNode;
	/**
	 * Path to the image.
	 */
	image?: string;
	/**
	 * Optional element rendered above the body.
	 */
	header?: ElementType<HeaderComponentProps>;
	/**
	 * Optional element rendered below the body.
	 */
	footer?: ElementType<FooterComponentProps>;
	/**
	 * Heading text rendered above the body.
	 */
	heading?: string;
	/**
	 * Boolean prop to confirm if primary button in the footer should be shown on the right.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	experimental_shouldShowPrimaryButtonOnRight?: boolean;
	/**
	 * This prop is a unique string that appears as an attribute `data-testid` in the rendered HTML output serving as a hook for automated tests.
	 */
	testId?: string;
};

/**
 * __Benefits modal__
 *
 * A benefits modal explains the benefits of a significant new feature or experience change.
 *
 * - [Examples](https://atlassian.design/components/onboarding/benefits-modal/examples)
 * - [Code](https://atlassian.design/components/onboarding/benefits-modal/code)
 * - [Usage](https://atlassian.design/components/onboarding/benefits-modal/usage)
 *
 * @deprecated Use `@atlaskit/modal-dialog` instead.
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class BenefitsModal extends Component<ModalProps> {
	headerComponent = (
		props: ModalProps,
	): React.ElementType<HeaderComponentProps> | (() => React.JSX.Element) => {
		const { header: HeaderElement, image: src } = props;

		const ImageElement = () => <ModalImage src={src} alt="" />;

		return HeaderElement || ImageElement;
	};

	footerComponent = (
		props: ModalProps,
	): React.ElementType<FooterComponentProps> | (() => React.JSX.Element | null) => {
		const {
			footer: FooterElement,
			actions: actionList,
			experimental_shouldShowPrimaryButtonOnRight = false,
		} = props;

		const ActionsElement = () =>
			actionList ? (
				<ButtonTheme.Provider value={modalButtonTheme}>
					<ModalActionContainer
						shouldReverseButtonOrder={experimental_shouldShowPrimaryButtonOnRight}
					>
						{actionList.map(({ text, key, ...rest }, idx) => {
							const variant = idx ? 'subtle-link' : 'primary';
							return (
								<ModalActionItem key={key || (typeof text === 'string' ? text : `${idx}`)}>
									<Button appearance={variant} autoFocus={!idx} {...rest}>
										{text}
									</Button>
								</ModalActionItem>
							);
						})}
					</ModalActionContainer>
				</ButtonTheme.Provider>
			) : null;

		return FooterElement || ActionsElement;
	};

	render(): React.JSX.Element {
		const {
			actions,
			children,
			heading,
			// All of the following props except `...rest` are unused but were being
			// spread into the Modal, which it does not accept.
			experimental_shouldShowPrimaryButtonOnRight,
			footer,
			header,
			image,
			...rest
		} = this.props;

		const Header = this.headerComponent(this.props);
		const Footer = this.footerComponent(this.props);

		const CustomHeader = () => {
			const { titleId } = useModal();
			return <Heading id={titleId}>{heading}</Heading>;
		};

		return (
			// TODO: This is a problem that needs solving: https://product-fabric.atlassian.net/browse/DSP-22238
			// eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button
			<Modal
				autoFocus
				shouldCloseOnEscapePress={false}
				shouldCloseOnOverlayClick={false}
				shouldScrollInViewport
				// @ts-ignore All of the following props were in the rest props, so I'm
				// making them explicit here even though the Modal doesn't accept them.
				experimental_shouldShowPrimaryButtonOnRight={experimental_shouldShowPrimaryButtonOnRight}
				footer={footer}
				header={header}
				heading={heading}
				image={image}
				{...rest}
			>
				<Header />
				<ModalBody>
					<Body>
						{heading && <CustomHeader />}
						{children}
					</Body>
				</ModalBody>
				<Footer />
			</Modal>
		);
	}
}
