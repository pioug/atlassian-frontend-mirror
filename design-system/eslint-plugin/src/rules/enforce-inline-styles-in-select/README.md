This ESLint rule enforces inline styles only and disallows unsupported CSS selectors in the styles
prop for @atlaskit/select component.

1. **Inline styles only**: Variable-defined styles objects are not allowed
2. **No unsupported CSS selectors**: Pseudo-classes, pseudo-elements, combinators, attribute
   selectors, and at-rules are not allowed

## Unsupported Selectors

- **Pseudo-classes/elements**: `:hover`, `:focus`, `:active`, `:disabled`, `:before`, `:after`, etc.
- **Attribute selectors**: `[type="text"]`, `[disabled]`, etc.
- **Combinators**: `>` (child), `+` (adjacent sibling), `~` (general sibling), ` ` (descendant)
- **Universal selector**: `*`
- **ID selector**: `#myId`
- **Class selector**: `.myClass`
- **At-rules**: `@media`, `@supports`, etc.
- **Parent selector**: `&`
- **Namespace separator**: `|`
- **Attribute operators**: `^=`, `$=`, `=`

## Incorrect

```tsx
import Select from '@atlaskit/select';

// ❌ Variable-defined styles (not allowed even without unsupported selectors)
const selectStyles = {
	control: (base) => ({
		...base,
		backgroundColor: 'white',
		borderColor: 'gray',
	}),
};
<Select styles={selectStyles} />;

// ❌ Function call for styles
const getStyles = () => ({
	control: (base) => ({ ...base, color: 'blue' }),
});
<Select styles={getStyles()} />;

// ❌ Member expression for styles
const theme = {
	selectStyles: {
		control: (base) => ({ ...base, color: 'red' }),
	},
};
<Select styles={theme.selectStyles} />;

// ❌ Variable-defined styles with unsupported selectors
const selectStylesWithPseudo = {
	control: (base) => ({
		...base,
		':focus-visible': { outline: '2px solid blue' },
	}),
};
<Select styles={selectStylesWithPseudo} />;

// ❌ Inline styles with pseudo-classes
<Select
	styles={{
		control: (base) => ({
			...base,
			':hover': { backgroundColor: 'blue' },
			':focus': { borderColor: 'red' },
		}),
	}}
/>;

// ❌ Inline styles with pseudo-elements
<Select
	styles={{
		control: (base) => ({
			...base,
			':before': { content: '""' },
			':after': { content: '"*"' },
		}),
	}}
/>;

// ❌ Inline styles with attribute selectors
<Select
	styles={{
		input: (base) => ({
			...base,
			'[disabled]': { opacity: 0.5 },
		}),
	}}
/>;

// ❌ Inline styles with combinators
<Select
	styles={{
		control: (base) => ({
			...base,
			'> div': { padding: '8px' },
			'& > span': { fontWeight: 'bold' },
		}),
	}}
/>;

// ❌ Inline styles with class selectors
<Select
	styles={{
		control: (base) => ({
			...base,
			'.custom-class': { color: 'purple' },
		}),
	}}
/>;
```

## Correct

```tsx
import Select from '@atlaskit/select';

// ✅ Inline styles with normal CSS properties only
<Select
	styles={{
		control: (base) => ({
			...base,
			backgroundColor: 'white',
			borderColor: 'gray',
			padding: '8px',
			color: 'black',
			fontSize: '14px',
		}),
		option: (base, { isSelected }) => ({
			...base,
			backgroundColor: isSelected ? 'blue' : 'white',
			color: isSelected ? 'white' : 'black',
		}),
	}}
/>;

// ✅ Use components API with xcss prop for pseudo-classes
import { cssMap } from '@compiled/react';
import Select, { components } from '@atlaskit/select';

const controlStyles = cssMap({
	root: {
		'&:hover': {
			backgroundColor: 'white',
		},
		'&:focus': {
			borderColor: 'blue',
		},
	},
});

<Select
	components={{
		Control: (props) => <components.Control {...props} xcss={controlStyles.root} />,
	}}
/>;

// ✅ Use components API with xcss prop for pseudo-elements
const controlWithPseudoStyles = cssMap({
	root: {
		'&:before': {
			content: '""',
			position: 'absolute',
		},
		'&:after': {
			content: '"*"',
			color: 'red',
		},
	},
});

<Select
	components={{
		Control: (props) => <components.Control {...props} xcss={controlWithPseudoStyles.root} />,
	}}
/>;

// ✅ Use components API with xcss prop for complex selectors
const complexStyles = cssMap({
	root: {
		'& > div': {
			padding: '8px',
		},
		'&[disabled]': {
			opacity: 0.5,
		},
		'&.custom-class': {
			color: 'purple',
		},
	},
});

<Select
	components={{
		Control: (props) => <components.Control {...props} xcss={complexStyles.root} />,
	}}
/>;

// ✅ Multiple inline style functions
<Select
	styles={{
		control: (base, { isFocused, isDisabled }) => ({
			...base,
			backgroundColor: isDisabled ? 'gray' : 'white',
			borderColor: isFocused ? 'blue' : 'lightgray',
			opacity: isDisabled ? 0.6 : 1,
		}),
		menu: (base) => ({
			...base,
			borderRadius: '4px',
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		}),
		option: (base, { isSelected, isFocused }) => ({
			...base,
			backgroundColor: isSelected ? 'blue' : isFocused ? 'lightblue' : 'white',
			color: isSelected ? 'white' : 'black',
		}),
	}}
/>;
```

## Migration Guide

If you have existing variable-defined styles, you have two options:

### Option 1: Convert to Inline Styles (for basic styling)

```tsx
// Before
const selectStyles = {
	control: (base) => ({
		...base,
		backgroundColor: 'white',
		borderColor: 'gray',
	}),
};
<Select styles={selectStyles} />;

// After
<Select
	styles={{
		control: (base) => ({
			...base,
			backgroundColor: 'white',
			borderColor: 'gray',
		}),
	}}
/>;
```

### Option 2: Use Components API (for advanced selectors)

```tsx
// Before
const selectStyles = {
	control: (base) => ({
		...base,
		':hover': { backgroundColor: 'lightgray' },
		':focus': { borderColor: 'blue' },
	}),
};
<Select styles={selectStyles} />;

// After
import { cssMap } from '@compiled/react';
import { components } from '@atlaskit/select';

const controlStyles = cssMap({
	root: {
		'&:hover': { backgroundColor: 'lightgray' },
		'&:focus': { borderColor: 'blue' },
	},
});

<Select
	components={{
		Control: (props) => <components.Control {...props} xcss={controlStyles.root} />,
	}}
/>;
```
