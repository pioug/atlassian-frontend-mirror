import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import deburr from 'lodash/deburr';
import noop from 'lodash/noop';

import Icon from '@atlaskit/icon';
import InfoIcon from '@atlaskit/icon/glyph/editor/panel';
import { normaliseJqlString } from '@atlaskit/jql-ast';
import { Position } from '@atlaskit/jql-autocomplete';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useIntl } from '../../../../state';
import { SelectableAutocompleteOption } from '../types';

import {
  checkboxGlyph,
  dateGlyph,
  dropdownGlyph,
  labelGlyph,
  numberGlyph,
  paragraphGlyph,
  peopleGlyph,
  shortTextGlyph,
  timeStampGlyph,
} from './glyphs';
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
  option: SelectableAutocompleteOption;
  onClick: () => void;
  onMouseMove: () => void;
};

const ResizedIcon = ({ glyph }: { glyph: () => ReactElement }) => (
  <Icon
    glyph={glyph}
    size="small"
    label=""
    testId="jql-editor-field-type-icon"
  />
);

/**
 * List of types with supported icons is derived from GIN
 * Custom SVGs are provisional while we work on making field type icons consistent across Atlassian
 */
const getFieldTypeIcon = (type: string) => {
  switch (type) {
    case 'Checkboxes':
      return <ResizedIcon glyph={checkboxGlyph} />;
    case 'Date':
      return <ResizedIcon glyph={dateGlyph} />;
    case 'Dropdown':
      return <ResizedIcon glyph={dropdownGlyph} />;
    case 'Labels':
      return <ResizedIcon glyph={labelGlyph} />;
    case 'Number':
      return <ResizedIcon glyph={numberGlyph} />;
    case 'Paragraph':
      return <ResizedIcon glyph={paragraphGlyph} />;
    case 'People':
      return <ResizedIcon glyph={peopleGlyph} />;
    case 'Short text':
      return <ResizedIcon glyph={shortTextGlyph} />;
    case 'Time stamp':
      return <ResizedIcon glyph={timeStampGlyph} />;
    default:
      return null;
  }
};

const getHighlightPosition = (
  name: string,
  matchedText: string,
): Position | null => {
  const normalizedName = deburr(name).toLowerCase();
  const normalizedMatchedText = deburr(
    normaliseJqlString(matchedText),
  ).toLowerCase();
  const index = normalizedName.indexOf(normalizedMatchedText);
  if (index === -1) {
    return null;
  }
  return [index, index + normalizedMatchedText.length];
};

const getDeprecatedTooltipMessage = (
  deprecatedSearcherKey: string | undefined,
) => {
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
    option: {
      id,
      name,
      fieldType,
      matchedText,
      isDeprecated = false,
      deprecatedSearcherKey,
    },
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
        <OptionHighlight>
          {name.substring(...highlightPosition)}
        </OptionHighlight>
        {name.substring(highlightPosition[1])}
      </OptionName>
    ) : (
      <OptionName ref={onNameRef}>{name}</OptionName>
    );
  }, [onNameRef, name, matchedText]);

  const deprecatedTooltipContent = (
    <TooltipContent>
      {formatMessage(getDeprecatedTooltipMessage(deprecatedSearcherKey), {
        b: (text: string) => <b>{text}</b>,
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
              testId="jql-editor-deprecated-icon"
              label=""
              primaryColor={token('color.icon', N400)}
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
