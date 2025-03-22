The modal dialog should have a dedicated close button to ensure it is accessible for all users.

## Examples

This rule will warn makers if the `hasCloseButton` prop is not set to `true` or if the `CloseButton`
component is not used.

### Incorrect

```tsx
<ModalDialog>
	^^^^^^^^^^^ `hasCloseButton` on `ModalHeader` should be set to `true` or `CloseButton` component should be used to make modal dialog accessible.
	<div>
		<ModalTitle>Modal Title</ModalTitle>
	</div>
</ModalDialog>

<ModalDialog>
	^^^^^^^^^^^ `hasCloseButton` on `ModalHeader` should be set to `true` or `CloseButton` component should be used to make modal dialog accessible.
	<ModalHeader>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>

<ModalDialog>
	^^^^^^^^^^^ `hasCloseButton` on `ModalHeader` should be set to `true` or `CloseButton` component should be used to make modal dialog accessible.
	<ModalHeader hasCloseButton={false}>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
```

### Correct

```tsx
<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>

<ModalDialog>
	<ModalHeader>
		<Box>
			<ModalTitle>Modal Title</ModalTitle>
			<CloseButton onClick={onClose} />
		</Box>
	</ModalHeader>
</ModalDialog>
```
