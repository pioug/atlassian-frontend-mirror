/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import Button from '@atlaskit/button/standard-button';
import { BlockName } from '../../constants';

const blockSelectStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;

  .block-select {
    flex: 1 1 auto;
  }
`;

type BlockOption = {
  label: string;
  value: BlockName;
};

const blockOptions = Object.values(BlockName).map((value) => ({
  label: value,
  value,
}));

const BlockOption: React.FC<{ onClick: (name: BlockName) => void }> = ({
  onClick,
}) => {
  const [selectedOption, setSelectedOption] = useState<BlockOption>();

  const handleOnChange = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const handleOnClick = useCallback(() => {
    if (selectedOption?.value) {
      onClick(selectedOption.value);
    }
  }, [onClick, selectedOption]);

  return (
    <Field name="block" defaultValue={null} label="Blocks">
      {({ fieldProps: { id, ...rest } }) => (
        <div css={blockSelectStyles}>
          <Select
            inputId="block-select"
            className="block-select"
            placeholder="Choose a block"
            {...rest}
            onChange={handleOnChange}
            options={blockOptions}
            value={selectedOption}
          />
          <Button onClick={handleOnClick}>Add</Button>
        </div>
      )}
    </Field>
  );
};

export default BlockOption;
