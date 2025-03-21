The date picker and datetime picker should show the calendar button for users to ensure it is
accessible for all users.

## Examples

This rule will warn makers if the prop is not set to show the calendar button.

### Incorrect

```tsx
<DatePicker />
 ^^^^^^^^^^ `shouldShowCalendarButton` should be set to `true` to make date picker accessible.

<DatePicker shouldShowCalendarButton={false} />
            ^^^^^^^^^^^^^^^^^^^^^^^^ `shouldShowCalendarButton` should be set to `true` to make date picker accessible.

<DateTimePicker />
 ^^^^^^^^^^ `shouldShowCalendarButton` should be set to `true` to make date picker accessible.

<DateTimePicker
  datePickerProps={{
		shouldShowCalendarButton: false
		^^^^^^^^^^^^^^^^^^^^^^^^ `shouldShowCalendarButton` should be set to `true` to make date picker accessible.
	}}
/>
```

### Correct

```tsx
<DatePicker shouldShowCalendarButton />

<DateTimePicker datePickerProps={{
	shouldShowCalendarButton: true
}} />
```
