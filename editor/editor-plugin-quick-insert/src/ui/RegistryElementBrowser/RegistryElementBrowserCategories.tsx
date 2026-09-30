/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { jsx } from '@atlaskit/css';
import {
	BLOCK_TEMPLATES_SECTION,
	CREATE_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	ROVO_SECTION,
	STRUCTURE_SECTION,
	TEXT_FORMATTING_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import type { RegistryElementBrowserSection } from './model';

type Props = {
	onSectionClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	section?: string;
	sections: RegistryElementBrowserSection[];
	selectedButtonRef: React.Ref<HTMLButtonElement>;
};

const sectionMessages = {
	[BLOCK_TEMPLATES_SECTION.key]: messages.categoryBlockTemplates,
	[CREATE_SECTION.key]: messages.categoryCreate,
	[DATA_AND_CHARTS_SECTION.key]: messages.categoryDataAndCharts,
	[EMBED_SECTION.key]: messages.categoryEmbed,
	[MEDIA_SECTION.key]: messages.categoryMedia,
	[OTHER_SECTION.key]: messages.categoryOther,
	[ROVO_SECTION.key]: messages.categoryRovo,
	[STRUCTURE_SECTION.key]: messages.categoryStructure,
	[TEXT_FORMATTING_SECTION.key]: messages.categoryTextFormatting,
} as const;

const categoryGridStyles = css({
	alignContent: 'start',
	alignSelf: 'start',
	display: 'grid',
	gap: token('space.100'),
	gridTemplateColumns: 'minmax(0, 1fr)',
	minWidth: 0,
	paddingBlock: token('space.050'),
	paddingInline: token('space.050'),
	position: 'sticky',
	top: 0,
	'@media (max-width: 599px)': {
		backgroundColor: token('elevation.surface.overlay'),
		gridAutoColumns: 'max-content',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'none',
		gridTemplateRows: 'minmax(0, 1fr)',
		overflowX: 'auto',
		overflowY: 'hidden',
		width: '100%',
		zIndex: 1,
	},
});

export const RegistryElementBrowserCategories = ({
	section,
	sections,
	onSectionClick,
	selectedButtonRef,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isAllSelected = section === undefined;
	const onCategoryKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
			return;
		}

		const isForward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
		const nextButton = (
			isForward
				? (event.currentTarget.nextElementSibling ??
					event.currentTarget.parentElement?.firstElementChild)
				: (event.currentTarget.previousElementSibling ??
					event.currentTarget.parentElement?.lastElementChild)
		) as HTMLButtonElement | null;
		if (nextButton) {
			event.preventDefault();
			nextButton.focus();
			nextButton.click();
		}
	}, []);

	return (
		<div
			aria-label={formatMessage({
				defaultMessage: 'Element categories',
				id: 'editor.quick-insert.categories-label',
			})}
			css={categoryGridStyles}
			data-testid="registry-element-browser-categories"
			role="group"
		>
			<Button
				appearance={'subtle'}
				aria-pressed={isAllSelected}
				data-section=""
				onClick={onSectionClick}
				onKeyDown={onCategoryKeyDown}
				ref={isAllSelected ? selectedButtonRef : undefined}
				isSelected={isAllSelected}
				shouldFitContainer
				tabIndex={isAllSelected ? 0 : -1}
			>
				<Text align="start" color="inherit" maxLines={1} weight="medium">
					{formatMessage({ defaultMessage: 'All', id: 'editor.quick-insert.all' })}
				</Text>
			</Button>
			{sections.map((entry) => (
				<Button
					appearance={'subtle'}
					aria-pressed={section === entry.key}
					data-section={entry.key}
					key={entry.key}
					onClick={onSectionClick}
					onKeyDown={onCategoryKeyDown}
					ref={section === entry.key ? selectedButtonRef : undefined}
					isSelected={section === entry.key}
					shouldFitContainer
					tabIndex={section === entry.key ? 0 : -1}
				>
					<Text align="start" color="inherit" maxLines={1} weight="medium">
						{formatMessage(
							sectionMessages[entry.key as keyof typeof sectionMessages] ?? messages.categoryOther,
						)}
					</Text>
				</Button>
			))}
		</div>
	);
};
