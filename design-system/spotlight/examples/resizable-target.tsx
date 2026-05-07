/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import {
	type Placement,
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const placements: Placement[] = [
	'top-start',
	'top-center',
	'top-end',
	'right-start',
	'right-end',
	'bottom-start',
	'bottom-center',
	'bottom-end',
	'left-start',
	'left-end',
];

const styles = cssMap({
	root: {
		minHeight: '100vh',
		width: '100vw',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.300'),
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: token('space.200'),
	},
	target: {
		position: 'relative',
		display: 'inline-block',
	},
	textarea: {
		display: 'block',
		boxSizing: 'border-box',
		width: '280px',
		height: '120px',
		minWidth: '10px',
		maxWidth: '620px',
		minHeight: '10px',
		maxHeight: '320px',
		resize: 'both',
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
		borderRadius: token('radius.medium'),
		backgroundColor: token('color.background.input'),
		color: token('color.text'),
	},
	inlineGuide: {
		position: 'absolute',
		insetBlockStart: '50%',
		insetInlineStart: 0,
		width: '100%',
		borderBlockStartStyle: 'dashed',
		borderBlockStartWidth: token('border.width'),
		borderBlockStartColor: token('color.border.discovery'),
		pointerEvents: 'none',
	},
	blockGuide: {
		position: 'absolute',
		insetBlockStart: 0,
		insetInlineStart: '50%',
		height: '100%',
		borderInlineStartStyle: 'dashed',
		borderInlineStartWidth: token('border.width'),
		borderInlineStartColor: token('color.border.discovery'),
		pointerEvents: 'none',
	},
	metrics: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.150'),
		borderRadius: token('radius.medium'),
		backgroundColor: token('color.background.neutral'),
	},
	controls: {
		paddingBlockStart: token('space.100'),
	},
});

const getRoundedSize = (element: HTMLElement) => {
	const rect = element.getBoundingClientRect();

	return {
		width: Math.round(rect.width),
		height: Math.round(rect.height),
	};
};

export default function ResizableTargetExample(): JSX.Element {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [targetSize, setTargetSize] = useState({ width: 280, height: 120 });
	const [placement, setPlacement] = useState<Placement>('bottom-start');
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const textarea = textareaRef.current;

		if (!textarea) {
			return;
		}

		const updateTargetSize = () => {
			setTargetSize(getRoundedSize(textarea));
		};

		updateTargetSize();

		const observer = new ResizeObserver(updateTargetSize);
		observer.observe(textarea);

		return () => {
			observer.disconnect();
		};
	}, []);

	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<div css={styles.target}>
							<textarea
								ref={textareaRef}
								css={styles.textarea}
								aria-label="Resizable spotlight target"
								defaultValue="Resize me from the lower-right corner, then switch placements to compare how the spotlight offset behaves for different target sizes."
							/>
							<div css={styles.inlineGuide} aria-hidden />
							<div css={styles.blockGuide} aria-hidden />
						</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={dismiss}
						placement={placement}
						isVisible={isVisible}
						shouldDismissOnClickOutside={false}
					>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Resizable target</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Stack space="space.100">
									<Text>
										Resize the textarea to validate whether the placement offset should stay
										static or respond to the anchor dimensions.
									</Text>
									<Text size="small">
										The dashed guides mark the target midpoint for checking center placements.
									</Text>
								</Stack>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightPrimaryAction onClick={done}>Done</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
				<Box xcss={styles.metrics}>
					<Stack space="space.050">
						<Text size="small">Placement: {placement}</Text>
						<Text size="small">
							Target: {targetSize.width}px wide x {targetSize.height}px high
						</Text>
						<Text size="small">
							Anchor midpoint: {Math.round(targetSize.width / 2)}px inline /{' '}
							{Math.round(targetSize.height / 2)}px block
						</Text>
					</Stack>
				</Box>
			</div>
			<Flex xcss={styles.controls} gap="space.100" wrap="wrap" justifyContent="center">
				<DropdownMenu trigger={`Placement: ${placement}`} shouldRenderToParent>
					<DropdownItemGroup>
						{placements.map((placementOption) => (
							<DropdownItem
								key={placementOption}
								onClick={() => {
									setPlacement(placementOption);
									setIsVisible(true);
								}}
							>
								{placementOption}
							</DropdownItem>
						))}
					</DropdownItemGroup>
				</DropdownMenu>
				<Button onClick={() => setIsVisible(true)}>Show Spotlight</Button>
			</Flex>
		</div>
	);
}
