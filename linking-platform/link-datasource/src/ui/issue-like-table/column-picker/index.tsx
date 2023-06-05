/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';
import { CheckboxOption, OptionType, PopupSelect } from '@atlaskit/select';

import { columnPickerMessages } from './messages';
import { ColumnPickerProps } from './types';

export const ColumnPicker = ({
  isDatasourceLoading,
  columns,
  selectedColumnKeys,
  onSelectedColumnKeysChange,
  onOpen,
}: ColumnPickerProps) => {
  const intl = useIntl();
  const [allOptions, setAllOptions] = useState<OptionType[]>([]);

  const mapColumnToOption: (
    column: DatasourceResponseSchemaProperty,
  ) => OptionType = useCallback(
    ({ key, title }) => ({ label: title, value: key }),
    [],
  );

  const selectedOptions: readonly OptionType[] = columns
    .filter(({ key }) => selectedColumnKeys.includes(key))
    .map(mapColumnToOption);

  useEffect(() => {
    setAllOptions(columns.filter(({ title }) => title).map(mapColumnToOption));
  }, [columns, mapColumnToOption]);

  const handleChange = useCallback(
    (selectedOptions: readonly OptionType[]) => {
      const selectedValues = selectedOptions.map(
        ({ value }) => value as string,
      );

      selectedValues.sort((a, b) => {
        const indexB = columns.findIndex(({ key }) => key === b);
        const indexA = columns.findIndex(({ key }) => key === a);
        return indexA - indexB;
      });

      onSelectedColumnKeysChange(selectedValues);
    },
    [columns, onSelectedColumnKeysChange],
  );

  const sortSelectedColumnsTop = useCallback(() => {
    if (!allOptions.length) {
      return;
    }

    const nonSelectedOptions = allOptions.filter(
      option =>
        !selectedOptions.find(
          selectedOption => selectedOption.value === option.value,
        ),
    );

    const sortedOptions = [...selectedOptions, ...nonSelectedOptions];

    sortedOptions.length > 0 && setAllOptions(sortedOptions);
  }, [allOptions, selectedOptions]);

  const handleOpen = useCallback(() => {
    onOpen && void onOpen();
    void sortSelectedColumnsTop();
  }, [onOpen, sortSelectedColumnsTop]);

  return (
    <PopupSelect
      classNamePrefix={'column-picker-popup'}
      testId={'column-picker-popup'}
      components={{ Option: CheckboxOption }}
      options={allOptions}
      value={selectedOptions}
      onOpen={handleOpen}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isMulti
      placeholder={intl.formatMessage(columnPickerMessages.search)}
      aria-label="Search for fields"
      onChange={handleChange}
      isLoading={allOptions.length === 0}
      target={({ isOpen, ...triggerProps }) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          iconBefore={
            <div>
              <BoardIcon label="board" size="small" />
              <ChevronDownIcon label="down" size="small" />
            </div>
          }
          spacing="compact"
          appearance="subtle"
          testId="column-picker-trigger-button"
          isDisabled={isDatasourceLoading}
        />
      )}
    />
  );
};
