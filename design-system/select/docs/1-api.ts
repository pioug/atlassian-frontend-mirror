import { code } from '@atlaskit/docs';
import md from './docs-util/md';

const onChange = `onChange = (newValue, actionMeta) => console.log(actionMeta);
// possible values:
{
  removedValue?: ValueType,
  action: 'select-option'
    | 'deselect-option'
    | 'remove-value'
    | 'pop-value'
    | 'set-value'
    | 'clear'
    | 'create-option';
}`;

const onInputChange = `
onInputChange = (newValue, actionMeta) => console.log(actionMeta);
// possible values:
{
  action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close';
}
`;

const controlledPropExample = `<Select
  value={this.state.value}
  onChange={value => this.setState({ value })}
  inputValue={this.state.inputValue}
  onInputChange={inputValue => this.setState({ inputValue })}
  menuIsOpen={this.state.menuIsOpen}
  onMenuOpen={() => this.setState({ menuIsOpen: true })}
  onMenuClose={() => this.setState({ menuIsOpen: false })}
/>`;

const controlledDefaultPropExample = `<Select
  defaultValue={{ label: 'Default Option', value: 'default-value' }}
  defaultInputValue="Search Text"
  defaultMenuIsOpen={true}
/>
`;

const customOptionComponentExample = `components={{
  Option: ({ children, innerProps }) => (
    <div className="custom-option" {...innerProps}>
      {children}
    </div>
  )
}}`;

const customStyleExample = `styles={{
  control: (base) => ({ ...base, backgroundColor: 'white' })
}}`;

const createFilterConfigShape = `{
  ignoreCase?: boolean,
  ignoreAccents?: boolean,
  stringify?: Object => string,
  trim?: boolean,
  matchFrom?: 'any' | 'start'
}`;

const createFilterDefaultConfig = `{
  ignoreCase: true,
  ignoreAccents: true,
  stringify: option => option.label + " " + option.value
  trim: true,
  matchFrom: 'any'
}`;

