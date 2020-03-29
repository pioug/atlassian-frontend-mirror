import { code } from '@atlaskit/docs';
import md from './docs-util/md';

export default md`
  ## Generic OptionType
  Select accepts one generic, \`OptionType\` which represents the type of data Select is handling. This defaults to \`react-select\` option type.

  **Custom OptionType:**

  ${code`
import Select from '@atlaskit/select';

interface OptionType {
  label: string;
  value: string;
}

const colors = [
  { label: 'blue', value: 'blue' },
  { label: 'red', value: 'red' },
  { label: 'purple', value: 'purple' },
];

<Select<OptionType>
  {...props}
  options={colors}
/>
  `}

  ## onChange handler
  Select now exposes the \`onChange\` types directly from \`react-select\`, which uses a type called \`ValueType\`...

  ${code`
export type OptionsType<OptionType> = ReadonlyArray<OptionType>;

type ValueType<OptionType> = OptionType | OptionsType<OptionType> | null | undefined;
  `}

  Put simply, \`OptionType\` or \`OptionType[]\` or \`null\` or \`undefined\`.

  It means we need to explicitly handle these cases in our \`onChange\` handler.
  You might run into issues here where you have previously only expected a single value or an array, not both.

  **An example:**

  ${code`
<Select
  {...props}
  onChange={value => {
    if (!value) {
      // Handle the undefined / null scenario here
    } else if (value instanceof Array) {
      // Handle an array here
      // You will likely get an array if you have enabled
      // isMulti prop
    } else {
      // Handle a single value here
    }
  }}
/>
  `}
`;
