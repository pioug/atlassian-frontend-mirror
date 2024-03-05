/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { faker } from '@faker-js/faker';
import { IntlProvider } from 'react-intl-next';
import uuid from 'uuid';

import { Field } from '@atlaskit/form';
import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';
import Textfield from '@atlaskit/textfield';

import { ColumnPicker } from '../../src/ui/issue-like-table/column-picker';

const containerStyles = css({
  padding: '20px',
  width: '400px',
});

const generateFieldName = (): DatasourceResponseSchemaProperty => {
  const column = faker.database.column();
  return {
    key: column + uuid(),
    title: column.charAt(0).toUpperCase() + column.substring(1),
    type: 'string',
    isList: false,
  };
};

export default () => {
  const [columns, setColumns] = useState<DatasourceResponseSchemaProperty[]>(
    [],
  );
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([]);
  const [numberOfFields, setNumberOfFields] = useState<number>(1000);

  const onOpen = useCallback(() => {
    setColumns(Array(numberOfFields).fill(null).map(generateFieldName));
  }, [numberOfFields]);

  return (
    <div css={containerStyles}>
      <IntlProvider locale="en">
        <Field label="Number of fields" name="number-of-fields">
          {({ fieldProps }) => (
            <Textfield
              placeholder="Enter number here"
              {...fieldProps}
              value={numberOfFields}
              onChange={e => {
                const value = +e.currentTarget.value;
                console.log(`set new value of ${value}`);
                setNumberOfFields(value);
              }}
            />
          )}
        </Field>

        <ColumnPicker
          columns={columns}
          selectedColumnKeys={selectedColumnKeys}
          onSelectedColumnKeysChange={setSelectedColumnKeys}
          onOpen={onOpen}
        />
      </IntlProvider>
    </div>
  );
};
