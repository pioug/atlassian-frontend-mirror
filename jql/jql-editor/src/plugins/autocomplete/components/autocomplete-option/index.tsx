import React, { forwardRef, useCallback, useMemo, useState } from 'react';

import deburr from 'lodash/deburr';
import noop from 'lodash/noop';

import { type NewCoreIconProps } from '@atlaskit/icon';
import DataFormulaIcon from '@atlaskit/icon-lab/core/data-formula';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ClockIcon from '@atlaskit/icon/core/clock';
import DataNumberIcon from '@atlaskit/icon/core/data-number';
import FieldDropdownIcon from '@atlaskit/icon/core/field-dropdown';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';
import InfoIcon from '@atlaskit/icon/core/status-information';
import TagIcon from '@atlaskit/icon/core/tag';
import CheckboxIcon from '@atlaskit/icon/core/task';
import TextIcon from '@atlaskit/icon/core/text';
import { normaliseJqlString } from '@atlaskit/jql-ast';
import { type Position } from '@atlaskit/jql-autocomplete';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useIntl } from '../../../../state';
import { type SelectableAutocompleteOption } from '../types';

import { messages } from './messages';
import {
	DeprecatedOptionContainer,
	FieldType,
	FieldTypeIcon,
	OptionHighlight,
	OptionListItem,
	OptionName,
	TooltipContent,
} from './styled';

type Props = {
	isSelected: boolean;
	onClick: () => void;
	onMouseMove: () => void;
	option: SelectableAutocompleteOption;
};

type ResizedIconProps = {
	Icon: (props: NewCoreIconProps) => JSX.Element;
};

const ResizedIcon = ({ Icon }: ResizedIconProps) => (
	<Icon label="" testId="jql-editor-field-type-icon" color="currentColor" />
);

/**
 * List of types with supported icons is derived from GIN
 * Custom SVGs are provisional while we work on making field type icons consistent across Atlassian
 */
const getFieldTypeIcon = (type: string) => {
	switch (type) {
		case 'Checkboxes':
			return <ResizedIcon Icon={CheckboxIcon} />;
		case 'Date':
			return <ResizedIcon Icon={CalendarIcon} />;
		case 'Dropdown':
			return <ResizedIcon Icon={FieldDropdownIcon} />;
		case 'Labels':
			return <ResizedIcon Icon={TagIcon} />;
		case 'Number':
			return <ResizedIcon Icon={DataNumberIcon} />;
		case 'Paragraph':
			return <ResizedIcon Icon={AlignTextLeftIcon} />;
		case 'People':
			return <ResizedIcon Icon={PersonAvatarIcon} />;
		case 'Short text':
			return <ResizedIcon Icon={TextIcon} />;
		case 'Time stamp':
			return <ResizedIcon Icon={ClockIcon} />;
		case 'Formula':
			return <ResizedIcon Icon={DataFormulaIcon} />;
		default:
			return null;
	}
};

const getHighlightPosition = (name: string, matchedText: string): Position | null => {
	const normalizedName = deburr(name).toLowerCase();
	const normalizedMatchedText = deburr(normaliseJqlString(matchedText)).toLowerCase();
	const index = normalizedName.indexOf(normalizedMatchedText);
	if (index === -1) {
		return null;
	}
	return [index, index + normalizedMatchedText.length];
};

const getDeprecatedTooltipMessage = (deprecatedSearcherKey: string | undefined) => {
	switch (deprecatedSearcherKey) {
		case 'com.pyxis.greenhopper.jira:gh-epic-link-searcher':
		case 'com.atlassian.jpo:jpo-custom-field-parent-searcher':
			return messages.deprecatedFieldTooltipParentReplacementMessage;
		default:
			return messages.deprecatedFieldTooltipDefaultMessage;
	}
};

const AutocompleteOption = forwardRef<HTMLLIElement, Props>((props, ref) => {
	const {
		option: { id, name, fieldType, matchedText, isDeprecated = false, deprecatedSearcherKey },
		isSelected,
		onClick,
		onMouseMove,
	} = props;

	const [overflows, setOverflows] = useState(false);

	const [{ formatMessage }] = useIntl();

	const onNameRef = useCallback(
		(node: HTMLElement | null) => {
			// This ref will be re-invoked after a tooltip is rendered, so we avoid recomputing the overflow in that instance
			// so we don't risk infinite re-renders (which we've observed through production logs).
			if (node != null && !overflows) {
				setOverflows(node.offsetWidth < node.scrollWidth);
			}
		},
		[overflows],
	);

	// TODO: verify type is i18n'd after integrating with GraphQL API

	const fieldTypeIcon = fieldType ? getFieldTypeIcon(fieldType) : null;

	const optionName = useMemo(() => {
		const highlightPosition = getHighlightPosition(name, matchedText);
		return highlightPosition ? (
			<OptionName ref={onNameRef} aria-label={name}>
				{name.substring(0, highlightPosition[0])}
				<OptionHighlight>{name.substring(...highlightPosition)}</OptionHighlight>
				{name.substring(highlightPosition[1])}
			</OptionName>
		) : (
			<OptionName ref={onNameRef}>{name}</OptionName>
		);
	}, [onNameRef, name, matchedText]);

	const deprecatedTooltipContent = (
		<TooltipContent>
			{formatMessage(getDeprecatedTooltipMessage(deprecatedSearcherKey), {
				b: (text: React.ReactNode[]) => <b>{text}</b>,
				received: name,
				parentReplacement: 'Parent',
			})}
		</TooltipContent>
	);

	const ListItem = (
		<OptionListItem
			id={id}
			data-testid="jql-editor-autocomplete-option"
			role="option"
			isSelected={isSelected}
			isDeprecated={isDeprecated}
			onClick={isDeprecated ? noop : onClick}
			onMouseMove={isDeprecated ? noop : onMouseMove}
			{...(ref && { ref: ref })}
			aria-selected={isSelected}
		>
			{isDeprecated ? (
				<DeprecatedOptionContainer>
					{optionName}
					<Tooltip content={deprecatedTooltipContent} position={'right'}>
						<InfoIcon
							spacing="spacious"
							testId="jql-editor-deprecated-icon"
							label=""
							color={token('color.icon', N400)}
						/>
					</Tooltip>
				</DeprecatedOptionContainer>
			) : (
				optionName
			)}
			{fieldType && (
				<FieldType>
					{fieldTypeIcon && <FieldTypeIcon>{fieldTypeIcon}</FieldTypeIcon>}
					{fieldType}
				</FieldType>
			)}
		</OptionListItem>
	);

	const tooltipContent = <TooltipContent>{name}</TooltipContent>;

	if (overflows) {
		return (
			<Tooltip content={tooltipContent} position={'right'}>
				{ListItem}
			</Tooltip>
		);
	}

	return ListItem;
});

export default AutocompleteOption;
