import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('enforce-inline-styles-in-select', rule, {
	valid: [
		// Inline styles object without pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          backgroundColor: 'white',
        }),
        multiValue: (base) => ({
          ...base,
          color: 'blue',
        }),
        }} />;
      `,
		},
		// Another inline styles object without pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        input: (base) => ({
          ...base,
          backgroundColor: 'white',
        }),
        }} />;
      `,
		},
		// Not @atlaskit/select - should be ignored
		{
			code: `
        import NotSelect from '@atlassian/select';
        <NotSelect styles={{
        control: (base) => ({
          ...base,
          ':hover': { color: 'red' },
        }),
        }} />;
      `,
		},
		// Not @atlaskit/select - should be ignored
		{
			code: `
        import Select from '../src/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':hover': { color: 'red' },
        }),
        }} />;
      `,
		},
		// No styles prop
		{
			code: `
        import Select from '@atlaskit/select';
        <Select placeholder="Select an option" />;
      `,
		},
	],
	invalid: [
		// Inline :hover pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':hover': { color: 'red' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':hover' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Inline complex selector
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          '& > div': { padding: '8px' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector '& > div' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Variable-defined styles
		{
			code: `
        import Select from '@atlaskit/select';
        const bulkOpsSelectStyles = {
        placeholder: (base) => ({
          ...base,
          fontWeight: 'bold',
        }),
        control: (base, { isFocused }) => ({
          ...base,
          fontWeight: 'bold',
          backgroundColor: 'white',
        }),
        };
        <Select styles={bulkOpsSelectStyles} />;
      `,
			errors: [
				{
					message:
						'Variable-defined styles are not allowed for @atlaskit/select. Please use inline styles object or the `components` API with `xcss` props.',
				},
			],
		},
		// Variable-defined styles with pseudo-class - now invalid for being variable
		{
			code: `
        import Select from '@atlaskit/select';
        const bulkOpsSelectStyles = {
        placeholder: (base) => ({
          ...base,
          fontWeight: 'bold',
        }),
        control: (base, { isFocused }) => ({
          ...base,
          fontWeight: 'bold',
          ':hover': {
          backgroundColor: 'white',
          borderColor: isFocused ? 'blue' : 'gray',
          },
        }),
        };
        <Select styles={bulkOpsSelectStyles} />;
      `,
			errors: [
				{
					message:
						'Variable-defined styles are not allowed for @atlaskit/select. Please use inline styles object or the `components` API with `xcss` props.',
				},
			],
		},
		// :focus pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        input: (base) => ({
          ...base,
          ':focus': {
          outline: 'none',
          },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':focus' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// :focus-visible pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        input: (base) => ({
          ...base,
          ':focus-visible': {
          backgroundColor: 'white',
          borderColor: 'blue',
          },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':focus-visible' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Variable-defined styles using function call
		{
			code: `
        import Select from '@atlaskit/select';
        const getStyles = () => ({
          control: (base) => ({
            ...base,
            backgroundColor: 'white',
          }),
        });
        <Select styles={getStyles()} />;
      `,
			errors: [
				{
					message:
						'Variable-defined styles are not allowed for @atlaskit/select. Please use inline styles object or the `components` API with `xcss` props.',
				},
			],
		},
		// Variable-defined styles using member expression
		{
			code: `
        import Select from '@atlaskit/select';
        const theme = {
          selectStyles: {
            control: (base) => ({
              ...base,
              backgroundColor: 'white',
            }),
          }
        };
        <Select styles={theme.selectStyles} />;
      `,
			errors: [
				{
					message:
						'Variable-defined styles are not allowed for @atlaskit/select. Please use inline styles object or the `components` API with `xcss` props.',
				},
			],
		},
		// :active pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':active': { transform: 'scale(0.98)' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':active' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Multiple pseudo-classes in the same object
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':hover': { backgroundColor: 'blue' },
          ':focus': { borderColor: 'red' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':hover' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
				{
					message:
						"This selector ':focus' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Multiple style keys with pseudo-classes
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':hover': { backgroundColor: 'blue' },
        }),
        input: (base) => ({
          ...base,
          ':focus': { outline: 'none' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':hover' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
				{
					message:
						"This selector ':focus' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// :disabled pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: (base) => ({
          ...base,
          ':disabled': { opacity: 0.5 },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':disabled' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// :checked pseudo-class
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        option: (base) => ({
          ...base,
          ':checked': { backgroundColor: 'green' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':checked' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Pseudo-elements should also be caught
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
          control: (base) => ({
            ...base,
            ':before': { content: '""' },
		        ':focus': { color: 'red' },
          }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':before' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
				{
					message:
						"This selector ':focus' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// :after pseudo-element
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        singleValue: (base) => ({
          ...base,
          ':after': { content: '"*"' },
        }),
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':after' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
		// Function expression instead of arrow function
		{
			code: `
        import Select from '@atlaskit/select';
        <Select styles={{
        control: function(base) {
          return {
          ...base,
          ':hover': { color: 'red' },
          };
        },
        }} />;
      `,
			errors: [
				{
					message:
						"This selector ':hover' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
				},
			],
		},
	],
});
