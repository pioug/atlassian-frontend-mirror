import React, { type ChangeEvent, type ReactNode, useState } from 'react';

import { cssMap, cx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	invertedFooter: {
		backgroundColor: 'var(--ds-background-neutral-bold)',
	},

	displayBlock: { display: 'block' },
	displayNone: { display: 'none' },

	heading: {
		color: token('color.text'),
	},

	page: {
		maxWidth: '840px',
		marginInline: 'auto',
	},
});

type Appearances = 'default' | 'help' | 'inverted' | 'primary';
type Sizes = 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const appearances: Appearances[] = ['default', 'primary', 'help', 'inverted'];
const sizes: Sizes[] = ['default', 'large'];
const spacing: Spacing[] = ['comfortable', 'cozy', 'compact'];
const values = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

type FooterProps = {
	appearance: string;
	children: ReactNode;
};

const Footer = ({ appearance, children }: FooterProps) => (
	<Box
		as="footer"
		backgroundColor={appearance === 'inverted' ? 'color.background.neutral.bold' : undefined}
	>
		{children}
	</Box>
);

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Inline space="space.100" spread="space-between" alignBlock="center">
			{children}
		</Inline>
	);
};

const ProgressIndicatorDots = (): React.JSX.Element => {
	const [isInteractive, setIsInteractive] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedAppearance, setSelectedAppearance] = useState<Appearances>('primary');
	const [selectedSize, setSelectedSize] = useState<Sizes>('default');
	const [selectedSpacing, setSelectedSpacing] = useState<Spacing>('comfortable');

	const handleSelect = ({
		index: selectedIndex,
	}: {
		event: React.MouseEvent<HTMLButtonElement>;
		index: number;
	}): void => {
		setSelectedIndex(selectedIndex);
	};

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	const toggleAppearance = (selectedAppearance: 'default' | 'help' | 'inverted' | 'primary') =>
		setSelectedAppearance(selectedAppearance);

	const toggleSize = (selectedSize: Sizes) => setSelectedSize(selectedSize);

	const toggleSpacing = (selectedSpacing: Spacing) => setSelectedSpacing(selectedSpacing);

	const toggleInteractivity = (event: ChangeEvent<HTMLInputElement>) =>
		setIsInteractive(event.target.checked);

	return (
		<Box xcss={styles.page}>
			<Box paddingBlock="space.400">
				<Stack space="space.400">
					<SpreadInlineLayout>
						<Stack space="space.150">
							<Box id="appearance-title" xcss={styles.heading}>
								Appearance
							</Box>
							<ButtonGroup titleId="appearance-title">
								{appearances.map((app) => (
									<Button
										isSelected={selectedAppearance === app}
										key={app}
										onClick={() => toggleAppearance(app)}
										spacing="compact"
									>
										{app}
									</Button>
								))}
							</ButtonGroup>
						</Stack>
						<Stack space="space.150">
							<Box id="spacing-title" xcss={styles.heading}>
								Spacing
							</Box>
							<ButtonGroup titleId="spacing-title">
								{spacing.map((spc) => (
									<Button
										isSelected={selectedSpacing === spc}
										key={spc}
										onClick={() => toggleSpacing(spc)}
										spacing="compact"
									>
										{spc}
									</Button>
								))}
							</ButtonGroup>
						</Stack>
						<Stack space="space.150">
							<Box id="size-title" xcss={styles.heading}>
								Size
							</Box>
							<ButtonGroup titleId="size-title">
								{sizes.map((sz) => (
									<Button
										isSelected={selectedSize === sz}
										key={sz}
										onClick={() => toggleSize(sz)}
										spacing="compact"
									>
										{sz}
									</Button>
								))}
							</ButtonGroup>
						</Stack>
					</SpreadInlineLayout>
					<SpreadInlineLayout>
						<Box as="label" htmlFor="input">
							<Inline space="space.100" alignBlock="center">
								<input
									checked={isInteractive}
									id="input"
									onChange={toggleInteractivity}
									type="checkbox"
								/>
								<Text as="strong" weight="bold">
									Allow interaction with indicators
								</Text>
							</Inline>
						</Box>
					</SpreadInlineLayout>
					<Box>
						{values.map((v, i) => {
							const selected = i === selectedIndex;
							const panelId = `panel${i}`;
							return (
								<Box
									aria-hidden={!selected}
									aria-labelledby={`tab${i}`}
									key={v}
									id={panelId}
									role="tabpanel"
									xcss={cx(styles.displayBlock, !selected && styles.displayNone)}
								>
									<Stack space="space.100">
										<Text as="strong">Panel {i + 1}</Text>
										<Lorem count={3} />
									</Stack>
								</Box>
							);
						})}
					</Box>
					<Footer appearance={selectedAppearance}>
						<Box paddingBlock="space.150" paddingInline="space.100">
							<SpreadInlineLayout>
								<Button
									isDisabled={selectedIndex === 0}
									appearance={selectedAppearance === 'inverted' ? 'primary' : 'default'}
									onClick={handlePrev}
								>
									Previous
								</Button>
								<ProgressIndicator
									appearance={selectedAppearance}
									onSelect={isInteractive ? handleSelect : undefined}
									selectedIndex={selectedIndex}
									size={selectedSize}
									spacing={selectedSpacing}
									values={values}
								/>
								<Button
									isDisabled={selectedIndex === values.length - 1}
									appearance={selectedAppearance === 'inverted' ? 'primary' : 'default'}
									onClick={handleNext}
								>
									Next
								</Button>
							</SpreadInlineLayout>
						</Box>
					</Footer>
				</Stack>
			</Box>
		</Box>
	);
};

export default ProgressIndicatorDots;
