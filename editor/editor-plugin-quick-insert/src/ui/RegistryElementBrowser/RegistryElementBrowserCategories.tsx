/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { jsx } from '@atlaskit/css';
import {
	BLOCK_TEMPLATES_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	ROVO_SECTION,
	STRUCTURE_SECTION,
	TEXT_FORMATTING_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { token } from '@atlaskit/tokens';

import type { RegistryElementBrowserSection } from './model';

type Props = {
	onSectionClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	section?: string;
	sections: RegistryElementBrowserSection[];
};

const sectionMessages = {
	[BLOCK_TEMPLATES_SECTION.key]: messages.categoryBlockTemplates,
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
	display: 'grid',
	gap: token('space.100'),
	gridTemplateColumns: 'minmax(0, 1fr)',
	'@media (max-width: 599px)': {
		gridAutoColumns: 'max-content',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'none',
		gridTemplateRows: 'minmax(0, 1fr)',
		overflowX: 'auto',
		overflowY: 'hidden',
	},
});

export const RegistryElementBrowserCategories = ({
	section,
	sections,
	onSectionClick,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isAllSelected = section === undefined;

	return (
		<div
			aria-label={formatMessage({
				defaultMessage: 'Element categories',
				id: 'editor.quick-insert.categories-label',
			})}
			css={categoryGridStyles}
			data-testid="registry-element-browser-categories"
		>
			<Button
				appearance={'subtle'}
				aria-pressed={isAllSelected}
				data-section=""
				onClick={onSectionClick}
				isSelected={isAllSelected}
				shouldFitContainer
			>
				{formatMessage({ defaultMessage: 'All', id: 'editor.quick-insert.all' })}
			</Button>
			{sections.map((entry) => (
				<Button
					appearance={'subtle'}
					aria-pressed={section === entry.key}
					data-section={entry.key}
					key={entry.key}
					onClick={onSectionClick}
					isSelected={section === entry.key}
					shouldFitContainer
				>
					{formatMessage(
						sectionMessages[entry.key as keyof typeof sectionMessages] ?? messages.categoryOther,
					)}
				</Button>
			))}
		</div>
	);
};
