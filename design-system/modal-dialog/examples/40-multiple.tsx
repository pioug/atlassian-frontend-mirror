/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import { Field, FormFooter, FormSection, HelperMessage } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { FullScreenModalDialog } from '@atlaskit/modal-dialog/full-screen';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const sizes = ['large', 'medium', 'small'];

const multipleContainerStyles = cssMap({
	root: {
		maxWidth: '600px',
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

const modalContentStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		width: '100%',
		height: '100%',
		backgroundColor: token('color.background.accent.magenta.subtlest'),
		paddingInline: token('space.300'),
		paddingBlock: token('space.300'),
	},
	longContent: {
		height: '150vh',
	},
});

export default function NestedModalExample() {
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);
	const [hasLongContent, setHasLongContent] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});

	const open = useCallback(
		(name: string) => setOpenModals((prev) => ({ ...prev, [name]: true })),
		[],
	);
	const close = useCallback(
		(name: string) => setOpenModals((prev) => ({ ...prev, [name]: false })),
		[],
	);

	const handleStackChange = (idx: number, name: string) => {
		console.info(`"${name}" stack change`, idx);
		console.log(`"${name}" stack change ${idx}`);
	};

	const handleOpenComplete = (name: string) => {
		console.info(`The enter animation of modal #${name} has completed.`);
	};

	const handleCloseComplete = (name: string) => {
		console.info(`The exit animation of the "${name}" modal has completed.`);
	};

	const ModalRootComponent = isFullScreen ? FullScreenModalDialog : Modal;

	return (
		<Box xcss={multipleContainerStyles.root}>
			<div>
				<FormSection>
					<Field name="sb" label="Scrolling behavior">
						{() => (
							<Checkbox
								label="Should scroll within the viewport"
								name="scroll"
								testId="scroll"
								onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
								isChecked={shouldScrollInViewport}
							/>
						)}
					</Field>

					<Field name="content" label="Content">
						{() => (
							<Checkbox
								label="Has long content"
								name="content"
								testId="content"
								onChange={(e) => setHasLongContent(e.target.checked)}
								isChecked={hasLongContent}
							/>
						)}
					</Field>

					<Field name="full-screen" label="Appearance">
						{() => (
							<Fragment>
								<Checkbox
									label="Full screen"
									name="full-screen"
									testId="full-screen"
									onChange={(e) => setIsFullScreen(e.target.checked)}
									isChecked={isFullScreen}
								/>
								<HelperMessage>
									Full screen mode will ignore the <Code>width</Code>, <Code>height</Code> and{' '}
									<Code>shouldScrollInViewport</Code> props.
								</HelperMessage>
							</Fragment>
						)}
					</Field>
				</FormSection>

				<FormFooter align="start">
					<ButtonGroup label="Modal options">
						<Button
							aria-haspopup="dialog"
							appearance="primary"
							testId="large"
							onClick={() => open('large')}
						>
							Open
						</Button>
					</ButtonGroup>
				</FormFooter>
			</div>

			<p>
				For illustrative purposes three {'"stacked"'} modals can be opened in this demo, though ADG3
				recommends only two at any time.
			</p>
			<p>
				Check the storybook{"'"}s {'"action logger"'} (or your console) to see how you can make use
				of the <code>onStackChange</code> property.
			</p>

			{sizes.map((name, index) => {
				const nextModal = sizes[index + 1];

				return (
					<ModalTransition key={name}>
						{openModals[name] && (
							<ModalRootComponent
								shouldScrollInViewport={shouldScrollInViewport}
								onClose={() => close(name)}
								onCloseComplete={() => handleCloseComplete(name)}
								onOpenComplete={() => handleOpenComplete(name)}
								onStackChange={(id) => handleStackChange(id, name)}
								width={name}
								testId="modal"
							>
								<ModalHeader hasCloseButton>
									<ModalTitle>Modal: {name}</ModalTitle>
								</ModalHeader>
								<ModalBody hasInlinePadding={false}>
									<div
										css={[
											modalContentStyles.root,
											hasLongContent && modalContentStyles.longContent,
										]}
									>
										<p>
											Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam nobis delectus
											accusamus iusto atque excepturi qui, mollitia, labore voluptas quo ipsum
											accusantium. Itaque iure hic, voluptatum consequatur quae vitae sit.
										</p>
										<p>
											Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci id mollitia,
											autem provident atque explicabo enim saepe beatae voluptates facilis optio
											quaerat harum suscipit tempora laudantium itaque maiores? Illum, consequuntur.
											Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae et
											necessitatibus ducimus beatae, corrupti soluta! Quibusdam, mollitia, quos
											ipsam voluptatibus deserunt dolorem quia consequuntur fugit nisi dolorum iure
											in corporis?
										</p>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										testId={`${name}-modal-close-button`}
										appearance="subtle"
										onClick={() => close(name)}
									>
										Close
									</Button>
									{nextModal && (
										<Button
											aria-haspopup="dialog"
											testId={`${name}-modal-trigger`}
											appearance="primary"
											onClick={() => open(nextModal)}
										>
											Open: {nextModal}
										</Button>
									)}
								</ModalFooter>
							</ModalRootComponent>
						)}
					</ModalTransition>
				);
			})}
		</Box>
	);
}
