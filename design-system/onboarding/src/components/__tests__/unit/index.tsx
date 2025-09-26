import React, { forwardRef, useState } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Lorem from 'react-lorem-component';

import { skipA11yAudit } from '@af/accessibility-testing';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import {
	Modal,
	Spotlight,
	SpotlightManager,
	SpotlightPulse,
	SpotlightTarget,
} from '../../../index';

interface ElementStubProps {
	testId?: string;
	children: React.ReactNode;
	height: number;
	width: number;
	marginLeft?: number;
	marginRight?: number;
	marginTop?: number;
	marginBottom?: number;
	position?: 'fixed';
}

interface SpotlightDialogLabelProps {
	titleId?: string;
	heading?: string;
	label?: string;
	children?: React.ReactNode;
}

const getMockDimensions = (props: ElementStubProps) => (ref: HTMLElement | null) => {
	if (!ref) {
		return;
	}

	// We calculate the bounding client rect from the props passed in.
	ref.getBoundingClientRect = (): DOMRect => ({
		width: props.width,
		height: props.height,
		left: props.marginLeft || 0,
		top: props.marginTop || 0,
		bottom: window.innerHeight - props.height - (props.marginBottom || 0),
		right: window.innerWidth - props.width - (props.marginRight || 0),
		x: 0,
		y: 0,
		toJSON() {
			return JSON.stringify(this);
		},
	});
};

const ElementStub: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ElementStubProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef((props: ElementStubProps, ref: React.Ref<HTMLDivElement>) => {
	return (
		<div
			data-testid={props.testId}
			style={{ position: props.position }}
			ref={mergeRefs([ref, getMockDimensions(props)])}
		>
			{props.children}
		</div>
	);
});

const buildOnboardingMarkup = (target: string) => (
	<SpotlightManager>
		<SpotlightTarget name="target-one">
			<ElementStub width={100} height={50} testId="target" marginLeft={50} marginTop={100}>
				target one
			</ElementStub>
		</SpotlightTarget>

		<SpotlightTarget name="target-two">
			<ElementStub width={100} height={50} testId="target1" marginLeft={100} marginTop={100}>
				target two
			</ElementStub>
		</SpotlightTarget>

		<SpotlightTarget name="target-three">
			<ElementStub width={100} height={50} testId="target2" marginLeft={150} marginTop={100}>
				target three
			</ElementStub>
		</SpotlightTarget>

		<Spotlight key={target} target={target}>
			Spotlight for {target}
		</Spotlight>
	</SpotlightManager>
);

const SpotlightDialogLabel = (props: SpotlightDialogLabelProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<SpotlightManager>
			<SpotlightTarget name="button">
				<Button testId="spotlight-dialog-trigger" onClick={() => setIsOpen(true)}>
					Open spotlight
				</Button>
			</SpotlightTarget>
			{isOpen && (
				<Spotlight
					target="button"
					testId="heading-label"
					heading={props.heading}
					label={props.label}
					titleId={props.titleId}
					actions={[
						{
							text: 'Got it',
						},
					]}
				>
					{props.children}
					<Lorem count={2} />
				</Spotlight>
			)}
		</SpotlightManager>
	);
};

describe('Benefits Modal', () => {
	it('should have an appriorate accessible label', () => {
		render(
			<Modal heading="Experience the new Jira">
				<p>How about some body text?</p>
			</Modal>,
		);

		expect(screen.getByRole('dialog')).toHaveAccessibleName('Experience the new Jira');
	});
});

