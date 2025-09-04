/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { UNSAFE_InteractionSurface as InteractionSurface } from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';
import WarningIcon from '@atlaskit/icon/glyph/warning';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const fieldsetStyles = xcss({
	flex: '1 1 100%',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	borderColor: 'color.border',
	':hover': {
		backgroundColor: 'color.background.input.hovered',
	},
	':invalid': {
		borderColor: 'color.border.danger',
	},
	':focus': {
		backgroundColor: 'color.background.input',
		borderColor: 'color.border.focused',
	},
	':focus-within': {
		backgroundColor: 'color.background.input',
		borderColor: 'color.border.focused',
	},
});

const focusRingBoxStyles = xcss({
	borderRadius: 'radius.small',
	position: 'relative',
});

export default () => {
	return (
		<Box padding="space.100" testId="all">
			<Stack space="space.200">
				<Heading size="xsmall">Current ADS Buttons</Heading>
				<Inline space="space.200">
					<Button appearance="primary">brand.bold</Button>
					<Button appearance="default">neutral</Button>
					<Button appearance="warning">warning.bold</Button>
				</Inline>
				<Heading size="xsmall">
					Buttons with <Code>InteractionSurface</Code>
				</Heading>
				<Inline space="space.200" testId="buttons">
					{(
						[
							'color.background.brand.bold',
							'color.background.neutral',
							'color.background.warning.bold',
						] as const
					).map((app) => (
						<Pressable
							key={app}
							onClick={() => console.log('hello')}
							xcss={focusRingBoxStyles}
							paddingInline="space.150"
							backgroundColor={app}
						>
							<InteractionSurface>
								<Text align="center" weight="medium">
									{app}
								</Text>
							</InteractionSurface>
						</Pressable>
					))}
				</Inline>
				<Heading size="xsmall">
					Icon Buttons with <Code>InteractionSurface</Code>
				</Heading>
				<Inline space="space.200" testId="icon-buttons">
					<Pressable
						backgroundColor="color.background.brand.bold"
						onClick={() => console.log('hello')}
						padding="space.050"
						xcss={focusRingBoxStyles}
					>
						<InteractionSurface>
							<WarningIcon
								label="icon button"
								primaryColor={token('color.icon.inverse')}
								secondaryColor={token('color.background.brand.bold')}
							/>
						</InteractionSurface>
					</Pressable>
					<Pressable
						backgroundColor="color.background.neutral"
						onClick={() => console.log('hello')}
						xcss={focusRingBoxStyles}
						padding="space.050"
					>
						<InteractionSurface>
							<WarningIcon label="icon button" />
						</InteractionSurface>
					</Pressable>
					<Pressable
						backgroundColor="color.background.warning.bold"
						onClick={() => console.log('hello')}
						xcss={focusRingBoxStyles}
						padding="space.050"
					>
						<InteractionSurface>
							<WarningIcon
								label="icon button"
								primaryColor={token('color.icon.warning.inverse')}
								secondaryColor={token('color.background.warning.bold')}
							/>
						</InteractionSurface>
					</Pressable>
				</Inline>
				<Heading size="xsmall">
					Progress Indicator with <Code>InteractionSurface</Code>
				</Heading>
				<Inline space="space.200" testId="progress-indicators">
					{(
						[
							'color.background.brand.bold',
							'color.background.neutral',
							'color.background.warning.bold',
						] as const
					).map((app) => (
						<Pressable
							key={app}
							backgroundColor={app}
							onClick={() => console.log('hello')}
							xcss={focusRingBoxStyles}
							padding="space.050"
							aria-label="progress indicator"
						>
							<InteractionSurface>
								<Fragment />
							</InteractionSurface>
						</Pressable>
					))}
				</Inline>
				<Heading size="xsmall">Textfield / input spikes</Heading>
				<Stack space="space.200">
					<label htmlFor="textfield">Textfield</label>
					<Textfield id="textfield" />
					<label htmlFor="input">Input</label>
					<Box
						as="fieldset"
						padding="space.100"
						tabIndex={-1}
						backgroundColor="color.background.input"
						xcss={fieldsetStyles}
					>
						<input
							id="input"
							pattern="\d+"
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								padding: 0,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								border: 'none',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								fontSize: 14,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								background: 'transparent',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								appearance: 'none',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								outline: 'none',
							}}
						/>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);
};
