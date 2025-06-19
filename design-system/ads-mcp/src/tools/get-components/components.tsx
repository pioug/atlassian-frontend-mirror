import { type ReleasePhase } from '../../schema';

interface Prop {
	name: string;
	description: string;
	type: string;
	exampleValue?: string;
}

export interface Component {
	name: string;
	packageName: `@${'atlaskit' | 'atlassian'}/${string}`;
	description: string;
	releasePhase: ReleasePhase;
	category: string;
	example: string;
	accessibilityGuidelines?: string[];
	usageGuidelines?: string[];
	contentGuidelines?: string[];
	props: Prop[];
}

export const components: Component[] = [
	{
		name: 'Button',
		packageName: '@atlaskit/button/new',
		description: 'A versatile button component with multiple appearances and states.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Button from '@atlaskit/button/new';
import CopyIcon from '@atlaskit/icon/core/copy';
import AddIcon from '@atlaskit/icon/core/add';

<Button appearance="success" iconAfter={AddIcon}>Create</Button>
<Button appearance="primary" iconBefore={CopyIcon}>Copy text</Button>`,
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			'Avoid generic terms like "Submit" or "Click here"',
			'Use sentence case',
			'Use buttons for actions, links for navigation',
			'Only include one primary call to action (CTA) per area',
			"Start with the verb and specify what's being acted on",
			"Don't use punctuation in button labels",
		],
		props: [
			{
				name: 'appearance',
				description: 'Visual style of the button',
				type: "'default' | 'danger' | 'primary' | 'subtle' | 'warning' | 'discovery'",
			},
			{ name: 'spacing', description: 'Spacing around the button', type: "'compact' | 'default'" },
			{ name: 'isLoading', description: 'Loading state', type: 'boolean' },
			{ name: 'isDisabled', description: 'Disabled state', type: 'boolean' },
			{ name: 'isSelected', description: 'Selected state', type: 'boolean' },
			{
				name: 'iconBefore',
				description: 'Icon component to display before text',
				type: 'IconProp',
			},
			{ name: 'iconAfter', description: 'Icon component to display after text', type: 'IconProp' },
			{
				name: 'onClick',
				description: 'Click handler with analytics event data',
				type: '(e: MouseEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
		],
	},
	{
		name: 'IconButton',
		packageName: '@atlaskit/button/new',
		description: 'A button that displays only an icon with an optional tooltip.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import { IconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/core/edit';
import AddIcon from '@atlaskit/icon/core/add';

// Default icon button
<IconButton icon={EditIcon} label="Edit" />

// Primary appearance with tooltip
<IconButton
	appearance="primary"
	icon={AddIcon}
	label="Create page"
	isTooltipDisabled={false}
/>

// Circle shape with custom icon color
<IconButton
	shape="circle"
	icon={(iconProps) => (
		<StarIcon
			{...iconProps}
			primaryColor={token('color.icon.accent.orange')}
		/>
	)}
	label="Add to favorites"
/>`,
		props: [
			{
				name: 'icon',
				description: 'Icon component to display',
				type: 'IconProp | ((props: IconProps) => ReactNode)',
			},
			{
				name: 'label',
				description: 'Accessible label and tooltip content',
				type: 'string',
			},
			{
				name: 'appearance',
				description: 'Visual style of the button',
				type: "'default' | 'primary' | 'subtle'",
			},
			{
				name: 'shape',
				description: 'Shape of the button',
				type: "'default' | 'circle'",
			},
			{
				name: 'isTooltipDisabled',
				description: 'Whether to disable the tooltip',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Button spacing',
				type: "'default' | 'compact'",
			},
		],
	},
	{
		name: 'SplitButton',
		packageName: '@atlaskit/button/new',
		description: 'A button that splits into a primary action and a dropdown menu.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

// Default split button
<SplitButton>
	<Button>Link work item</Button>
	<DropdownMenu<HTMLButtonElement>
		shouldRenderToParent
		trigger={({ triggerRef, ...triggerProps }) => (
			<IconButton
				ref={triggerRef}
				{...triggerProps}
				icon={ChevronDownIcon}
				label="More link work item options"
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Option one</DropdownItem>
			<DropdownItem>Option two</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
</SplitButton>

// Primary appearance
<SplitButton appearance="primary">
	<Button>Update</Button>
	<DropdownMenu<HTMLButtonElement>
		shouldRenderToParent
		trigger={({ triggerRef, ...triggerProps }) => (
			<IconButton
				ref={triggerRef}
				{...triggerProps}
				icon={ChevronDownIcon}
				label="More update options"
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Option one</DropdownItem>
			<DropdownItem>Option two</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
</SplitButton>`,
		props: [
			{
				name: 'appearance',
				description: 'The style variation for child buttons',
				type: "'default' | 'primary'",
			},
			{
				name: 'spacing',
				description: 'Controls the amount of padding in the child buttons',
				type: "'default' | 'compact'",
			},
			{
				name: 'isDisabled',
				description: 'Whether all child buttons should be disabled',
				type: 'boolean',
			},
			{
				name: 'children',
				description: 'Primary action button and secondary action button/dropdown',
				type: 'ReactNode',
			},
		],
	},
	{
		name: 'LinkButton',
		packageName: '@atlaskit/button/new',
		description: 'A button that renders as an anchor tag for navigation.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import { LinkButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';

// Default link button
<LinkButton href="https://atlassian.com/">Default Link button</LinkButton>

// Primary appearance with icon
<LinkButton
	appearance="primary"
	href="https://atlassian.com/"
	iconBefore={AddIcon}
>
	Primary link button
</LinkButton>

// Subtle appearance with target blank
<LinkButton
	appearance="subtle"
	href="https://atlassian.com/"
	target="_blank"
>
	Opens in new window
</LinkButton>

// With router configuration
<LinkButton<MyRouterLinkConfig>
	href={{
		to: '/about',
		replace: true,
	}}
>
	Router link
</LinkButton>`,
		props: [
			{
				name: 'href',
				description: 'URL or router configuration object',
				type: 'string | RouterLinkConfig',
			},
			{
				name: 'appearance',
				description: 'Visual style of the button',
				type: "'default' | 'primary' | 'subtle' | 'warning' | 'danger'",
			},
			{
				name: 'target',
				description: 'Link target attribute',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description: 'Disabled state (removes href and adds aria-disabled)',
				type: 'boolean',
			},
			{
				name: 'iconBefore',
				description: 'Icon component to display before text',
				type: 'IconProp',
			},
			{
				name: 'iconAfter',
				description: 'Icon component to display after text',
				type: 'IconProp',
			},
		],
	},
	{
		name: 'ButtonGroup',
		packageName: '@atlaskit/button',
		description: 'A component for grouping related buttons together.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Button, { ButtonGroup } from '@atlaskit/button/new';
import AudioIcon from '@atlaskit/icon/core/audio';

// Default button group
<ButtonGroup>
	<Button>First button</Button>
	<Button>Second button</Button>
	<Button>Third button</Button>
</ButtonGroup>

// Button group with primary appearance
<ButtonGroup>
	<Button appearance="primary">Save</Button>
	<Button appearance="primary">Edit</Button>
	<Button appearance="primary">Delete</Button>
</ButtonGroup>

// Button group with mixed button types
<ButtonGroup>
	<Button>Default</Button>
	<Button appearance="primary">Primary</Button>
	<Button appearance="warning">Warning</Button>
	<Button appearance="danger">Error</Button>
</ButtonGroup>

// Button group with icons
<ButtonGroup>
	<Button>Good times</Button>
	<Button iconAfter={AudioIcon}>Boogie</Button>
	<Button iconAfter={AudioIcon}>Boogie more</Button>
</ButtonGroup>`,
		props: [
			{
				name: 'children',
				description: 'The buttons to be grouped together',
				type: 'ReactNode',
			},
			{
				name: 'label',
				description: 'Accessible label for the button group',
				type: 'string',
			},
			{
				name: 'appearance',
				description: 'The appearance to apply to all buttons in the group',
				type: "'default' | 'primary' | 'warning' | 'danger'",
			},
			{
				name: 'titleId',
				description: 'ID of the heading that labels this group',
				type: 'string',
			},
		],
	},
	{
		name: 'Checkbox',
		packageName: '@atlaskit/checkbox',
		description: 'A checkbox input component with label support.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import { Checkbox } from '@atlaskit/checkbox';

// Default checkbox
<Checkbox
	value="default"
	label="Default checkbox"
	onChange={event => console.log(event.target.checked)}
	name="checkbox-default"
/>

// Controlled checkbox
const [isChecked, setIsChecked] = useState(true);
<Checkbox
	isChecked={isChecked}
	onChange={event => setIsChecked(event.target.checked)}
	label={\`Controlled checkbox: \${isChecked}\`}
	value="controlled"
	name="checkbox-controlled"
/>

// Uncontrolled with default checked
<Checkbox
	defaultChecked
	label="Checked by default"
	value="default-checked"
	onChange={onChange}
	name="checkbox-default-checked"
/>

// Disabled state
<Checkbox
	isDisabled
	label="Disabled checkbox"
	value="disabled"
	name="checkbox-disabled"
/>

// Invalid state
<Checkbox
	isInvalid
	label="Invalid checkbox"
	value="invalid"
	name="checkbox-invalid"
/>

// Indeterminate state
<Checkbox
	isIndeterminate
	label="Indeterminate checkbox"
	value="indeterminate"
	name="checkbox-indeterminate"
/>`,
		props: [
			{
				name: 'label',
				description: 'Text label for the checkbox',
				type: 'string',
			},
			{
				name: 'value',
				description: 'Value of the checkbox when checked',
				type: 'string',
			},
			{
				name: 'name',
				description: 'Name attribute of the input element',
				type: 'string',
			},
			{
				name: 'isChecked',
				description: 'Controlled checked state',
				type: 'boolean',
			},
			{
				name: 'defaultChecked',
				description: 'Initial checked state for uncontrolled component',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description: 'Whether the checkbox is disabled',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Whether the checkbox shows an error state',
				type: 'boolean',
			},
			{
				name: 'isIndeterminate',
				description: 'Whether the checkbox is in an indeterminate state',
				type: 'boolean',
			},
			{
				name: 'onChange',
				description: 'Handler called when the checked state changes',
				type: '(event: ChangeEvent<HTMLInputElement>) => void',
			},
		],
	},
	{
		name: 'Radio',
		packageName: '@atlaskit/radio',
		description: 'A radio input component for selecting a single option from a list.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import { Radio, RadioGroup } from '@atlaskit/radio';

// Single radio button
<Radio
	value="default"
	label="Default radio"
	name="radio-default"
	isChecked={true}
	onChange={event => console.log(event.target.checked)}
/>

// Radio group with options
const options = [
	{ name: 'color', value: 'red', label: 'Red' },
	{ name: 'color', value: 'blue', label: 'Blue' },
	{ name: 'color', value: 'yellow', label: 'Yellow' },
	{ name: 'color', value: 'green', label: 'Green' },
	{ name: 'color', value: 'black', label: 'Black' },
];

<RadioGroup
	options={options}
	defaultValue="blue"
	onChange={event => console.log(event.currentTarget.value)}
/>

// Controlled radio group
const [value, setValue] = useState('red');
<RadioGroup
	options={options}
	value={value}
	onChange={event => setValue(event.currentTarget.value)}
/>

// Disabled radio
<Radio
	value="disabled"
	label="Disabled radio"
	name="radio-disabled"
	isDisabled={true}
	onChange={onChange}
/>

// Invalid radio
<Radio
	value="invalid"
	label="Invalid radio"
	name="radio-invalid"
	isInvalid={true}
	onChange={onChange}
/>`,
		props: [
			{
				name: 'value',
				description: 'Value of the radio input',
				type: 'string',
			},
			{
				name: 'label',
				description: 'Label text for the radio input',
				type: 'string',
			},
			{
				name: 'name',
				description: 'Name attribute of the input element',
				type: 'string',
			},
			{
				name: 'isChecked',
				description: 'Whether the radio is checked',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description: 'Whether the radio is disabled',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Whether the radio shows an error state',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Whether the radio is required in a form',
				type: 'boolean',
			},
			{
				name: 'onChange',
				description: 'Handler called when the radio selection changes',
				type: '(event: ChangeEvent<HTMLInputElement>) => void',
			},
		],
	},
	{
		name: 'Select',
		packageName: '@atlaskit/select',
		description: 'A flexible select component for single and multi-selection.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Select, { CheckboxSelect, CountrySelect } from '@atlaskit/select';

// Single select
<Select
	inputId="single-select"
	options={[
		{ label: 'Adelaide', value: 'adelaide' },
		{ label: 'Brisbane', value: 'brisbane' },
		{ label: 'Canberra', value: 'canberra' },
		{ label: 'Darwin', value: 'darwin' },
		{ label: 'Melbourne', value: 'melbourne' },
	]}
	placeholder="Choose a city"
/>

// Multi select
<Select
	inputId="multi-select"
	options={[
		{ label: 'Red', value: 'red' },
		{ label: 'Blue', value: 'blue' },
		{ label: 'Yellow', value: 'yellow' },
		{ label: 'Green', value: 'green' },
	]}
	isMulti
	placeholder="Choose colors"
/>

// Grouped options
<Select
	inputId="grouped-select"
	options={[
		{
			label: 'New South Wales',
			options: [
				{ label: 'Sydney', value: 's' },
				{ label: 'Newcastle', value: 'n' },
			],
		},
		{
			label: 'Queensland',
			options: [
				{ label: 'Brisbane', value: 'b' },
				{ label: 'Gold Coast', value: 'g' },
			],
		},
	]}
	placeholder="Choose a city"
/>

// Checkbox select
<CheckboxSelect
	inputId="checkbox-select"
	options={[
		{ label: 'Option 1', value: '1' },
		{ label: 'Option 2', value: '2' },
		{ label: 'Option 3', value: '3' },
	]}
	placeholder="Select options"
/>

// Country select
<CountrySelect
	inputId="country-select"
	placeholder="Choose a country"
/>`,
		props: [
			{
				name: 'options',
				description: 'Array of options to display in the dropdown',
				type: 'Array<{ label: string; value: string; isDisabled?: boolean }> | Array<{ label: string; options: Array<{ label: string; value: string }> }>',
			},
			{
				name: 'value',
				description: 'The selected value(s)',
				type: 'Option | Option[] | null',
			},
			{
				name: 'defaultValue',
				description: 'The default selected value(s)',
				type: 'Option | Option[] | null',
			},
			{
				name: 'isMulti',
				description: 'Allow multiple selections',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description: 'Disable the select',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description: 'Show loading state',
				type: 'boolean',
			},
			{
				name: 'isClearable',
				description: 'Allow clearing of selected value',
				type: 'boolean',
			},
			{
				name: 'isSearchable',
				description: 'Allow filtering of options',
				type: 'boolean',
			},
			{
				name: 'placeholder',
				description: 'Placeholder text',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Handler for value changes',
				type: '(value: Option | Option[] | null) => void',
			},
			{
				name: 'appearance',
				description: 'Visual style of the select',
				type: "'default' | 'subtle' | 'none'",
			},
			{
				name: 'formatOptionLabel',
				description: 'Custom option label renderer',
				type: '(data: Option, formatOptionLabelMeta: FormatOptionLabelMeta) => ReactNode',
				exampleValue:
					'(option, meta) => <span style={{ color: option.color }}>{option.label} ({meta.context})</span>',
			},
			{
				name: 'noOptionsMessage',
				description: 'Custom no options message',
				type: '(obj: { inputValue: string }) => ReactNode',
				exampleValue: '({ inputValue }) => <em>No results found for "{inputValue}"</em>',
			},
		],
	},
	{
		name: 'DateTimePicker',
		packageName: '@atlaskit/datetime-picker',
		description: 'A component for selecting both date and time values.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

// Basic usage
<>
	<Label htmlFor="datetime">Appointment date and time</Label>
	<DateTimePicker
		id="datetime"
		clearControlLabel="Clear appointment"
		datePickerProps={{
			shouldShowCalendarButton: true,
			label: 'Appointment date'
		}}
		timePickerProps={{ label: 'Appointment time' }}
	/>
</>

// With form validation
<Form onSubmit={formState => console.log('form submitted', formState)}>
	{({ formProps }) => (
		<form {...formProps}>
			<Field name="datetime-picker" label="Scheduled run time" isRequired>
				{({ fieldProps }) => (
					<DateTimePicker
						{...fieldProps}
						clearControlLabel="Clear scheduled run time"
						datePickerProps={{
							shouldShowCalendarButton: true,
							label: 'Scheduled run time, date'
						}}
						timePickerProps={{ label: 'Scheduled run time, time' }}
					/>
				)}
			</Field>
		</form>
	)}
</Form>

// With custom formatting
<DateTimePicker
	datePickerProps={{
		dateFormat: 'YYYY-MM-DD',
		placeholder: '2021-06-10',
		shouldShowCalendarButton: true,
		label: 'Date'
	}}
	timePickerProps={{
		timeFormat: 'HH:mm',
		placeholder: '13:30',
		label: 'Time'
	}}
	clearControlLabel="Clear date and time"
/>`,
		props: [
			{
				name: 'datePickerProps',
				description: 'Props to be passed to the DatePicker component',
				type: 'DatePickerProps',
			},
			{
				name: 'timePickerProps',
				description: 'Props to be passed to the TimePicker component',
				type: 'TimePickerProps',
			},
			{
				name: 'value',
				description: 'The current value in ISO format',
				type: 'string',
			},
			{
				name: 'defaultValue',
				description: 'The default value in ISO format',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Callback when the value changes',
				type: '(value: string | null) => void',
			},
			{
				name: 'isDisabled',
				description: 'Whether the input is disabled',
				type: 'boolean',
			},
			{
				name: 'locale',
				description: 'The locale to use for formatting',
				type: 'string',
			},
			{
				name: 'clearControlLabel',
				description: 'Aria label for the clear button',
				type: 'string',
			},
		],
	},
	{
		name: 'FocusRing',
		packageName: '@atlaskit/focus-ring',
		description: 'A utility component for managing focus styles.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import FocusRing from '@atlaskit/focus-ring';

<FocusRing>
  <button>Focusable element</button>
</FocusRing>`,
		props: [],
	},
	{
		name: 'Form',
		packageName: '@atlaskit/form',
		description: 'A component for building forms with validation and state management.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Form, { Field, FormFooter, FormHeader, FormSection, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import { Checkbox } from '@atlaskit/checkbox';

// Basic form with validation
<Form onSubmit={data => console.log('form data', data)}>
	{({ formProps }) => (
		<form {...formProps}>
			<FormHeader title="Sign in">
				<p>Required fields are marked with an asterisk *</p>
			</FormHeader>

			<FormSection>
				<Field name="username" label="Username" isRequired>
					{({ fieldProps, error }) => (
						<>
							<TextField autoComplete="username" {...fieldProps} />
							{!error && <HelperMessage>You can use letters, numbers & periods.</HelperMessage>}
							{error && <ErrorMessage>This username is already in use.</ErrorMessage>}
						</>
					)}
				</Field>

				<Field
					name="password"
					label="Password"
					isRequired
					validate={value => (value && value.length < 8 ? 'TOO_SHORT' : undefined)}
				>
					{({ fieldProps, error, valid }) => (
						<>
							<TextField type="password" {...fieldProps} />
							{!error && !valid && (
								<HelperMessage>
									Use 8 or more characters with letters, numbers & symbols.
								</HelperMessage>
							)}
							{error && <ErrorMessage>Password must be at least 8 characters.</ErrorMessage>}
						</>
					)}
				</Field>

				<Field name="remember" defaultValue={false}>
					{({ fieldProps }) => (
						<Checkbox {...fieldProps} label="Remember me" />
					)}
				</Field>
			</FormSection>

			<FormFooter>
				<Button type="submit" appearance="primary">Sign in</Button>
			</FormFooter>
		</form>
	)}
</Form>`,
		contentGuidelines: [
			'Use clear, concise labels',
			'Write helpful placeholder text',
			'Provide specific error messages',
			'Use consistent terminology',
			'Use single column layout for better comprehension',
			'Mark required fields with an asterisk (*)',
			'Always include a visible label (exception: search fields)',
			'Match field length to intended content length',
		],
		props: [
			{
				name: 'onSubmit',
				description: 'Callback when the form is submitted with valid data',
				type: '(data: FormData) => void | Promise<void | { [key: string]: string }>',
			},
			{
				name: 'children',
				description: 'Render prop that provides form state and helpers',
				type: '(renderProps: FormRenderProps) => ReactNode',
			},
			{
				name: 'defaultValues',
				description: 'Initial values for form fields',
				type: 'FormData',
			},
			{
				name: 'onValidate',
				description: 'Custom validation function for the entire form',
				type: '(data: FormData) => void | { [key: string]: string }',
			},
			{
				name: 'shouldValidateOnBlur',
				description: 'Whether to validate fields when they lose focus',
				type: 'boolean',
			},
			{
				name: 'shouldValidateOnChange',
				description: 'Whether to validate fields as they change',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Range',
		packageName: '@atlaskit/range',
		description: 'A component for selecting a value from a range of values.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Range from '@atlaskit/range';

<Range
	value={50}
	min={0}
	max={100}
	step={1}
	onChange={value => console.log(value)}
/>`,
		props: [],
	},
	{
		name: 'TextArea',
		packageName: '@atlaskit/textarea',
		description: 'A component for entering multi-line text input.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import TextArea from '@atlaskit/textarea';

<TextArea
	placeholder="Enter text here"
	resize="auto"
	maxHeight="20vh"
	name="area"
	defaultValue="Add a message here"
/>`,
		props: [],
	},
	{
		name: 'TextField',
		packageName: '@atlaskit/textfield',
		description: 'A single-line text input component.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import TextField from '@atlaskit/textfield';

<TextField
  value="Text content"
  onChange={(e) => console.log(e.target.value)}
/>`,
		props: [
			{
				name: 'value',
				description: 'Text content',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Change handler',
				type: '(e: ChangeEvent) => void',
			},
			{
				name: 'isDisabled',
				description: 'Disabled state',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Required field',
				type: 'boolean',
			},
			{
				name: 'type',
				description: 'Input type',
				type: 'string',
			},
		],
	},
	{
		name: 'Toggle',
		packageName: '@atlaskit/toggle',
		description: 'A toggle switch component.',
		releasePhase: 'general_availability',
		category: 'Forms and Input',
		example: `import Toggle from '@atlaskit/toggle';

<Toggle
  id="toggle-1"
  label="Toggle switch"
  onChange={(event) => console.log(event.target.checked)}
  isChecked={false}
/>`,
		props: [
			{
				name: 'id',
				description: 'Unique identifier for the toggle',
				type: 'string',
			},
			{
				name: 'label',
				description: 'Label for the toggle',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Change handler',
				type: '(event: ChangeEvent) => void',
			},
			{
				name: 'isChecked',
				description: 'Checked state',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Avatar',
		packageName: '@atlaskit/avatar',
		description:
			'A component for displaying user avatars with support for images, initials, and status indicators.',
		releasePhase: 'general_availability',
		category: 'Images and Icons',
		example: `import Avatar from '@atlaskit/avatar';

<Avatar
	src="https://example.com/avatar.jpg"
	status="online"
	size="large"
/>`,
		props: [
			{ name: 'appearance', description: 'Shape of the avatar', type: "'circle' | 'square'" },
			{
				name: 'size',
				description: 'Size of the avatar',
				type: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'",
			},
			{
				name: 'presence',
				description: 'Presence indicator',
				type: "'online' | 'busy' | 'focus' | 'offline' | ReactNode",
			},
			{
				name: 'status',
				description: 'Status indicator',
				type: "'approved' | 'declined' | 'locked' | ReactNode",
			},
		],
	},
	{
		name: 'AvatarGroup',
		packageName: '@atlaskit/avatar-group',
		description:
			'A component for displaying multiple avatars in a group with overlap and overflow handling.',
		releasePhase: 'general_availability',
		category: 'Images and Icons',
		example: `import AvatarGroup from '@atlaskit/avatar-group';

<AvatarGroup
	avatars={[
		{ src: 'avatar1.jpg', name: 'User 1' },
		{ src: 'avatar2.jpg', name: 'User 2' },
		{ src: 'avatar3.jpg', name: 'User 3' }
	]}
	maxCount={3}
/>`,
		props: [
			{
				name: 'avatars',
				description: 'Array of avatar objects',
				type: 'Array<{ src: string, name: string }>',
			},
			{
				name: 'maxCount',
				description: 'Maximum number of avatars to show',
				type: 'number',
			},
			{
				name: 'size',
				description: 'Size of avatars',
				type: "'small' | 'medium' | 'large' | 'xlarge'",
			},
			{
				name: 'showMoreButtonProps',
				description: 'Props for overflow button',
				type: 'object',
			},
		],
	},
	{
		name: 'Icon',
		packageName: '@atlaskit/icon',
		description:
			"These the new icons are part of Atlassian's visual refresh. Please use the Icon explorer to see the list of hundreds of icons and their purposes in full detail.",
		releasePhase: 'beta',
		category: 'Images and Icons',
		example: `import AddIcon from '@atlaskit/icon/core/add';
import CopyIcon from '@atlaskit/icon/core/copy';
import EditIcon from '@atlaskit/icon/core/edit';
import TrashIcon from '@atlaskit/icon/core/trash';
import StarIcon from '@atlaskit/icon/core/star';
import CommentIcon from '@atlaskit/icon/core/comment';

// Basic usage
<AddIcon label="Add" />
<CopyIcon label="Copy" />
<EditIcon label="Edit" />

// With different sizes
<TrashIcon label="Delete" size="small" />
<StarIcon label="Star" size="medium" />
<CommentIcon label="Comment" size="large" />`,
		props: [
			{
				name: 'label',
				description: 'Accessibility label for the icon',
				type: 'string',
			},
			{
				name: 'size',
				description: 'Size of the icon',
				type: "'small' | 'medium' | 'large'",
			},
			{
				name: 'primaryColor',
				description: 'Primary color of the icon',
				type: 'string',
			},
			{
				name: 'secondaryColor',
				description: 'Secondary color of the icon',
				type: 'string',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
		],
	},
	{
		name: 'Image',
		packageName: '@atlaskit/image',
		description:
			"A component for displaying images with theme support. This component is in Beta phase, meaning it's stable at version 1.0+ but may receive improvements based on customer feedback. Breaking changes will only be made in major releases.",
		releasePhase: 'beta',
		category: 'Images and Icons',
		example: `import Image from '@atlaskit/image';

<Image
  src="image-url"
  alt="Image description"
  width={200}
  height={200}
  testId="image-test"
/>`,
		props: [
			{
				name: 'src',
				description: 'URL of the image',
				type: 'string',
			},
			{
				name: 'alt',
				description: 'Alternative text for the image',
				type: 'string',
			},
			{
				name: 'width',
				description: 'Width of the image in pixels',
				type: 'number',
			},
			{
				name: 'height',
				description: 'Height of the image in pixels',
				type: 'number',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
		],
	},
	{
		name: 'PageHeader',
		packageName: '@atlaskit/page-header',
		description: 'A component for page headers.',
		releasePhase: 'general_availability',
		category: 'Layout and Structure',
		example: `import PageHeader from '@atlaskit/page-header';

<PageHeader
	breadcrumbs={<Breadcrumbs />}
	actions={<Actions />}
	bottomBar={<BottomBar />}
	testId="page-header-test"
>
	Page Title
</PageHeader>`,
		props: [
			{
				name: 'breadcrumbs',
				description: 'Breadcrumb navigation',
				type: 'ReactNode',
			},
			{
				name: 'actions',
				description: 'Actions to display in the header',
				type: 'ReactNode',
			},
			{
				name: 'bottomBar',
				description: 'Content to display in the bottom bar',
				type: 'ReactNode',
			},
			{
				name: 'children',
				description: 'The title of the page',
				type: 'ReactNode',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code',
				type: 'string',
			},
		],
	},
	{
		name: 'ProgressBar',
		packageName: '@atlaskit/progress-bar',
		description: 'A component for displaying progress.',
		releasePhase: 'general_availability',
		category: 'Loading',
		example: `import ProgressBar from '@atlaskit/progress-bar';

<ProgressBar
	value={0.5}
	isIndeterminate={false}
	appearance="default"
	ariaLabel="Loading progress"
	testId="progress-bar-test"
/>`,
		props: [
			{
				name: 'value',
				description: 'Sets the value of the progress bar, between 0 and 1 inclusive',
				type: 'number',
			},
			{
				name: 'isIndeterminate',
				description: 'Shows the progress bar in an indeterminate state when true',
				type: 'boolean',
			},
			{
				name: 'appearance',
				description: 'The visual style of the progress bar',
				type: "'default' | 'success' | 'inverse'",
			},
			{
				name: 'ariaLabel',
				description: 'Descriptive label associated with the progress bar for accessibility',
				type: 'string',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code',
				type: 'string',
			},
		],
	},
	{
		name: 'Spinner',
		packageName: '@atlaskit/spinner',
		description: 'A loading spinner component.',
		releasePhase: 'general_availability',
		category: 'Loading',
		example: `import Spinner from '@atlaskit/spinner';

<Spinner size="large" />`,
		props: [
			{
				name: 'size',
				description: 'Size of the spinner',
				type: "'small' | 'medium' | 'large'",
			},
			{
				name: 'appearance',
				description: 'Visual style of the spinner',
				type: "'inherit' | 'invert'",
			},
			{
				name: 'delay',
				description: 'Delay in milliseconds before showing the spinner',
				type: 'number',
			},
		],
	},
	{
		name: 'Skeleton',
		packageName: '@atlaskit/skeleton',
		description: 'A loading placeholder component.',
		releasePhase: 'general_availability',
		category: 'Loading',
		example: `import Skeleton from '@atlaskit/skeleton';

<Skeleton height="20px" width="200px" />`,
		props: [
			{
				name: 'height',
				description: 'Height of the skeleton',
				type: 'string | number',
			},
			{
				name: 'width',
				description: 'Width of the skeleton',
				type: 'string | number',
			},
			{
				name: 'isShimmering',
				description: 'Enables the shimmer animation effect',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Banner',
		packageName: '@atlaskit/banner',
		description: 'A component for displaying important messages or announcements.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import Banner from '@atlaskit/banner';

<Banner
	appearance="announcement"
	isOpen={true}
	icon={<Icon />}
>
	Important announcement
</Banner>`,
		contentGuidelines: [
			'Reserved for critical system-level messaging',
			'Use for warnings about data/functionality loss',
		],
		usageGuidelines: ['This should appear at the top of the screen'],
		props: [
			{
				name: 'appearance',
				description: 'Visual style of the banner',
				type: "'announcement' | 'error' | 'warning'",
			},
			{
				name: 'isOpen',
				description: 'Control visibility',
				type: 'boolean',
			},
			{
				name: 'icon',
				description: 'Optional icon',
				type: 'ReactNode',
			},
			{
				name: 'children',
				description: 'Banner content',
				type: 'ReactNode',
			},
		],
	},
	{
		name: 'Flag',
		packageName: '@atlaskit/flag',
		description: 'A component for displaying brief messages.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import Flag, { FlagGroup } from '@atlaskit/flag';

<FlagGroup>
	<Flag
		id="flag-1"
		icon={<Icon label="Info" />}
		title="Flag Title"
		description="Flag description"
		actions={[
			{
				content: 'Action',
				onClick: () => {},
				testId: 'action-test'
			}
		]}
		appearance="normal"
		testId="flag-test"
	/>
</FlagGroup>`,
		contentGuidelines: [
			'Use for confirmations and alerts needing minimal interaction',
			'Display event-driven messages',
			'Be clear about what went wrong for errors',
			'Provide specific steps to resolve issues',
			'Use a helpful, non-threatening tone',
			'Clearly state potential consequences for warnings',
			'Confirm outcome then get out of the way for success messages',
		],
		usageGuidelines: [
			'This should appear at the bottom left of the screen, emerging from the navigation sidebar',
		],
		props: [
			{
				name: 'id',
				description: 'A unique identifier used for rendering and onDismissed callbacks',
				type: 'number | string',
			},
			{
				name: 'icon',
				description:
					'The icon displayed in the top-left of the flag. Should be an instance of @atlaskit/icon',
				type: 'ReactNode',
			},
			{
				name: 'title',
				description: 'The bold text shown at the top of the flag',
				type: 'ReactNode',
			},
			{
				name: 'description',
				description: 'The secondary content shown below the flag title',
				type: 'ReactNode',
			},
			{
				name: 'actions',
				description: 'Array of clickable actions to be shown at the bottom of the flag',
				type: 'Array<{ content: ReactNode, onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void, href?: string, target?: string, testId?: string }>',
			},
			{
				name: 'appearance',
				description:
					"Makes the flag appearance bold. Setting this to anything other than 'normal' hides the dismiss button",
				type: "'error' | 'info' | 'normal' | 'success' | 'warning'",
			},
		],
	},
	{
		name: 'InlineMessage',
		packageName: '@atlaskit/inline-message',
		description: 'A component for displaying inline messages.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import InlineMessage from '@atlaskit/inline-message';

<InlineMessage
  title="Inline Message Title"
  secondaryText="Secondary text"
  appearance="info"
  testId="inline-message-test"
>
  <p>Content that appears in the dialog when opened</p>
</InlineMessage>`,
		contentGuidelines: [
			'Alerts for required actions or important information',
			'Includes icon, message, and optional secondary text',
			'Interactive elements reveal full message',
		],
		props: [
			{
				name: 'title',
				description: 'Text to display first, bolded for emphasis',
				type: 'ReactNode',
			},
			{
				name: 'secondaryText',
				description: 'Text to display second',
				type: 'ReactNode',
			},
			{
				name: 'appearance',
				description: 'Set the icon to be used before the title',
				type: "'connectivity' | 'confirmation' | 'info' | 'warning' | 'error'",
			},
			{
				name: 'placement',
				description: 'The placement to be passed to the inline dialog',
				type: "'bottom-start' | 'bottom-center' | 'bottom-end' | 'top-start' | 'top-center' | 'top-end' | 'right-start' | 'right-center' | 'right-end' | 'left-start' | 'left-center' | 'left-end'",
			},
		],
	},
	{
		name: 'Onboarding',
		packageName: '@atlaskit/onboarding',
		description: 'A component for feature onboarding.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import { Spotlight } from '@atlaskit/onboarding';

<Spotlight
  target="target-element"
  content="Feature description"
/>`,
		contentGuidelines: [
			'Introduces features through focused messages or tours',
			'Flexible layout options',
			'Used for feature discovery and guidance',
			'Keep messages to two lines in length',
			'Focus on single changes and their benefits',
			'Avoid just naming functions',
			'Write in sentence case',
			'Include clear call-to-action',
			'Communicate main benefit to user in headings',
			'Keep headings to a few words',
			'Personalize where possible',
			'Include benefits and importance to the user',
			'Put important keywords at start of sentence',
			'Only reference UI elements visible on screen',
			'Use "Next" for step progression',
			'Use "OK" for final step or closing action',
			'Always offer way to opt out',
			'Show one spotlight at a time',
			'Keep tours to 3-4 steps maximum',
			'Sequence tasks logically',
			'Drive content by user benefits and value',
			'Be thoughtful of user context and state',
			'Focus on key benefits and quick wins for new users',
			'Highlight value before mechanics for feature introduction',
		],
		props: [
			{
				name: 'target',
				description: 'Target element ID',
				type: 'string',
			},
			{
				name: 'content',
				description: 'Onboarding content',
				type: 'string',
			},
			{
				name: 'actions',
				description: 'Action buttons',
				type: 'ReactNode[]',
			},
		],
	},
	{
		name: 'SectionMessage',
		packageName: '@atlaskit/section-message',
		description: 'A component for section-level messages.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import SectionMessage from '@atlaskit/section-message';

<SectionMessage
  appearance="information"
  title="Section Message Title"
  testId="section-message-test"
>
  <p>Section message content</p>
  <SectionMessage.Actions>
    <SectionMessage.Action href="#">Action</SectionMessage.Action>
  </SectionMessage.Actions>
</SectionMessage>`,
		contentGuidelines: [
			'Alerts about section-specific events',
			'Appears above affected area',
			'Used for contextual information',
		],
		props: [
			{
				name: 'appearance',
				description: 'The appearance styling to use for the section message',
				type: "'information' | 'warning' | 'error' | 'success' | 'discovery'",
			},
			{
				name: 'children',
				description: 'The main content of the section message',
				type: 'ReactNode',
			},
			{
				name: 'title',
				description: 'The heading of the section message',
				type: 'string',
			},
			{
				name: 'actions',
				description: 'Actions for the user to take after reading the section message',
				type: 'ReactElement | ReactElement<SectionMessageActionProps>[]',
			},
			{
				name: 'icon',
				description: 'An Icon component to be rendered instead of the default icon',
				type: 'React.ElementType',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code',
				type: 'string',
			},
		],
	},
	{
		name: 'Breadcrumbs',
		packageName: '@atlaskit/breadcrumbs',
		description: 'A navigation component showing the current page hierarchy.',
		releasePhase: 'general_availability',
		category: 'Navigation',
		example: `import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

<Breadcrumbs>
  <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
  <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
  <BreadcrumbsItem>Current Page</BreadcrumbsItem>
</Breadcrumbs>`,
		props: [
			{
				name: 'children',
				description: 'Breadcrumb items',
				type: 'ReactNode',
			},
			{
				name: 'maxItems',
				description: 'Maximum number of items to show before truncating',
				type: 'number',
			},
			{
				name: 'separator',
				description: 'Custom separator between breadcrumb items',
				type: 'ReactNode',
			},
		],
	},
	{
		name: 'Link',
		packageName: '@atlaskit/link',
		description: 'A component for navigation links.',
		releasePhase: 'general_availability',
		category: 'Navigation',
		example: `import Link from '@atlaskit/link';

<Link href="/path">Link text</Link>`,
		props: [
			{
				name: 'href',
				description: 'Link destination',
				type: 'string',
			},
			{
				name: 'children',
				description: 'Link content',
				type: 'ReactNode',
			},
			{
				name: 'isDisabled',
				description: 'Disabled state',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Menu',
		packageName: '@atlaskit/menu',
		description: 'A component for displaying menus.',
		releasePhase: 'general_availability',
		category: 'Navigation',
		example: `import { MenuGroup, Section, ButtonItem, LinkItem, CustomItem } from '@atlaskit/menu';

<MenuGroup spacing="cozy" testId="menu-test">
  <Section title="Section Title">
    <ButtonItem>Button Item</ButtonItem>
    <LinkItem href="/path">Link Item</LinkItem>
    <CustomItem component={CustomComponent}>Custom Item</CustomItem>
  </Section>
</MenuGroup>`,
		props: [
			{
				name: 'children',
				description: 'Children of the menu group, generally Section components',
				type: 'ReactNode',
			},
			{
				name: 'isLoading',
				description: 'Used to tell assistive technologies that the menu group is loading',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Configure the density of the menu group content',
				type: "'compact' | 'cozy'",
			},
			{
				name: 'role',
				description: 'Override the accessibility role for the element',
				type: 'string',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code',
				type: 'string',
			},
		],
	},
	{
		name: 'Pagination',
		packageName: '@atlaskit/pagination',
		description: 'A component for pagination controls.',
		releasePhase: 'general_availability',
		category: 'Navigation',
		example: `import Pagination from '@atlaskit/pagination';

<Pagination
  pages={[1, 2, 3, 4, 5]}
  defaultSelectedIndex={0}
  label="pagination"
  pageLabel="page"
  previousLabel="previous"
  nextLabel="next"
  max={7}
  onChange={(event, page) => console.log(page)}
  testId="pagination-test"
/>`,
		props: [
			{
				name: 'pages',
				description: 'Array of the pages to display',
				type: 'T[]',
			},
			{
				name: 'defaultSelectedIndex',
				description: 'Index of the page to be selected by default',
				type: 'number',
			},
			{
				name: 'label',
				description: 'The aria-label for the pagination nav wrapper',
				type: 'string',
			},
			{
				name: 'pageLabel',
				description: 'The aria-label for the individual page numbers',
				type: 'string',
			},
			{
				name: 'max',
				description: 'Maximum number of pages to be displayed in the pagination',
				type: 'number',
			},
			{
				name: 'onChange',
				description: 'The onChange handler which is called when the page is changed',
				type: '(event: SyntheticEvent, page: T, analyticsEvent?: UIAnalyticsEvent) => void',
			},
		],
	},
	{
		name: 'Tabs',
		packageName: '@atlaskit/tabs',
		description: 'A component for tabbed navigation.',
		releasePhase: 'general_availability',
		category: 'Navigation',
		example: `import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>`,
		props: [
			{
				name: 'children',
				description: 'Tab content',
				type: 'ReactNode',
			},
			{
				name: 'selected',
				description: 'Selected tab index',
				type: 'number',
			},
			{
				name: 'onChange',
				description: 'Tab change handler',
				type: '(index: number) => void',
			},
		],
	},
	{
		name: 'NavigationSystem',
		packageName: '@atlassian/navigation-system',
		description:
			'A modern navigation system for Atlassian products that provides a flexible and accessible layout structure.',
		releasePhase: 'early_access',
		category: 'Navigation',
		example: `import React, { useState } from 'react';
import AKBanner from '@atlaskit/banner';
import { Banner } from '@atlassian/navigation-system/layout/banner';
import { Main } from '@atlassian/navigation-system/layout/main';
import { PanelSplitter } from '@atlassian/navigation-system/layout/panel-splitter';
import { Root } from '@atlassian/navigation-system/layout/root';
import { SideNav, SideNavContent, SideNavFooter, SideNavToggleButton } from '@atlassian/navigation-system/layout/side-nav';
import { TopNav, TopNavEnd, TopNavMiddle, TopNavStart } from '@atlassian/navigation-system/layout/top-nav';
import { Help, NavLogo } from '@atlassian/navigation-system/top-nav-items';

<Root>
  <TopNav>
    <TopNavStart>
      <SideNavToggleButton
        collapseLabel="Collapse sidebar"
        expandLabel="Expand sidebar"
      />
      <NavLogo
        href="#"
        logo={AtlassianLogo}
        icon={AtlassianIcon}
        label="Home page"
      />
    </TopNavStart>
    <TopNavMiddle />
    <TopNavEnd />
  </TopNav>
  <SideNav>
    <SideNavContent />
    <SideNavFooter />
  </SideNav>
  <Main id="main-container" isFixed />
</Root>`,
		props: [],
	},
	{
		name: 'Blanket',
		packageName: '@atlaskit/blanket',
		description: 'A component for overlays.',
		releasePhase: 'general_availability',
		category: 'Overlays and Layering',
		example: `import Blanket from '@atlaskit/blanket';

<Blanket isTinted />`,
		props: [
			{
				name: 'isTinted',
				description: 'Tinted overlay',
				type: 'boolean',
			},
			{
				name: 'onBlanketClicked',
				description: 'Click handler',
				type: '() => void',
			},
		],
	},
	{
		name: 'Drawer',
		packageName: '@atlaskit/drawer',
		description: 'A sliding panel component.',
		releasePhase: 'general_availability',
		category: 'Overlays and Layering',
		example: `import Drawer from '@atlaskit/drawer';

<Drawer
  isOpen={true}
  onClose={() => {}}
  width="wide"
>
  Drawer content
</Drawer>`,
		props: [
			{
				name: 'isOpen',
				description: 'Controls the visibility of the drawer',
				type: 'boolean',
			},
			{
				name: 'width',
				description: 'Width of the drawer',
				type: "'narrow' | 'medium' | 'wide'",
			},
			{
				name: 'onClose',
				description: 'Handler called when drawer is closed',
				type: '() => void',
			},
			{
				name: 'children',
				description: 'Content to display in the drawer',
				type: 'ReactNode',
			},
		],
	},
	{
		name: 'Popup',
		packageName: '@atlaskit/popup',
		description: 'A component for displaying popup content.',
		releasePhase: 'general_availability',
		category: 'Overlays and Layering',
		example: `import Popup from '@atlaskit/popup';

<Popup
  content="Popup content"
  isOpen={true}
>
  <button>Trigger</button>
</Popup>`,
		props: [
			{
				name: 'content',
				description: 'Popup content',
				type: 'ReactNode',
			},
			{
				name: 'isOpen',
				description: 'Open state',
				type: 'boolean',
			},
			{
				name: 'onClose',
				description: 'Close handler',
				type: '() => void',
			},
			{
				name: 'placement',
				description: 'Popup placement',
				type: 'string',
			},
		],
	},
	{
		name: 'Tooltip',
		packageName: '@atlaskit/tooltip',
		description: 'A component for displaying tooltips.',
		releasePhase: 'general_availability',
		category: 'Overlays and Layering',
		example: `import Tooltip from '@atlaskit/tooltip';

<Tooltip content="Tooltip content">
  <button>Hover me</button>
</Tooltip>`,
		contentGuidelines: [
			'Keep it brief (ideally 1-3 words, max 8 words)',
			'Use sentence case',
			'No punctuation at the end',
			'Use clear, direct language',
			'Avoid technical jargon',
			'Never include links or interactive elements',
			"Don't truncate tooltip text",
		],
		props: [
			{
				name: 'content',
				description: 'Tooltip content',
				type: 'ReactNode',
			},
			{
				name: 'children',
				description: 'Trigger element',
				type: 'ReactNode',
			},
			{
				name: 'position',
				description: 'Tooltip position',
				type: 'string',
			},
		],
	},
	{
		name: 'Badge',
		packageName: '@atlaskit/badge',
		description: 'A component for displaying status indicators or counts.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import Badge from '@atlaskit/badge';

// Status badge
<Badge appearance="added">New</Badge>

// Count badge
<Badge max={99} value={100}>100</Badge>`,
		props: [
			{
				name: 'appearance',
				description: 'Visual style of the badge',
				type: "'added' | 'default' | 'important' | 'primary' | 'removed'",
			},
			{
				name: 'value',
				description: 'Number to display',
				type: 'number',
			},
			{
				name: 'max',
				description: "Maximum value before showing '+'",
				type: 'number',
			},
			{
				name: 'children',
				description: 'Custom content',
				type: 'ReactNode',
			},
		],
	},
	{
		name: 'EmptyState',
		packageName: '@atlaskit/empty-state',
		description: 'A component for empty states.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import EmptyState from '@atlaskit/empty-state';

<EmptyState
  header="No items"
  description="Add items to get started"
/>`,
		contentGuidelines: [
			'Use when nothing to display in a view',
			'Appropriate for: no tasks, cleared inbox, no search results',
			'Explain why the state is empty',
			'Provide clear next steps',
			'Keep tone helpful and encouraging',
			'Consider all scenarios causing the empty state',
			'Use inspirational, motivating tone for first-time view',
		],
		usageGuidelines: ['Can appear full-screen or within containers'],
		props: [
			{
				name: 'header',
				description: 'Empty state header',
				type: 'string',
			},
			{
				name: 'description',
				description: 'Empty state description',
				type: 'string',
			},
			{
				name: 'imageUrl',
				description: 'Optional image URL',
				type: 'string',
			},
		],
	},
	{
		name: 'Lozenge',
		packageName: '@atlaskit/lozenge',
		description: 'A component for status indicators.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import Lozenge from '@atlaskit/lozenge';

<Lozenge appearance="success">Success</Lozenge>`,
		props: [
			{
				name: 'appearance',
				description: 'Visual style',
				type: "'success' | 'removed' | 'inprogress'",
			},
			{
				name: 'children',
				description: 'Lozenge content',
				type: 'ReactNode',
			},
			{
				name: 'isBold',
				description: 'Bold style',
				type: 'boolean',
			},
		],
	},
	{
		name: 'ProgressIndicator',
		packageName: '@atlaskit/progress-indicator',
		description: 'A component for showing progress through steps.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import { ProgressIndicator } from '@atlaskit/progress-indicator';

<ProgressIndicator
  selectedIndex={1}
  values={['Step 1', 'Step 2', 'Step 3']}
/>`,
		props: [
			{
				name: 'selectedIndex',
				description: 'Current step',
				type: 'number',
			},
			{
				name: 'values',
				description: 'Step labels',
				type: 'string[]',
			},
			{
				name: 'onSelect',
				description: 'Step selection handler',
				type: '(index: number) => void',
			},
		],
	},
	{
		name: 'ProgressTracker',
		packageName: '@atlaskit/progress-tracker',
		description: 'A component for tracking progress through a journey.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import { ProgressTracker } from '@atlaskit/progress-tracker';

<ProgressTracker
  items={[
    { id: '1', label: 'Step 1', percentageComplete: 100 },
    { id: '2', label: 'Step 2', percentageComplete: 50 },
  ]}
/>`,
		props: [
			{
				name: 'items',
				description: 'Progress items',
				type: 'Array<{id: string, label: string, percentageComplete: number}>',
			},
			{
				name: 'current',
				description: 'Current item ID',
				type: 'string',
			},
		],
	},
	{
		name: 'Tag',
		packageName: '@atlaskit/tag',
		description: 'A component for displaying tags.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import Tag from '@atlaskit/tag';

<Tag text="Tag" />`,
		props: [
			{
				name: 'text',
				description: 'Tag text',
				type: 'string',
			},
			{
				name: 'appearance',
				description: 'Visual style',
				type: "'default' | 'rounded'",
			},
			{
				name: 'color',
				description: 'Tag color',
				type: 'string',
			},
		],
	},
	{
		name: 'TagGroup',
		packageName: '@atlaskit/tag-group',
		description: 'A component for managing multiple tags.',
		releasePhase: 'general_availability',
		category: 'Status Indicators',
		example: `import TagGroup from '@atlaskit/tag-group';

<TagGroup>
  <Tag text="Tag 1" />
  <Tag text="Tag 2" />
</TagGroup>`,
		props: [
			{
				name: 'children',
				description: 'Tag components',
				type: 'ReactNode',
			},
			{
				name: 'alignment',
				description: 'Tag alignment',
				type: "'start' | 'end'",
			},
		],
	},
	{
		name: 'Code',
		packageName: '@atlaskit/code',
		description: 'A component for displaying code snippets.',
		releasePhase: 'general_availability',
		category: 'Text and Data Display',
		example: `<Code>const greeting = 'Hello, world!';</Code>`,
		props: [
			{
				name: 'children',
				description: 'Content to be rendered in the inline code block',
				type: 'ReactNode',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests',
				type: 'string',
			},
			{
				name: 'codeBidiWarnings',
				description: 'When set to false, disables code decorating with bidi warnings',
				type: 'boolean',
			},
			{
				name: 'codeBidiWarningLabel',
				description: 'Label for the bidi warning tooltip',
				type: 'string',
			},
			{
				name: 'codeBidiWarningTooltipEnabled',
				description: 'Sets whether to render tooltip with the warning or not',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Heading',
		packageName: '@atlaskit/heading',
		description: 'A typography component used to display text in defined sizes and styles.',
		releasePhase: 'beta',
		category: 'Text and Data Display',
		example: `import Heading from '@atlaskit/heading';

<Heading size="xxlarge">Page title</Heading>`,
		props: [
			{
				name: 'size',
				description:
					'Heading size. This value is detached from the specific heading level applied to allow for more flexibility',
				type: "'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall'",
			},
			{
				name: 'as',
				description:
					'Allows the component to be rendered as the specified DOM element, overriding a default element set by level prop',
				type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'",
			},
			{
				name: 'color',
				description:
					'Token representing text color with a built-in fallback value. Will apply inverse text color automatically if placed within a Box with bold background color. Defaults to color.text',
				type: "'color.text' | 'color.text.inverse' | 'color.text.warning.inverse'",
			},
			{
				name: 'children',
				description: 'The text of the heading',
				type: 'ReactNode',
			},
			{
				name: 'id',
				description: 'Unique identifier for the heading DOM element',
				type: 'string',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests',
				type: 'string',
			},
		],
	},
	{
		name: 'InlineEdit',
		packageName: '@atlaskit/inline-edit',
		description: 'A component for inline editing.',
		releasePhase: 'general_availability',
		category: 'Text and Data Display',
		example: `import InlineEdit from '@atlaskit/inline-edit';

<InlineEdit
  defaultValue="Editable text"
  onConfirm={(value) => console.log(value)}
  readView={() => <div>Read view</div>}
  editView={(fieldProps) => <input {...fieldProps} />}
  testId="inline-edit-test"
/>`,
		props: [
			{
				name: 'defaultValue',
				description: 'The user input entered into the field during editView',
				type: 'any',
			},
			{
				name: 'editButtonLabel',
				description: 'Accessibility label for button to enter editView',
				type: 'string',
			},
			{
				name: 'editLabel',
				description: "Append 'edit' to the end of the button label",
				type: 'string',
			},
			{
				name: 'hideActionButtons',
				description: 'Whether to display confirm and cancel action buttons',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Whether the input value can be confirmed as empty',
				type: 'boolean',
			},
			{
				name: 'onConfirm',
				description: 'Handler to save and confirm value',
				type: '(value: any, analyticsEvent: UIAnalyticsEvent) => void',
			},
		],
	},
	{
		name: 'TableTree',
		packageName: '@atlaskit/table-tree',
		description: 'A component for displaying hierarchical data.',
		releasePhase: 'general_availability',
		category: 'Text and Data Display',
		example: `import TableTree from '@atlaskit/table-tree';

<TableTree
  headers={['Column 1', 'Column 2']}
  columns={[Cell, Cell]}
  items={[
    { content: 'Row 1', children: [{ content: 'Child 1' }] }
  ]}
  label="Table description"
/>`,
		props: [
			{
				name: 'children',
				description: 'Table contents when composing with internal components',
				type: 'ReactNode',
			},
			{
				name: 'columns',
				description: 'Components to render cells in each column',
				type: 'ElementType[]',
			},
			{
				name: 'columnWidths',
				description: 'Widths of table columns',
				type: 'ColumnWidth[]',
			},
			{
				name: 'headers',
				description: 'Header text for table columns',
				type: 'string[]',
			},
			{
				name: 'items',
				description: 'Data to render the table',
				type: 'Array<{ content: ReactNode, children?: Array<{ content: ReactNode }> }>',
			},
		],
	},
	{
		name: 'VisuallyHidden',
		packageName: '@atlaskit/visually-hidden',
		description: 'A utility component for accessibility.',
		releasePhase: 'general_availability',
		category: 'Text and Data Display',
		example: `import VisuallyHidden from '@atlaskit/visually-hidden';

<VisuallyHidden>
  <span>Hidden content</span>
</VisuallyHidden>`,
		props: [
			{
				name: 'children',
				description: 'The element or elements that should be hidden',
				type: 'ReactNode',
			},
			{
				name: 'role',
				description: 'An ARIA role attribute to aid screen readers',
				type: 'string',
			},
			{
				name: 'id',
				description:
					'An id may be appropriate for this component if used in conjunction with aria-describedby on a paired element',
				type: 'string',
			},
			{
				name: 'testId',
				description:
					'A unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests',
				type: 'string',
			},
		],
	},
	{
		name: 'Box',
		packageName: '@atlaskit/primitives/compiled',
		description:
			'A fundamental layout primitive that provides a base for building other components. Box is a generic container that provides managed access to design tokens.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

<Box backgroundColor="color.background.accent.blue.subtlest">
  Content
</Box>

// A section with custom styling
const styles = cssMap({
  root: {
    padding: token('space.200'),
    border: \`\${token('border.width')} solid \${token('color.border')}\`,
  }
});

<Box xcss={styles.root} as="section">
  Styled content
</Box>`,
		props: [
			{
				name: 'as',
				description:
					'The DOM element to render as the Box. Defaults to "div". Note: SVG elements, "button", and "a" are excluded.',
				type: 'Exclude<keyof JSX.IntrinsicElements, SVGElements | "button" | "a">',
				exampleValue: 'as="section"',
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Box',
				type: 'ReactNode',
			},
			{
				name: 'backgroundColor',
				description: 'Token representing background color with a built-in fallback value.',
				type: `'elevation.surface' | 'elevation.surface.hovered' | 'elevation.surface.pressed' | 'elevation.surface.overlay' | 'elevation.surface.overlay.hovered' | 'elevation.surface.overlay.pressed' | 'elevation.surface.raised' | 'elevation.surface.raised.hovered' | 'elevation.surface.raised.pressed' | 'elevation.surface.sunken' | 'utility.elevation.surface.current' | 'color.background.accent.lime.subtlest' | 'color.background.accent.lime.subtlest.hovered' | 'color.background.accent.lime.subtlest.pressed' | 'color.background.accent.lime.subtler' | 'color.background.accent.lime.subtler.hovered' | 'color.background.accent.lime.subtler.pressed' | 'color.background.accent.lime.subtle' | 'color.background.accent.lime.subtle.hovered' | 'color.background.accent.lime.subtle.pressed' | 'color.background.accent.lime.bolder' | 'color.background.accent.lime.bolder.hovered' | 'color.background.accent.lime.bolder.pressed' | 'color.background.accent.red.subtlest' | 'color.background.accent.red.subtlest.hovered' | 'color.background.accent.red.subtlest.pressed' | 'color.background.accent.red.subtler' | 'color.background.accent.red.subtler.hovered' | 'color.background.accent.red.subtler.pressed' | 'color.background.accent.red.subtle' | 'color.background.accent.red.subtle.hovered' | 'color.background.accent.red.subtle.pressed' | 'color.background.accent.red.bolder' | 'color.background.accent.red.bolder.hovered' | 'color.background.accent.red.bolder.pressed' | 'color.background.accent.orange.subtlest' | 'color.background.accent.orange.subtlest.hovered' | 'color.background.accent.orange.subtlest.pressed' | 'color.background.accent.orange.subtler' | 'color.background.accent.orange.subtler.hovered' | 'color.background.accent.orange.subtler.pressed' | 'color.background.accent.orange.subtle' | 'color.background.accent.orange.subtle.hovered' | 'color.background.accent.orange.subtle.pressed' | 'color.background.accent.orange.bolder' | 'color.background.accent.orange.bolder.hovered' | 'color.background.accent.orange.bolder.pressed' | 'color.background.accent.yellow.subtlest' | 'color.background.accent.yellow.subtlest.hovered' | 'color.background.accent.yellow.subtlest.pressed' | 'color.background.accent.yellow.subtler' | 'color.background.accent.yellow.subtler.hovered' | 'color.background.accent.yellow.subtler.pressed' | 'color.background.accent.yellow.subtle' | 'color.background.accent.yellow.subtle.hovered' | 'color.background.accent.yellow.subtle.pressed' | 'color.background.accent.yellow.bolder' | 'color.background.accent.yellow.bolder.hovered' | 'color.background.accent.yellow.bolder.pressed' | 'color.background.accent.green.subtlest' | 'color.background.accent.green.subtlest.hovered' | 'color.background.accent.green.subtlest.pressed' | 'color.background.accent.green.subtler' | 'color.background.accent.green.subtler.hovered' | 'color.background.accent.green.subtler.pressed' | 'color.background.accent.green.subtle' | 'color.background.accent.green.subtle.hovered' | 'color.background.accent.green.subtle.pressed' | 'color.background.accent.green.bolder' | 'color.background.accent.green.bolder.hovered' | 'color.background.accent.green.bolder.pressed' | 'color.background.accent.teal.subtlest' | 'color.background.accent.teal.subtlest.hovered' | 'color.background.accent.teal.subtlest.pressed' | 'color.background.accent.teal.subtler' | 'color.background.accent.teal.subtler.hovered' | 'color.background.accent.teal.subtler.pressed' | 'color.background.accent.teal.subtle' | 'color.background.accent.teal.subtle.hovered' | 'color.background.accent.teal.subtle.pressed' | 'color.background.accent.teal.bolder' | 'color.background.accent.teal.bolder.hovered' | 'color.background.accent.teal.bolder.pressed' | 'color.background.accent.blue.subtlest' | 'color.background.accent.blue.subtlest.hovered' | 'color.background.accent.blue.subtlest.pressed' | 'color.background.accent.blue.subtler' | 'color.background.accent.blue.subtler.hovered' | 'color.background.accent.blue.subtler.pressed' | 'color.background.accent.blue.subtle' | 'color.background.accent.blue.subtle.hovered' | 'color.background.accent.blue.subtle.pressed' | 'color.background.accent.blue.bolder' | 'color.background.accent.blue.bolder.hovered' | 'color.background.accent.blue.bolder.pressed' | 'color.background.accent.purple.subtlest' | 'color.background.accent.purple.subtlest.hovered' | 'color.background.accent.purple.subtlest.pressed' | 'color.background.accent.purple.subtler' | 'color.background.accent.purple.subtler.hovered' | 'color.background.accent.purple.subtler.pressed' | 'color.background.accent.purple.subtle' | 'color.background.accent.purple.subtle.hovered' | 'color.background.accent.purple.subtle.pressed' | 'color.background.accent.purple.bolder' | 'color.background.accent.purple.bolder.hovered' | 'color.background.accent.purple.bolder.pressed' | 'color.background.accent.magenta.subtlest' | 'color.background.accent.magenta.subtlest.hovered' | 'color.background.accent.magenta.subtlest.pressed' | 'color.background.accent.magenta.subtler' | 'color.background.accent.magenta.subtler.hovered' | 'color.background.accent.magenta.subtler.pressed' | 'color.background.accent.magenta.subtle' | 'color.background.accent.magenta.subtle.hovered' | 'color.background.accent.magenta.subtle.pressed' | 'color.background.accent.magenta.bolder' | 'color.background.accent.magenta.bolder.hovered' | 'color.background.accent.magenta.bolder.pressed' | 'color.background.accent.gray.subtlest' | 'color.background.accent.gray.subtlest.hovered' | 'color.background.accent.gray.subtlest.pressed' | 'color.background.accent.gray.subtler' | 'color.background.accent.gray.subtler.hovered' | 'color.background.accent.gray.subtler.pressed' | 'color.background.accent.gray.subtle' | 'color.background.accent.gray.subtle.hovered' | 'color.background.accent.gray.subtle.pressed' | 'color.background.accent.gray.bolder' | 'color.background.accent.gray.bolder.hovered' | 'color.background.accent.gray.bolder.pressed' | 'color.background.disabled' | 'color.background.input' | 'color.background.input.hovered' | 'color.background.input.pressed' | 'color.background.inverse.subtle' | 'color.background.inverse.subtle.hovered' | 'color.background.inverse.subtle.pressed' | 'color.background.neutral' | 'color.background.neutral.hovered' | 'color.background.neutral.pressed' | 'color.background.neutral.subtle' | 'color.background.neutral.subtle.hovered' | 'color.background.neutral.subtle.pressed' | 'color.background.neutral.bold' | 'color.background.neutral.bold.hovered' | 'color.background.neutral.bold.pressed' | 'color.background.selected' | 'color.background.selected.hovered' | 'color.background.selected.pressed' | 'color.background.selected.bold' | 'color.background.selected.bold.hovered' | 'color.background.selected.bold.pressed' | 'color.background.brand.subtlest' | 'color.background.brand.subtlest.hovered' | 'color.background.brand.subtlest.pressed' | 'color.background.brand.bold' | 'color.background.brand.bold.hovered' | 'color.background.brand.bold.pressed' | 'color.background.brand.boldest' | 'color.background.brand.boldest.hovered' | 'color.background.brand.boldest.pressed' | 'color.background.danger' | 'color.background.danger.hovered' | 'color.background.danger.pressed' | 'color.background.danger.bold' | 'color.background.danger.bold.hovered' | 'color.background.danger.bold.pressed' | 'color.background.warning' | 'color.background.warning.hovered' | 'color.background.warning.pressed' | 'color.background.warning.bold' | 'color.background.warning.bold.hovered' | 'color.background.warning.bold.pressed' | 'color.background.success' | 'color.background.success.hovered' | 'color.background.success.pressed' | 'color.background.success.bold' | 'color.background.success.bold.hovered' | 'color.background.success.bold.pressed' | 'color.background.discovery' | 'color.background.discovery.hovered' | 'color.background.discovery.pressed' | 'color.background.discovery.bold' | 'color.background.discovery.bold.hovered' | 'color.background.discovery.bold.pressed' | 'color.background.information' | 'color.background.information.hovered' | 'color.background.information.pressed' | 'color.background.information.bold' | 'color.background.information.bold.hovered' | 'color.background.information.bold.pressed' | 'color.blanket' | 'color.blanket.selected' | 'color.blanket.danger' | 'color.skeleton' | 'color.skeleton.subtle'`,
			},
			{
				name: 'style',
				description: 'Inline styles to be applied to the Box (only use as last resort)',
				type: 'CSSProperties',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'ref',
				description: 'Forwarded ref',
				type: 'Ref',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Pressable',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for creating interactive elements with consistent press states.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Pressable } from '@atlaskit/primitives/compiled';
import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
  pressable: {
    backgroundColor: token('color.background.brand.subtlest'),
    '&:hover': {
      backgroundColor: token('color.background.brand.subtlest.hovered')
    }
  }
});

<Pressable xcss={styles.pressable} onClick={() => console.log('Pressed!')}>
  Hover me
</Pressable>`,
		props: [
			{
				name: 'children',
				description: 'Elements to be rendered inside the Pressable',
				type: 'ReactNode',
			},
			{
				name: 'onClick',
				description: 'Handler called on click with analytics event',
				type: '(e: MouseEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'isDisabled',
				description: 'Whether the button is disabled',
				type: 'boolean',
			},
			{
				name: 'interactionName',
				description: 'Optional name for React UFO press interactions',
				type: 'string',
			},
			{
				name: 'componentName',
				description: 'Optional component name for analytics events',
				type: 'string',
			},
			{
				name: 'analyticsContext',
				description: 'Additional information for analytics events',
				type: 'Record<string, any>',
				exampleValue: "{ source: 'form', action: 'submit' }",
			},
			{
				name: 'ref',
				description: 'Forwarded ref',
				type: 'Ref',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Text',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for rendering text with consistent typography styles.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Text } from '@atlaskit/primitives/compiled';

<Text>Regular text</Text>
<Text weight="bold">Heading text</Text>
<Text color="color.text.accent.blue">
  Accent text
</Text>`,
		props: [
			{
				name: 'as',
				description: 'HTML tag to be rendered. Defaults to `span`.',
				type: "'span' | 'p' | 'strong' | 'em'",
			},
			{
				name: 'children',
				description: 'Elements rendered within the Text element',
				type: 'ReactNode',
			},
			{
				name: 'color',
				description:
					'Token representing text color with a built-in fallback value. Will apply inverse text color automatically if placed within a Box with bold background color. Defaults to "color.text" if not nested in other Text components.',
				type: `'inherit' | 'color.text' | 'color.text.accent.lime' | 'color.text.accent.lime.bolder' | 'color.text.accent.red' | 'color.text.accent.red.bolder' | 'color.text.accent.orange' | 'color.text.accent.orange.bolder' | 'color.text.accent.yellow' | 'color.text.accent.yellow.bolder' | 'color.text.accent.green' | 'color.text.accent.green.bolder' | 'color.text.accent.teal' | 'color.text.accent.teal.bolder' | 'color.text.accent.blue' | 'color.text.accent.blue.bolder' | 'color.text.accent.purple' | 'color.text.accent.purple.bolder' | 'color.text.accent.magenta' | 'color.text.accent.magenta.bolder' | 'color.text.accent.gray' | 'color.text.accent.gray.bolder' | 'color.text.disabled' | 'color.text.inverse' | 'color.text.selected' | 'color.text.brand' | 'color.text.danger' | 'color.text.warning' | 'color.text.warning.inverse' | 'color.text.success' | 'color.text.discovery' | 'color.text.information' | 'color.text.subtlest' | 'color.text.subtle' | 'color.link' | 'color.link.pressed' | 'color.link.visited' | 'color.link.visited.pressed'`,
			},
			{
				name: 'id',
				description: 'The HTML id attribute',
				type: 'string',
			},
			{
				name: 'maxLines',
				description:
					'The number of lines to limit the provided text to. Text will be truncated with an ellipsis. When maxLines=1, wordBreak defaults to break-all to match the behaviour of text-overflow: ellipsis.',
				type: 'number',
			},
			{
				name: 'align',
				description: 'Text alignment',
				type: "'center' | 'end' | 'start'",
			},
			{
				name: 'size',
				description: 'Text size',
				type: "'medium' | 'UNSAFE_small' | 'large' | 'small'",
			},
			{
				name: 'weight',
				description: 'The HTML font-weight attribute',
				type: "'bold' | 'medium' | 'regular' | 'semibold'",
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'ref',
				description: 'Forwarded ref',
				type: 'Ref',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Calendar',
		packageName: '@atlaskit/calendar',
		description:
			"A calendar component for date selection and display. This component is in Beta phase, meaning it's stable at version 1.0+ but may receive improvements based on customer feedback. Breaking changes will only be made in major releases.",
		releasePhase: 'beta',
		category: 'Forms and Input',
		example: `import Calendar from '@atlaskit/calendar';

// Single date selection
<Calendar
  selected={[new Date()]}
  onChange={(date) => console.log(date)}
/>

// Multiple date selection
<Calendar
  selected={['2024-03-20', '2024-03-21']}
  onChange={(dates) => console.log(dates)}
/>`,
		props: [
			{
				name: 'selected',
				description:
					'Currently selected date(s). Can be a single Date object or an array of date strings in YYYY-MM-DD format',
				type: 'string[]',
			},
			{
				name: 'onChange',
				description: 'Handler for date selection changes',
				type: '(date: string[]) => void',
			},
			{
				name: 'disabled',
				description: 'Array of disabled dates (YYYY-MM-DD)',
				type: 'string[]',
			},
			{
				name: 'minDate',
				description: 'Minimum selectable date (YYYY-MM-DD)',
				type: 'string',
			},
			{
				name: 'maxDate',
				description: 'Maximum selectable date (YYYY-MM-DD)',
				type: 'string',
			},
			{
				name: 'day',
				description: 'Currently focused day (0 for no focus)',
				type: 'number',
			},
			{
				name: 'defaultDay',
				description: 'Default focused day',
				type: 'number',
			},
			{
				name: 'defaultMonth',
				description: 'Default month (1-12)',
				type: 'number',
			},
			{
				name: 'defaultYear',
				description: 'Default year',
				type: 'number',
			},
			{
				name: 'defaultSelected',
				description: 'Default selected dates (YYYY-MM-DD)',
				type: 'string[]',
			},
			{
				name: 'defaultPreviouslySelected',
				description: 'Default previously selected dates',
				type: 'string[]',
			},
			{
				name: 'disabledDateFilter',
				description: 'Function to filter disabled dates',
				type: '(date: string) => boolean',
			},
			{
				name: 'month',
				description: 'Current month (1-12)',
				type: 'number',
			},
			{
				name: 'nextMonthLabel',
				description: 'Aria label for next month button',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Blur handler',
				type: 'FocusEventHandler',
			},
			{
				name: 'onFocus',
				description: 'Focus handler',
				type: 'FocusEventHandler',
			},
			{
				name: 'onSelect',
				description: 'Selection handler',
				type: '(event: SelectEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'previouslySelected',
				description: 'Previously selected dates',
				type: 'string[]',
			},
			{
				name: 'previousMonthLabel',
				description: 'Aria label for previous month button',
				type: 'string',
			},
			{
				name: 'style',
				description: 'Custom styles',
				type: 'CSSProperties',
			},
			{
				name: 'tabIndex',
				description: 'Tab index',
				type: '-1 | 0',
			},
			{
				name: 'testId',
				description: 'Test ID for automated tests',
				type: 'string',
			},
			{
				name: 'today',
				description: "Today's date (YYYY-MM-DD)",
				type: 'string',
			},
			{
				name: 'weekStartDay',
				description: 'First day of week (0=Sunday)',
				type: '0-6',
			},
			{
				name: 'year',
				description: 'Current year',
				type: 'number',
			},
			{
				name: 'locale',
				description: 'Locale for date formatting',
				type: 'string',
			},
		],
	},
	{
		name: 'DynamicTable',
		packageName: '@atlaskit/dynamic-table',
		description: 'A component for displaying dynamic data tables.',
		releasePhase: 'general_availability',
		category: 'Text and Data Display',
		example: `import DynamicTable from '@atlaskit/dynamic-table';

<DynamicTable
  head={{
    cells: [
      { content: 'Header 1', isSortable: true },
      { content: 'Header 2' }
    ]
  }}
  rows={[
    {
      cells: [
        { content: 'Cell 1', key: 'cell1' },
        { content: 'Cell 2', key: 'cell2' }
      ]
    }
  ]}
  rowsPerPage={10}
  defaultPage={1}
  loadingSpinnerSize="large"
  isLoading={false}
  testId="dynamic-table-test"
/>`,
		props: [
			{
				name: 'caption',
				description: 'Caption for the table styled as a heading',
				type: 'ReactNode',
			},
			{
				name: 'head',
				description: 'Configuration for table headers',
				type: '{ cells: Array<{ content: ReactNode, isSortable?: boolean, width?: number }> }',
			},
			{
				name: 'rows',
				description: 'Data rows for the table',
				type: 'Array<{ cells: Array<{ content: ReactNode, key: string }> }>',
			},
			{
				name: 'emptyView',
				description: 'Content shown when the table has no data',
				type: 'ReactElement',
			},
			{
				name: 'loadingSpinnerSize',
				description: 'Size of the loading spinner',
				type: "'large' | 'small'",
			},
			{
				name: 'isLoading',
				description: 'Whether the table is in a loading state',
				type: 'boolean',
			},
			{
				name: 'loadingLabel',
				description: 'Accessible name for loading state',
				type: 'string',
			},
			{
				name: 'isFixedSize',
				description: 'Force columns to use initial width',
				type: 'boolean',
			},
			{
				name: 'rowsPerPage',
				description: 'Number of rows per page',
				type: 'number',
			},
			{
				name: 'totalRows',
				description: 'Total number of rows for pagination',
				type: 'number',
			},
			{
				name: 'onSetPage',
				description: 'Handler for page changes',
				type: '(page: number, analyticsEvent?: UIAnalyticsEvent) => void',
			},
			{
				name: 'onSort',
				description: 'Handler for column sorting',
				type: "(sortKey: string, sortOrder: 'ASC' | 'DESC', analyticsEvent?: UIAnalyticsEvent) => void",
			},
			{
				name: 'onPageRowsUpdate',
				description: 'Handler for page row updates',
				type: 'Array<{ cells: Array<{ content: ReactNode, key: string }> }>) => void',
			},
			{
				name: 'page',
				description: 'Current page number',
				type: 'number',
			},
			{
				name: 'defaultPage',
				description: 'Initial page number',
				type: 'number',
			},
			{
				name: 'sortKey',
				description: 'Column key for sorting',
				type: 'string',
			},
			{
				name: 'defaultSortKey',
				description: 'Initial sort column',
				type: 'string',
			},
			{
				name: 'sortOrder',
				description: 'Sort direction',
				type: "'ASC' | 'DESC'",
			},
			{
				name: 'defaultSortOrder',
				description: 'Initial sort direction',
				type: "'ASC' | 'DESC'",
			},
			{
				name: 'isRankable',
				description: 'Enable drag and drop sorting',
				type: 'boolean',
			},
			{
				name: 'isRankingDisabled',
				description: 'Disable row dropping',
				type: 'boolean',
			},
			{
				name: 'onRankStart',
				description: 'Handler for drag start',
				type: '(rankStart: { index: number }) => void',
			},
			{
				name: 'onRankEnd',
				description: 'Handler for drop complete',
				type: '(rankEnd: { index: number, newIndex: number }) => void',
			},
			{
				name: 'paginationi18n',
				description: 'Pagination labels',
				type: '{ label: string, next: string, pageLabel?: string, prev: string }',
			},
			{
				name: 'highlightedRowIndex',
				description: 'Index(es) of highlighted rows',
				type: 'number | number[]',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'label',
				description: 'Accessible label for the table',
				type: 'string',
			},
		],
	},
	{
		name: 'ModalDialog',
		packageName: '@atlaskit/modal-dialog',
		description: 'A modal dialog component for important content.',
		releasePhase: 'general_availability',
		category: 'Messaging',
		example: `import React, { Fragment, useCallback, useState } from 'react';
import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Default modal header</ModalTitle>
						</ModalHeader>
						<ModalBody>
							Your modal content.
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">About modals</Button>
							<Button appearance="primary" onClick={closeModal}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Fragment>
	);
}`,
		contentGuidelines: [
			'Present short-term tasks',
			'Displays content above page layer',
			'Used for focused interactions',
			'Use clear, descriptive titles',
			'Keep content focused on a single task or message',
			'Include clear action buttons',
			'Use sentence case for all text',
		],
		props: [
			{
				name: 'autoFocus',
				description: 'Focus is moved to the first interactive element or specified element',
				type: 'boolean | RefObject<HTMLElement>',
			},
			{
				name: 'children',
				description: 'Contents of the modal dialog',
				type: 'ReactNode',
			},
			{
				name: 'focusLockAllowlist',
				description: 'Callback to allowlist nodes for interaction outside focus lock',
				type: 'function',
			},
			{
				name: 'height',
				description: 'Height of the modal dialog',
				type: 'number | string',
			},
			{
				name: 'width',
				description: 'Width of the modal dialog',
				type: "'small' | 'medium' | 'large' | 'x-large' | number | string",
			},
			{
				name: 'onClose',
				description: 'Callback when modal requests to close',
				type: '(KeyboardOrMouseEvent, UIAnalyticsEvent) => void',
			},
			{
				name: 'onCloseComplete',
				description: 'Callback when modal finishes closing',
				type: '(element: HTMLElement) => void',
			},
			{
				name: 'onOpenComplete',
				description: 'Callback when modal finishes opening',
				type: '(node: HTMLElement, isAppearing: boolean) => void',
			},
			{
				name: 'onStackChange',
				description: 'Callback when modal changes stack position',
				type: '(stackIndex: number) => void',
			},
			{
				name: 'shouldScrollInViewport',
				description: 'Set scroll boundary to viewport instead of modal body',
				type: 'boolean',
			},
			{
				name: 'shouldCloseOnOverlayClick',
				description: 'Close modal when clicking the blanket',
				type: 'boolean',
			},
			{
				name: 'shouldCloseOnEscapePress',
				description: 'Close modal when pressing escape',
				type: 'boolean',
			},
			{
				name: 'shouldReturnFocus',
				description: 'Controls focus behavior on modal exit',
				type: 'boolean | RefObject<HTMLElement>',
			},
			{
				name: 'isBlanketHidden',
				description: 'Remove blanket tinted background',
				type: 'boolean',
			},
			{
				name: 'stackIndex',
				description: 'Position in modal stack (0 is highest)',
				type: 'number',
			},
			{
				name: 'label',
				description: 'Accessibility label when no modal title is present',
				type: 'string',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
		],
	},
	{
		name: 'Anchor',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for creating accessible links.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Anchor } from '@atlaskit/primitives/compiled';

<Anchor href="https://example.com">
  Visit example.com
</Anchor>`,
		props: [
			{
				name: 'children',
				description: 'Elements to be rendered inside the Anchor',
				type: 'ReactNode',
			},
			{
				name: 'onClick',
				description: 'Handler called on click with analytics event',
				type: '(e: MouseEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'interactionName',
				description: 'Optional name for React UFO press interactions',
				type: 'string',
			},
			{
				name: 'componentName',
				description: 'Optional component name for analytics events',
				type: 'string',
			},
			{
				name: 'analyticsContext',
				description: 'Additional information for analytics events',
				type: 'Record<string, any>',
				exampleValue: "{ source: 'form', action: 'submit' }",
			},
			{
				name: 'newWindowLabel',
				description: 'Override text for new window links',
				type: 'string',
			},
			{
				name: 'ref',
				description: 'Forwarded ref',
				type: 'Ref',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Bleed',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A utility for creating negative margin effects.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Bleed } from '@atlaskit/primitives/compiled';

<Bleed
  inline="space.200"
  block="space.100"
>
  Content that bleeds on all sides
</Bleed>`,
		props: [
			{
				name: 'children',
				description: 'Elements to be rendered inside the Bleed',
				type: 'ReactNode',
			},
			{
				name: 'all',
				description: 'Bleed along both axes',
				type: "'space.025' | 'space.050' | 'space.100' | 'space.150' | 'space.200'",
			},
			{
				name: 'inline',
				description: 'Bleed along the inline axis',
				type: "'space.025' | 'space.050' | 'space.100' | 'space.150' | 'space.200'",
			},
			{
				name: 'block',
				description: 'Bleed along the block axis',
				type: "'space.025' | 'space.050' | 'space.100' | 'space.150' | 'space.200'",
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Show',
		packageName: '@atlaskit/primitives/compiled',
		description:
			'A primitive for conditionally showing content at specific breakpoints. By default, content is hidden and will be shown at the specified breakpoint.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Show } from '@atlaskit/primitives/compiled';

// Show content above medium breakpoint
<Show above="md">
  <div>This content shows on medium screens and up</div>
</Show>

// Show content below medium breakpoint
<Show below="md">
  <div>This content shows on small screens and down</div>
</Show>`,
		props: [
			{
				name: 'above',
				description: 'Shows content above the specified breakpoint',
				type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
			},
			{
				name: 'below',
				description: 'Shows content below the specified breakpoint',
				type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
			},
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'article' | 'aside' | 'dialog' | 'div' | 'footer' | 'header' | 'li' | 'main' | 'nav' | 'ol' | 'section' | 'span' | 'ul'",
			},
			{
				name: 'children',
				description: 'Content to be conditionally shown',
				type: 'ReactNode',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Hide',
		packageName: '@atlaskit/primitives/compiled',
		description:
			'A primitive for conditionally hiding content at specific breakpoints. By default, content is shown and will be hidden at the specified breakpoint.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Hide } from '@atlaskit/primitives/compiled';

<Hide above="md">
  <div>This content hides on medium screens and up</div>
</Hide>

<Hide below="md">
  <div>This content hides on small screens and down</div>
</Hide>`,
		props: [
			{
				name: 'above',
				description: 'Hides content above the specified breakpoint',
				type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
			},
			{
				name: 'below',
				description: 'Hides content below the specified breakpoint',
				type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
			},
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'article' | 'aside' | 'dialog' | 'div' | 'footer' | 'header' | 'li' | 'main' | 'nav' | 'ol' | 'section' | 'span' | 'ul'",
			},
			{
				name: 'children',
				description: 'Content to be conditionally hidden',
				type: 'ReactNode',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Flex',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for creating flexible layouts using flexbox.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Flex } from '@atlaskit/primitives/compiled';

<Flex gap="space.100" alignItems="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// With responsive props
<Flex
  gap={['space.100', 'space.200', 'space.300']}
  alignItems={['start', 'center', 'end']}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>`,
		props: [
			{
				name: 'alignItems',
				description: 'Aligns flex items along the cross axis',
				type: "'baseline' | 'center' | 'end' | 'start' | 'stretch'",
			},
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'div' | 'span' | 'ul' | 'ol' | 'li' | 'dl'",
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Flex container',
				type: 'ReactNode',
			},
			{
				name: 'direction',
				description: 'Direction of the flex container',
				type: "'column' | 'column-reverse' | 'row' | 'row-reverse'",
			},
			{
				name: 'gap',
				description: 'Space between flex items',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'justify',
				description: 'Aligns flex items along the main axis',
				type: "'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly' | 'start'",
			},
			{
				name: 'wrap',
				description: 'Controls whether flex items can wrap to multiple lines',
				type: 'boolean',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Grid',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for creating grid layouts.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Grid } from '@atlaskit/primitives/compiled';

<Grid
  templateColumns="repeat(3, 1fr)"
  gap="space.100"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// With responsive props
<Grid
  templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
  gap={['space.100', 'space.200', 'space.300']}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>`,
		props: [
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'div' | 'span' | 'ul' | 'ol'",
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Grid container',
				type: 'ReactNode',
			},
			{
				name: 'columnGap',
				description: 'Space between grid columns',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'gap',
				description: 'Space between grid items (both rows and columns)',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'rowGap',
				description: 'Space between grid rows',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'templateColumns',
				description: 'Defines the columns of the grid with a space-separated list of values',
				type: 'string',
			},
			{
				name: 'templateRows',
				description: 'Defines the rows of the grid with a space-separated list of values',
				type: 'string',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Stack',
		packageName: '@atlaskit/primitives/compiled',
		description: 'A primitive for creating vertical stacks of content with consistent spacing.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Stack } from '@atlaskit/primitives/compiled';

<Stack gap="space.100">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// With responsive props
<Stack gap={['space.100', 'space.200', 'space.300']}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>`,
		props: [
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'div' | 'span' | 'ul' | 'ol'",
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Stack container',
				type: 'ReactNode',
			},
			{
				name: 'gap',
				description: 'Space between stack items',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
	{
		name: 'Inline',
		packageName: '@atlaskit/primitives/compiled',
		description:
			'A primitive for creating horizontal layouts with consistent spacing that can wrap to multiple lines.',
		releasePhase: 'general_availability',
		category: 'Primitives',
		example: `import { Inline } from '@atlaskit/primitives/compiled';

<Inline gap="space.100" alignItems="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Inline>

// With responsive props
<Inline
  gap={['space.100', 'space.200', 'space.300']}
  alignItems={['start', 'center', 'end']}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Inline>`,
		props: [
			{
				name: 'alignItems',
				description: 'Aligns items along the cross axis',
				type: "'baseline' | 'center' | 'end' | 'start' | 'stretch'",
			},
			{
				name: 'as',
				description: 'The DOM element to render as. Defaults to "div"',
				type: "'div' | 'span' | 'ul' | 'ol' | 'li' | 'dl'",
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Inline container',
				type: 'ReactNode',
			},
			{
				name: 'gap',
				description: 'Space between inline items',
				type: "'space.0' | 'space.025' | 'space.050' | 'space.075' | 'space.100' | 'space.150' | 'space.200' | 'space.250' | 'space.300' | 'space.400' | 'space.500' | 'space.600' | 'space.800' | 'space.1000'",
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens',
				type: 'StrictXCSSProp',
				exampleValue: 'xcss={cx(styles.root, isHovered && styles.hover)}',
			},
			{
				name: 'testId',
				description: 'Test ID for automated testing',
				type: 'string',
			},
			{
				name: 'role',
				description: 'ARIA role attribute',
				type: 'string',
			},
		],
	},
];