describe('<Spotlight />', () => {
	it('should position the cloned target ontop of the original', () => {
		render(buildOnboardingMarkup('target-one'));

		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			position: 'fixed',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			height: '50px',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			width: '100px',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			left: '50px',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			top: '100px',
		});
	});

	it('should render the spotlight dialog', () => {
		render(buildOnboardingMarkup('target-one'));

		expect(screen.getByTestId('spotlight--dialog')).toHaveTextContent('Spotlight for target-one');
	});

	it('should re-render and show the second spotlight', () => {
		const { rerender } = render(buildOnboardingMarkup('target-one'));
		rerender(buildOnboardingMarkup('target-two'));

		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			left: '100px',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			top: '100px',
		});
		expect(screen.getByTestId('spotlight--dialog')).toHaveTextContent('Spotlight for target-two');
	});

	it('should re-render and show the third spotlight', () => {
		const { rerender } = render(buildOnboardingMarkup('target-one'));

		rerender(buildOnboardingMarkup('target-two'));
		rerender(buildOnboardingMarkup('target-three'));

		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			left: '150px',
		});
		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			top: '100px',
		});
		expect(screen.getByTestId('spotlight--dialog')).toHaveTextContent('Spotlight for target-three');
	});

	it('should render a spotlight target without a parent manager without blowing up', () => {
		expect(() => {
			render(
				<SpotlightTarget name="target-one">
					<ElementStub width={100} height={50} testId="target" marginLeft={50} marginTop={100}>
						target one
					</ElementStub>
				</SpotlightTarget>,
			);
		}).not.toThrow();
	});

	it('should retain a fixed positioned target as fixed when under a spotlight', () => {
		render(
			<SpotlightManager>
				<SpotlightTarget name="target-one">
					<ElementStub
						width={100}
						height={50}
						position="fixed"
						testId="target"
						marginLeft={50}
						marginTop={100}
					>
						target one
					</ElementStub>
				</SpotlightTarget>

				<Spotlight target="target-one">Spotlight for target-one</Spotlight>
			</SpotlightManager>,
		);

		expect(screen.getByTestId('spotlight--target')).toHaveStyle({
			position: 'fixed',
		});
	});

	it('pulse should not appear on target element when SpotlightPulse pulse prop is true', () => {
		render(
			<SpotlightManager>
				<SpotlightTarget name="target-one">
					<ElementStub
						width={100}
						height={50}
						position="fixed"
						testId="target"
						marginLeft={50}
						marginTop={100}
					>
						Target
					</ElementStub>
				</SpotlightTarget>

				<Spotlight target="target-one">Spotlight for target</Spotlight>
			</SpotlightManager>,
		);

		const targetStyles = getComputedStyle(screen.getByTestId('spotlight--target'));
		expect(targetStyles.getPropertyValue('animation-name')).toBeTruthy();
		expect(targetStyles.getPropertyValue('animation-duration')).toEqual('3s');
		expect(targetStyles.getPropertyValue('animation-timing-function')).toEqual(
			'cubic-bezier(.55,.055,.675,.19)',
		);
	});

	it('pulse should not appear on target element when SpotlightPulse pulse prop is false', () => {
		render(
			<SpotlightManager>
				<SpotlightTarget name="target-one">
					<ElementStub
						width={100}
						height={50}
						position="fixed"
						testId="target"
						marginLeft={50}
						marginTop={100}
					>
						Target
					</ElementStub>
				</SpotlightTarget>

				<Spotlight pulse={false} target="target-one">
					Spotlight for target
				</Spotlight>
			</SpotlightManager>,
		);

		expect(screen.getByTestId('spotlight--target')).not.toHaveCompiledCss(
			'animation',
			expect.any(String),
		);
		expect(screen.getByTestId('spotlight--target')).not.toHaveCompiledCss(
			'animationName',
			expect.any(String),
		);
	});

	it('pulse should not appear on element when SpotlightPulse pulse prop is false', () => {
		render(
			<SpotlightManager>
				<ButtonGroup label="Choose spotlight options">
					<SpotlightTarget name="copy">
						<SpotlightPulse pulse={false} radius={3} testId="spotlight-pulse">
							<Button>Existing feature</Button>
						</SpotlightPulse>
					</SpotlightTarget>
				</ButtonGroup>
			</SpotlightManager>,
		);

		const targetStyles = getComputedStyle(screen.getByTestId('spotlight-pulse'));
		expect(targetStyles.animation).not.toMatch(/\w+ 3s cubic-bezier\(.55,.055,.675,.19\) infinite/);
	});

	it('pulse should appear on element when SpotlightPulse pulse prop is true', () => {
		render(
			<SpotlightManager>
				<ButtonGroup label="Choose spotlight options">
					<SpotlightTarget name="copy">
						<SpotlightPulse pulse={true} radius={3} testId="spotlight-pulse">
							<Button>Existing feature</Button>
						</SpotlightPulse>
					</SpotlightTarget>
				</ButtonGroup>
			</SpotlightManager>,
		);

		const targetStyles = getComputedStyle(screen.getByTestId('spotlight-pulse'));
		expect(targetStyles.getPropertyValue('animation-name')).toBeTruthy();
		expect(targetStyles.getPropertyValue('animation-duration')).toEqual('3s');
		expect(targetStyles.getPropertyValue('animation-timing-function')).toEqual(
			'cubic-bezier(.55,.055,.675,.19)',
		);
	});

	// Skipped due to HOT-111922 Fails for React 18
	it.skip('should not log any errors when rendering the spotlight', () => {
		jest.spyOn(console, 'error').mockImplementation((msg) => {
			throw new Error(msg);
		});

		expect(() => {
			render(
				<SpotlightManager>
					<SpotlightTarget name="target-one">
						<ElementStub
							width={100}
							height={50}
							position="fixed"
							testId="target"
							marginLeft={50}
							marginTop={100}
						>
							target one
						</ElementStub>
					</SpotlightTarget>

					<Spotlight actions={[{ text: 'Primary' }, { text: 'Secondary' }]} target="target-one">
						Spotlight for target-one
					</Spotlight>
				</SpotlightManager>,
			);
		}).not.toThrow();

		// This test always causes the a11y audti (after) to fail with this non-a11y error:
		// Warning: An update to %s inside a test was not wrapped in act(...).
		skipA11yAudit();
	});
	it('should reference element as accessible name using titleId prop', async () => {
		const user = userEvent.setup();

		render(
			<SpotlightDialogLabel titleId="explicit-spotlight-dialog-label">
				<h2 id="explicit-spotlight-dialog-label">Explicit heading</h2>
			</SpotlightDialogLabel>,
		);

		expect(screen.getByTestId('spotlight-dialog-trigger')).toBeInTheDocument();
		await user.click(screen.getByTestId('spotlight-dialog-trigger'));
		expect(screen.getByTestId('heading-label--dialog-container')).toHaveAttribute(
			'aria-labelledby',
			'explicit-spotlight-dialog-label',
		);
		expect(screen.getByTestId('heading-label--dialog-container')).not.toHaveAttribute('aria-label');
	});
	it('should reference heading as accessible name if heading is passed', async () => {
		const user = userEvent.setup();

		render(<SpotlightDialogLabel heading="Spotlight heading as spotlight label" />);

		expect(screen.getByTestId('spotlight-dialog-trigger')).toBeInTheDocument();
		await user.click(screen.getByTestId('spotlight-dialog-trigger'));
		expect(screen.getByText('Spotlight heading as spotlight label')).toBeInTheDocument();
		expect(screen.getByText('Spotlight heading as spotlight label')).toHaveAttribute(
			'id',
			'spotlight-dialog-label',
		);
		expect(screen.getByTestId('heading-label--dialog-container')).toHaveAttribute(
			'aria-labelledby',
			'spotlight-dialog-label',
		);
		expect(screen.getByTestId('heading-label--dialog-container')).not.toHaveAttribute('aria-label');
	});
	it('should reference element passed via titleId even if heading is passed', async () => {
		const user = userEvent.setup();

		render(
			<SpotlightDialogLabel heading="Spotlight heading" titleId="referenced-spotlight-dialog-label">
				<p id="referenced-spotlight-dialog-label">Element referenced as label</p>
			</SpotlightDialogLabel>,
		);

		expect(screen.getByTestId('spotlight-dialog-trigger')).toBeInTheDocument();
		await user.click(screen.getByTestId('spotlight-dialog-trigger'));

		expect(screen.getByText('Spotlight heading')).toBeInTheDocument();
		expect(screen.getByText('Spotlight heading')).toHaveAttribute('id', 'spotlight-dialog-label');
		expect(screen.getByTestId('heading-label--dialog-container')).toHaveAttribute(
			'aria-labelledby',
			'referenced-spotlight-dialog-label',
		);
		expect(screen.getByTestId('heading-label--dialog-container')).not.toHaveAttribute('aria-label');
	});
	it('should have default aria-label if neither heading nor titleId is passed', async () => {
		const user = userEvent.setup();

		render(<SpotlightDialogLabel />);

		expect(screen.getByTestId('spotlight-dialog-trigger')).toBeInTheDocument();
		await user.click(screen.getByTestId('spotlight-dialog-trigger'));
		expect(screen.getByTestId('heading-label--dialog-container')).toHaveAttribute(
			'aria-label',
			'Introducing new feature',
		);
	});

	describe('render prop children API', () => {
		it('should use the referenced element for the clone', () => {
			render(
				<SpotlightManager>
					<ul>
						<SpotlightTarget name="target">
							{({ targetRef }) => (
								<li>
									<ElementStub
										ref={targetRef}
										width={100}
										height={50}
										testId="target"
										marginLeft={50}
										marginTop={100}
									>
										List item content
									</ElementStub>
								</li>
							)}
						</SpotlightTarget>
					</ul>

					<Spotlight target="target">Spotlight for target</Spotlight>
				</SpotlightManager>,
			);

			const spotlightTarget = screen.getByTestId('spotlight--target');

			// Assert the dimensions are being read from the targeted element
			expect(spotlightTarget).toHaveStyle({
				position: 'fixed',
				height: '50px',
				width: '100px',
				left: '50px',
				top: '100px',
			});

			// Assert the list element is not being cloned for the target
			expect(within(spotlightTarget).queryByRole('listitem')).not.toBeInTheDocument();
		});
	});

	it('should not error if there is no spotlight manager', () => {
		expect(() =>
			render(
				<>
					<ul>
						<SpotlightTarget name="target">
							{({ targetRef }) => (
								<li>
									<ElementStub
										ref={targetRef}
										width={100}
										height={50}
										testId="target"
										marginLeft={50}
										marginTop={100}
									>
										List item content
									</ElementStub>
								</li>
							)}
						</SpotlightTarget>
					</ul>

					<Spotlight target="target">Spotlight for target</Spotlight>
				</>,
			),
		).not.toThrow();
	});
});