export default md`
  ## Contents

  * [Controllable Props](#controllable-props)
  * [Components API](#components-api)
  * [Styles API](#styles-api)
  * [Custom Data Structure](#custom-data-structure)
  * [Custom Filter](#custom-filter)

  <a name="controllable-props"></a>
  ## Controllable Props

  **@atlaskit/single-select** and **@atlaskit/multi-select** had the concept of **stateful** and **stateless** components.
  Where the exported **stateful** component, internally managed specific (in state) props available in the stateless component.
  These props were:

  * selectedItem
  * filterValue
  * isOpen

  There's a lot of value in this idea, as it allows users to opt into controlling certain aspects of the select in one export while being happy with default behaviour
  in the **Stateless** version. However, what if I only want to control one of the three controllable props, and want the package to internally manage the rest?
  This was not possible in @atlaskit/single-select or @atlaskit/multi-select, if you opt into using the stateless component, you opt into being responsible for _all_ of the prop values specified.

  We've taken this concept and refined it in @atlaskit/select.
  In @atlaskit/select, there are three _optional_ props you can use to control the state of the component:

  * **value** controls the select value
  * **inputValue** controls the search input value
  * **menuIsOpen** controls whether the menu is open

  You can use none, any, or all of these depending on your requirements.
  The props have associated events that are called when the value should change. Here's an example implementation of all three:

  ${code`${controlledPropExample}`}

  If you don't use the controlled props, @atlaskit/select has props that let you default their value when it mounts:

  ${code`${controlledDefaultPropExample}`}

  We enable this by wrapping the select in a stateManager that uses the above specified prop values if they exist, otherwise it defers to internally managed state values.

  <a name="components-api"></a>
  ## Components API

  In single-select and multi-select, we've had several issues opened as a result of users wanting to customise
  the appearance or functionality of the exported select in various ways. @atlaskit/select opens up the API
  to allow customisation and configuration of any / every part of the select by exposing a new components prop.

  For example, to render a custom Option component:

  ${code`${customOptionComponentExample}`}


  All components are passed a set of common props. The most important to understand are:

  children - if the component should contain other components (for example, a menu contains options) they will be passed as children. This way you don't need to re-implement more than you absolutely need to.
  getStyles - a function that will return an object containing the styles for the component. If you have specified custom style modifiers, they will be executed by this function.
  innerProps - a set of props that should be spread onto the DOM element your component returns. It wires up accessibility attributes and events.

  You don't have to use these props, and are free to implement or reimplement as you like - but they are intended to help make custom implementations easier to manage.

  See the [Components Documentation](https://react-select.com/components) for more details and examples.

  <a name="styles-api"></a>
  ## Styles API

  Each component that @atlaskit/select exposes also has a corresponding key that you can specify in the styles prop.
  Each value you provide should be a function that takes the default styles, and returns your customised style object.

  For example, to give the control a white background:

  ${code`${customStyleExample}`}

  See the [Styles Documentation](https://react-select.com/styles) for more details and examples.

  <a name="custom-data-structure"></a>
  ## Custom Data Structure

  @atlaskit/select enforces as little opinion about the shape of your options as possible. With the combination of custom components API, and the styling API,
  your options can really take whatever shape you like. Of course by default, **assumptions** are made about how to render and filter options and values, however @atlaskit/select exposes
  the following methods to allow you to configure this as you choose.

  ### getOptionValue

  The \`getOptionValue\` prop takes the following shape:

  ${code`(option: OptionType) => string`}

  The returned string value is what is internally used within react-select to validate the following:

  * which options are matched to a search term (isSearchable)
  * which options are already selected (isMulti)
  * which options are removed
  * which options are rendered in the hidden input field (if it's rendered)

  ### getOptionLabel

  The \`getOptionLabel\` prop takes the following shape:

  ${code`(option) => string`}

  The returned string value is the string that's rendered:

  * as the label for options in the menu
  * as the label for value(s) in the control.

  Please use this if you only want to customise the label text that gets rendered for an option.

  ### formatOptionLabel

  The \`formatOptionLabel\` prop takes the following shape:

  ${code`(option, { context, inputValue, selectedValue}) => Node`}

  The returned Node is rendered as the label of the value/s rendered in the control.

  ### isOptionDisabled

  By default @atlaskit/select looks for a isDisabled property your passed in options. However as is the case with all the methods mentioned above, @atlaskit/select exposes a 'isOptionDisabled' prop that allows you to override this inbuilt logic. This takes the following shape:

  ${code`(option: OptionType) => boolean`}

  ### isOptionSelected

  Similar to isOptionDisabled, for a select instance with isMulti active, @atlaskit/select provides an isOptionSelected prop to validate whether or not an option is already a selected value, before it decide whether to select or deselect an option.

  By default @atlaskit/select performs a reference equality check between the candidate option and the value objects within our internally maintained dictionary of selected values.

  However if you pass in a function of the following shape:

  ${code`(option: {[string]: any}, options Array<{[string]: any}>) => boolean`}

  it will override the default logic specified.

  ### Action Meta

  The onChange and onInputChange props are now passed a second argument, which contains meta about why the event was called. For example:

  ${code`${onChange}`}

  additionally, the removedValue is conditionally added to the ActionMeta, if the action is of type 'remove-value' or 'pop-value'

  The new onInputChange prop also passes actionMeta:

  ${code`${onInputChange}`}

  <a name="custom-filter"></a>
  ## Custom Filter

  @atlaskit/select exposes a **filterOption** prop that allows you to configure how options in your select get filtered down by a search value.
  This takes the following shape:

  ${code`(option: OptionType, inputValue: string) => boolean`}

  Additionally, @atlaskit/select also exports a \`createFilter\` closure which takes in a configuration object of the following shape:

  ${code`${createFilterConfigShape}`}

  and returns a function of the shape expected by the filterOption prop. By default our filterOption prop value is the function returned from an invocation of the createFilter without a config object, the default config object used internally is as follows:

  ${code`${createFilterDefaultConfig}`}

  The goal here is to allow for varying levels of configuration of the core filtering logic used within a select instance. We recognise that you may not want to replace all of the filtering logic put have in place by default, and by invoking the createFilter export with your desired config, you should be able to pick and choose filtering decisions that best suit you, without having to rewrite the logic from scratch. If you _do_ want to do this however, supplying a filterOption function of the specified shape is always a viable option.

  For more comprehensive documentation and prop specification, please see the [react-select.v2 docs](https://react-select.com/home)
`;
