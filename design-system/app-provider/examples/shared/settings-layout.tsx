/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

import { css } from '@compiled/react';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import CrossIcon from '@atlaskit/icon/core/cross';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

// The blanket token is outside the bounded background colors supported by cssMap.
const blanketStyles = css({ backgroundColor: token('color.blanket') });

const styles = cssMap({
	backdrop: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '600px',
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.medium'),
		borderRadius: token('radius.large'),
	},
	dialog: {
		width: '100%',
		maxWidth: '640px',
		minWidth: 0,
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		overflowWrap: 'anywhere',
	},
	chrome: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xlarge'),
	},
	body: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xxlarge'),
	},
	section: {
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.medium'),
	},
	details: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.large'),
	},
	preferences: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.medium'),
	},
	option: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.small'),
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
	},
	help: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xsmall'),
		backgroundColor: token('color.background.information'),
		borderRadius: token('radius.small'),
	},
	divider: {
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

const initialSettings = {
	name: 'Design studio',
	description: 'A shared home for our team’s work',
	projectUpdates: true,
	mentions: true,
	weeklyDigest: false,
	allowProjects: true,
	shareProjects: false,
};

export function SettingsLayout(): React.JSX.Element {
	const id = useId();
	const [isOpen, setIsOpen] = useState(true);
	const [saved, setSaved] = useState(initialSettings);
	const [draft, setDraft] = useState(initialSettings);
	const [savedMessage, setSavedMessage] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const dialogRef = useRef<HTMLFormElement>(null);
	const openButtonRef = useRef<HTMLButtonElement>(null);
	const wasOpen = useRef(isOpen);

	// Do not steal focus on the initial preview render. Move it only after opening or closing.
	useEffect(() => {
		if (wasOpen.current !== isOpen) {
			(isOpen ? nameRef.current : openButtonRef.current)?.focus();
			wasOpen.current = isOpen;
		}
	}, [isOpen]);

	const cancel = useCallback(() => {
		setDraft(saved);
		setSavedMessage(false);
		setIsOpen(false);
	}, [saved]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isOpen || !dialog) {
			return;
		}
		// Scope Escape to this dialog so it never closes while adjusting a spacing control.
		return bind(dialog, {
			type: 'keydown',
			listener: (event) => {
				if (event.key === 'Escape') {
					event.preventDefault();
					event.stopPropagation();
					cancel();
				}
			},
		});
	}, [isOpen, cancel]);

	return (
		<div css={[styles.backdrop, blanketStyles]}>
			{isOpen ? (
				// This inline, non-modal dialog keeps the spacing controls and inspector available.
				// ADS Modal renders outside the preview and locks focus to its contents.
				<form
					ref={dialogRef}
					role="dialog"
					aria-labelledby={`${id}-title`}
					aria-describedby={`${id}-description`}
					css={styles.dialog}
					onSubmit={(event) => {
						event.preventDefault();
						setSaved(draft);
						setSavedMessage(true);
						setIsOpen(false);
					}}
				>
					<Stack space="space.gap.medium" xcss={styles.chrome}>
						<Inline spread="space-between" space="space.gap.medium" alignBlock="center" shouldWrap>
							<Heading as="h1" size="medium" id={`${id}-title`}>
								Workspace settings
							</Heading>
							<IconButton
								type="button"
								icon={CrossIcon}
								label="Close settings"
								appearance="subtle"
								onClick={cancel}
							/>
						</Inline>
						<Text id={`${id}-description`} color="color.text.subtle">
							Manage workspace details and team preferences.
						</Text>
					</Stack>
					<Stack space="space.gap.xxlarge" xcss={cx(styles.body, styles.divider)}>
						<Stack space="space.gap.xlarge" xcss={cx(styles.section, styles.details)}>
							<Heading as="h2" size="small">
								Workspace details
							</Heading>
							<Stack space="space.gap.small">
								<Label htmlFor={`${id}-workspace`}>Workspace name</Label>
								<Textfield
									ref={nameRef}
									id={`${id}-workspace`}
									value={draft.name}
									onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })}
								/>
							</Stack>
							<Stack space="space.gap.small">
								<Label htmlFor={`${id}-workspace-description`}>Description</Label>
								<Textfield
									id={`${id}-workspace-description`}
									value={draft.description}
									aria-describedby={`${id}-help`}
									onChange={(event) =>
										setDraft({ ...draft, description: event.currentTarget.value })
									}
								/>
								<Box xcss={styles.help}>
									<Text id={`${id}-help`} size="small" color="color.text.information">
										Help teammates understand what this workspace is for.
									</Text>
								</Box>
							</Stack>
						</Stack>
						<Stack space="space.gap.large" xcss={cx(styles.section, styles.preferences)}>
							<Heading as="h2" size="small">
								Notifications
							</Heading>
							<Text color="color.text.subtle">Choose which updates you receive.</Text>
							{(
								[
									{ key: 'projectUpdates', label: 'Project updates' },
									{ key: 'mentions', label: 'Mentions and replies' },
									{ key: 'weeklyDigest', label: 'Weekly team digest' },
								] as const
							).map(({ key, label }) => (
								<Box key={key} xcss={styles.option}>
									<Checkbox
										label={label}
										isChecked={draft[key]}
										onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })}
									/>
								</Box>
							))}
						</Stack>
						<Stack space="space.gap.large" xcss={cx(styles.section, styles.preferences)}>
							<Heading as="h2" size="small">
								Collaboration
							</Heading>
							<Text color="color.text.subtle">Set the defaults for new projects.</Text>
							{(
								[
									{ key: 'allowProjects', label: 'Allow teammates to create projects' },
									{ key: 'shareProjects', label: 'Share new projects with the workspace' },
								] as const
							).map(({ key, label }) => (
								<Box key={key} xcss={styles.option}>
									<Checkbox
										label={label}
										isChecked={draft[key]}
										onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })}
									/>
								</Box>
							))}
						</Stack>
					</Stack>
					<Stack space="space.gap.large" xcss={cx(styles.chrome, styles.divider)}>
						<Text size="small" color="color.text.subtle">
							Changes stay in this preview.
						</Text>
						<Inline alignInline="end" space="space.gap.medium" shouldWrap>
							<Button type="button" appearance="subtle" onClick={cancel}>
								Cancel
							</Button>
							<Button type="submit" appearance="primary">
								Save changes
							</Button>
						</Inline>
					</Stack>
				</form>
			) : (
				<Stack space="space.gap.large" xcss={cx(styles.dialog, styles.chrome)} alignInline="center">
					{savedMessage && (
						<Box role="status" id={`${id}-saved`}>
							<Text>Workspace settings saved.</Text>
						</Box>
					)}
					<Button
						ref={openButtonRef}
						aria-haspopup="dialog"
						aria-describedby={savedMessage ? `${id}-saved` : undefined}
						onClick={() => {
							setSavedMessage(false);
							setIsOpen(true);
						}}
					>
						Open settings
					</Button>
				</Stack>
			)}
		</div>
	);
}
