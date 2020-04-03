import React from 'react';
import { code, md } from '@atlaskit/docs';

export const propChanges = [
  {
    key: 'appearance',
    status: 'removed',
    label: 'appearance',
    packages: ['single', 'multi'],
  },
  {
    key: 'defaultSelected',
    status: 'renamed',
    label: 'defaultSelected',
    content: 'defaultValue',
    packages: ['single', 'multi'],
  },
  {
    key: 'droplistShouldFitContainer',
    status: 'removed',
    label: 'droplistShouldFitContainer',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'hasAutocomplete',
    status: 'renamed',
    label: 'hasAutocomplete',
    content: 'isSearchable',
    packages: ['single', 'multi'],
  },
  {
    key: 'id',
    status: 'renamed',
    label: 'id',
    content: 'instanceId',
    packages: ['single', 'multi'],
  },
  {
    key: 'invalidMessage',
    status: 'removed',
    label: 'invalidMessage',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'isFirstChild',
    status: 'removed',
    label: 'isFirstChild',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'isDisabled',
    status: 'unchanged',
    label: 'isDisabled',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'isRequired',
    status: 'removed',
    label: 'isRequired',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'isOpen',
    status: 'renamed',
    label: 'isOpen',
    content: 'menuIsOpen',
    packages: ['single', 'multi'],
  },
  {
    key: 'isInvalid',
    status: 'removed',
    label: 'isInvalid',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'items',
    status: 'changed',
    label: 'items',
    content: md`
      the items prop has been deprecated, instead @atlaskit/select exposes an options prop
      that is much less prescriptive in regards to its expected shape.
      For more details on usage, and how to implement behaviour previously afforded by the items prop
      please see the [Options](/packages/core/select/docs/upgrade-guide#options) section of this upgrade guide.
    `,
    packages: ['single', 'multi'],
  },
  {
    key: 'label',
    status: 'removed',
    label: 'label',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'loadingMessage',
    status: 'changed',
    label: 'loadingMessage',
    content: (
      <span>
        {md`
          Previously loadingMessage was a string.
          In @atlaskit/select loadingMessage is now a **function** that takes an inputValue and returns a string
        `}
        {code`({ inputValue: string }) => string`}
      </span>
    ),
    packages: ['single', 'multi'],
  },
  {
    key: 'name',
    status: 'unchanged',
    label: 'name',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'noMatchesFound',
    status: 'changed',
    label: 'noMatchesFound',
    content: (
      <div>
        {md`
          noMatchesFound has been deprecated, we now use the **noOptionsMessage** prop in @atlaskit/select.
          The noOptionsMessage prop is a function that takes an inputValue and returns a string
        `}
        {code`({inputValue: string}) => string`}
      </div>
    ),
    packages: ['single', 'multi'],
  },
  {
    key: 'onFilterChange',
    status: 'changed',
    label: 'onFilterChange',
    content: (
      <div>
        {md`
          onFilterChange has been changed to onInputChange in @atlaskit/select, it has the following shape:
        `}
        {code`(ValueType, ActionMeta) => void`}
        {md`
          where ValueType is of type **string**, and ActionMeta is an object of the following shape
        `}
        {code`{ action: "set-value" | "input-change" | "input-blur" | "menu-close" } `}
      </div>
    ),
    packages: ['single', 'multi'],
  },
  {
    key: 'onSelected',
    status: 'changed',
    label: 'onSelected',
    content: (
      <div>
        {md`
          onSelected has been deprecated in @atlaskit/select,
          its concerns are now a part of the onChange prop,
          which has the following shape:
        `}
        {code`(ValueType, ActionMeta) => void`}
        {md`
where ValueType is of the type
        `}
        {code`
        { [string]: any } |
        Array<{ [string]: any }> |
        null |
        undefined`}
        {md`
and ActionMeta is of the type object with the following shape
        `}
        {code`
        {
          removedValue?: { [string]: any }
          action: "select-option"
          | "deselect-option"
          | "remove-value"
          | "pop-value"
          | "set-value"
          | "clear"
          | "create-option"
        }
      `}
        {md`
          **Note** removedValue exists only when the action is of type "remove-value" or "pop-value"
        `}
      </div>
    ),
    packages: ['single', 'multi'],
  },
  {
    key: 'onOpenChange',
    status: 'changed',
    label: 'onOpenChange',
    content: (
      <div>
        {md`
          onOpenChange has been deprecated and split into two function props
          **onMenuOpen** and **onMenuClose** to be more explicit.
          both onMenuOpen and onMenuClose have the following shape:
        `}
        {code`() => void`}
      </div>
    ),
    packages: ['single', 'multi'],
  },
  {
    key: 'placeholder',
    status: 'unchanged',
    label: 'placeholder',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'selectedItem',
    status: 'renamed',
    label: 'selectedItem',
    content: 'value',
    packages: ['single', 'multi'],
  },
  {
    key: 'shouldFocus',
    status: 'renamed',
    label: 'shouldFocus',
    content: 'autoFocus',
    packages: ['single', 'multi'],
  },
  {
    key: 'shouldFitContainer',
    status: 'removed',
    label: 'shouldFitContainer',
    content:
      'shouldFitContainer is deprecated in @atlaskit/select, as by default the select now fills its bounding parent.',
    packages: ['single', 'multi'],
  },
  {
    key: 'shouldFlip',
    status: 'removed',
    label: 'shouldFlip',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'maxHeight',
    status: 'removed',
    label: 'maxHeight',
    content: '',
    packages: ['single', 'multi'],
  },
  {
    key: 'footer',
    status: 'removed',
    label: 'footer',
    content: md`
      Footer support is currently being implemented, and will be released shortly.
      For any queries in regards to this prop, please contact us in the Select Upgrade room on Stride
    `,
    packages: ['multi'],
  },
  {
    key: 'onNewItemCreated',
    status: 'removed',
    label: '',
    content: md`
      onNewItemCreated is no longer a supported prop, as we now export a CreatableSelect component.
      Please see the following [example](/examples/core/select/creatable-select) for usage, and the react-select [docs](https://deploy-preview-2289--react-select.netlify.com/props#creatable-props) for more detailed prop information.
    `,
    packages: ['multi'],
  },
  {
    key: 'shouldAllowCreateItem',
    status: 'removed',
    label: '',
    content: md`
      shouldAllowCreateItem is no longer a supported prop, as we now export a CreatableSelect component.
      Please see the following [example](/examples/core/select/creatable-select) for usage, and the react-select [docs](https://deploy-preview-2289--react-select.netlify.com/props#creatable-props) for more detailed prop information.
    `,
    packages: ['multi'],
  },
  {
    key: 'onRemoved',
    status: 'removed',
    label: 'onRemoved',
    content: (
      <div>
        {md`
          onRemoved has been deprecated in @atlaskit/select,
          its concerns are now a part of the onChange prop,
          which has the following shape:
        `}
        {code`(ValueType, ActionMeta) => void`}
        {md`
where ValueType is of the type
        `}
        {code`
        { [string]: any } |
        Array<{ [string]: any }> |
        null |
        undefined`}
        {md`
and ActionMeta is of the type object with the following shape
        `}
        {code`
        {
          removedValue?: { [string]: any }
          action: "select-option"
          | "deselect-option"
          | "remove-value"
          | "pop-value"
          | "set-value"
          | "clear"
          | "create-option"
        }
      `}
        {md`
          **Note** removedValue exists only when the action is of type "remove-value" or "pop-value"
        `}
      </div>
    ),
    packages: ['multi'],
  },
];
