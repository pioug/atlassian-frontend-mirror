/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback } from 'react';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import { BlockName } from '../../constants';

const blockSelectStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'space-between',
  '.block-select': {
    flex: '1 1 auto',
  },
});

const blockOptions = Object.values(BlockName).map((value) => ({
  label: value,
  value,
}));

const BlockOption: React.FC<{ onClick: (name: BlockName) => void }> = ({
  onClick,
}) => {
  const handleOnChange = useCallback(
    (option: any) => {
      onClick(option.value);
    },
    [onClick],
  );
  return (
    <Field name="block" defaultValue={null}>
      {({ fieldProps: { id, ...rest } }) => (
        <div css={blockSelectStyles}>
          <Select
            inputId="block-select"
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
            className="block-select"
            placeholder="Add a block"
            {...rest}
            onChange={handleOnChange}
            options={blockOptions}
          />
        </div>
      )}
    </Field>
  );
};

export default BlockOption;
