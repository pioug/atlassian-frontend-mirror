/* eslint-disable @repo/internal/fs/filename-pattern-match */
import CreatableReactSelect from '@atlaskit/react-select/creatable';

import createSelect from './create-select';

const CreatableSelect: <Option extends unknown = import("./types").OptionType, IsMulti extends boolean = false>(props: (import("./types").SelectProps<Option, IsMulti> | import("./types").AsyncSelectProps<Option, IsMulti> | import("./types").CreatableSelectProps<Option, IsMulti>) & {
    ref?: import("react").Ref<import("./types").AtlaskitSelectRefType>;
}) => JSX.Element = createSelect(CreatableReactSelect);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default CreatableSelect;
