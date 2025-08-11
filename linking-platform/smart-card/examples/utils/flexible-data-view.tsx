/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import {
	Card,
	type ElementItem,
	type ElementName,
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../src';

import { actionNames, metadataElements } from './flexible-ui';

const flexStyles = css({
	'[data-smart-block]': {
		// MetadataBlock: Element showcase

		"&[data-testid^='AppliedToComponentsCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				wordBreak: 'break-all',
				textAlign: 'center',
				content: "'AppliedToComponentsCount'",
			},
		},
		"&[data-testid^='AssignedTo']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'AssignedTo'",
			},
		},
		"&[data-testid^='AssignedToGroup']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'AssignedToGroup'",
			},
		},
		"&[data-testid^='AttachmentCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'AttachmentCount'",
			},
		},
		"&[data-testid^='AuthorGroup']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'AuthorGroup'",
			},
		},
		"&[data-testid^='ChecklistProgress']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ChecklistProgress'",
			},
		},
		"&[data-testid^='CollaboratorGroup']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'CollaboratorGroup'",
			},
		},
		"&[data-testid^='CommentCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'CommentCount'",
			},
		},
		"&[data-testid^='CreatedBy']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'CreatedBy'",
			},
		},
		"&[data-testid^='CreatedOn']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'CreatedOn'",
			},
		},
		"&[data-testid^='DueOn']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'DueOn'",
			},
		},
		"&[data-testid^='LatestCommit']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'LatestCommit'",
			},
		},
		"&[data-testid^='Location']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'Location'",
			},
		},
		"&[data-testid^='ModifiedBy']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ModifiedBy'",
			},
		},
		"&[data-testid^='ModifiedOn']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ModifiedOn'",
			},
		},
		"&[data-testid^='OwnedBy']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'OwnedBy'",
			},
		},
		"&[data-testid^='OwnedByGroup']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'OwnedByGroup'",
			},
		},
		"&[data-testid^='Priority']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'Priority'",
			},
		},
		"&[data-testid^='ProgrammingLanguage']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ProgrammingLanguage'",
			},
		},
		"&[data-testid^='Provider']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'Provider'",
			},
		},
		"&[data-testid^='ReactCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ReactCount'",
			},
		},
		"&[data-testid^='ReadTime']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ReadTime'",
			},
		},
		"&[data-testid^='SourceBranch']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'SourceBranch'",
			},
		},
		"&[data-testid^='State']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'State'",
			},
		},
		"&[data-testid^='SubscriberCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'SubscriberCount'",
			},
		},
		"&[data-testid^='SubTasksProgress']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'SubTasksProgress'",
			},
		},
		"&[data-testid^='StoryPoints']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'StoryPoints'",
			},
		},
		"&[data-testid^='TargetBranch']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'TargetBranch'",
			},
		},
		"&[data-testid^='ViewCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'ViewCount'",
			},
		},
		"&[data-testid^='VoteCount']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'VoteCount'",
			},
		},
		"&[data-testid^='SentOn']": {
			display: 'flex',
			'&:empty': {
				justifyContent: 'space-between',
			},
			'&::before': {
				display: 'inline-flex',
				marginRight: '1rem',
				width: '10rem',
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
				content: "'SentOn'",
			},
		},

		"&[data-testid^='smart-']": {
			display: 'flex',
			paddingTop: '1.5rem',
			position: 'relative',
			'&::before': {
				display: 'flex',
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				alignItems: 'center',
				backgroundColor: token('color.background.neutral', '#091E420F'),
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: token('border.radius.100', '3px'),
				color: token('color.text', '#172B4D'),
				justifyContent: 'center',
				padding: '0.125rem 0',
				/**
				 * We are hacking flexible smart links styling here to display the information
				 * about elements.
				 */
				fontFamily:
					"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
				fontSize: '0.75rem',
				lineHeight: '0.75rem',
			},
			// TODO: If we assign block name to data-smart-block the same way we do
			// on data-smart-element, we can auto generate the block name
			// and don't have to rely on testId
			"&[data-testid^='smart-block-title']::before": {
				content: 'TitleBlock',
			},

			"&[data-testid^='smart-block-preview']::before": {
				content: 'PreviewBlock',
			},

			"&[data-testid^='smart-block-snippet']::before": {
				content: 'SnippetBlock',
			},

			"&[data-testid^='smart-footer-block']::before": {
				content: 'FooterBlock',
			},

			"&[data-testid^='smart-block-metadata']::before": {
				content: 'Metadata (ElementItem)',
			},
		},
	},
});

const FlexibleDataView = ({ url }: { url?: string }) => (
	<div css={flexStyles}>
		<Card appearance="block" url={url}>
			<TitleBlock />
			<PreviewBlock />
			<SnippetBlock />
			<FooterBlock
				actions={actionNames.map((name, _idx) => ({
					name,
					onClick: () => {},
				}))}
			/>
			<MetadataBlock primary={[{ name: 'ElementItem' as ElementName } as ElementItem]} />
			{metadataElements.map((name, idx) => (
				<MetadataBlock key={idx} maxLines={1} primary={[{ name } as ElementItem]} testId={name} />
			))}
		</Card>
	</div>
);

export default FlexibleDataView;
