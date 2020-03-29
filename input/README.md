# Input

**YOU SHOULD ALMOST DEFINITELY NOT BE USING THIS COMPONENT DIRECTLY**

**USE @atlaskit/field-text INSTEAD**

## SingleLineTextInput

A text input component with extremely basic styling that supports read/edit modes.

Designed for use within other components, e.g. for the read/edit views required by
ak-inline-edit, or within table cells.

Note: In addition the props described below, all other props passed to this
component will be forwarded to the underlying HTML 'input'. This allows change
handlers, placeholders, etc, to be attached to it.

**Kind**: global variable

- Properties

- [SingleLineTextInput](#SingleLineTextInput)
  - [.value](#SingleLineTextInput.value) : <code>string</code>
  - [.style](#SingleLineTextInput.style) : <code>object</code>
  - [.isInitiallySelected](#SingleLineTextInput.isInitiallySelected) : <code>boolean</code>
  - [.isEditing](#SingleLineTextInput.isEditing) : <code>boolean</code>
  - [.onConfirm](#SingleLineTextInput.onConfirm) : <code>function</code>
  - [.onKeyDown](#SingleLineTextInput.onKeyDown) : <code>function</code>

<a name="SingleLineTextInput.value"></a>

### SingleLineTextInput.value : <code>string</code>

The value of the input field.

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
<a name="SingleLineTextInput.style"></a>

### SingleLineTextInput.style : <code>object</code>

Custom styles that will be applied to the read and edit views.

Typical use would be to specify a custom font size.

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
<a name="SingleLineTextInput.isInitiallySelected"></a>

### SingleLineTextInput.isInitiallySelected : <code>boolean</code>

Whether the input text will initially be selected/highlighted.

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
**Default**: <code>false</code>
<a name="SingleLineTextInput.isEditing"></a>

### SingleLineTextInput.isEditing : <code>boolean</code>

Whether the component is in edit mode or read mode.

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
<a name="SingleLineTextInput.onConfirm"></a>

### SingleLineTextInput.onConfirm : <code>function</code>

Called when the user confirms input by pressing the enter key

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
<a name="SingleLineTextInput.onKeyDown"></a>

### SingleLineTextInput.onKeyDown : <code>function</code>

Regular onKeyDown handler passed to the input

**Kind**: static property of <code>[SingleLineTextInput](#SingleLineTextInput)</code>
