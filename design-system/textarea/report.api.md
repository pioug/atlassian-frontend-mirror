<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/textarea"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
/// <reference types="react" />

import { default as React_2 } from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

// @public (undocumented)
type Combine<First, Second> = Omit<First, keyof Second> & Second;

// @public (undocumented)
interface OwnProps extends WithAnalyticsEventsProps {
	appearance?: 'none' | 'standard' | 'subtle';
	defaultValue?: string;
	isCompact?: boolean;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isMonospaced?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	maxHeight?: string;
	minimumRows?: number;
	name?: string;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
	placeholder?: string;
	resize?: 'auto' | 'horizontal' | 'none' | 'smart' | 'vertical';
	spellCheck?: boolean;
	testId?: string;
	theme?: any;
	value?: string;
}

// @public
const TextArea: React_2.MemoExoticComponent<
	React_2.ForwardRefExoticComponent<
		Pick<
			TextAreaProps,
			| 'about'
			| 'accessKey'
			| 'appearance'
			| 'aria-activedescendant'
			| 'aria-atomic'
			| 'aria-autocomplete'
			| 'aria-busy'
			| 'aria-checked'
			| 'aria-colcount'
			| 'aria-colindex'
			| 'aria-colspan'
			| 'aria-controls'
			| 'aria-current'
			| 'aria-describedby'
			| 'aria-details'
			| 'aria-disabled'
			| 'aria-dropeffect'
			| 'aria-errormessage'
			| 'aria-expanded'
			| 'aria-flowto'
			| 'aria-grabbed'
			| 'aria-haspopup'
			| 'aria-hidden'
			| 'aria-invalid'
			| 'aria-keyshortcuts'
			| 'aria-label'
			| 'aria-labelledby'
			| 'aria-level'
			| 'aria-live'
			| 'aria-modal'
			| 'aria-multiline'
			| 'aria-multiselectable'
			| 'aria-orientation'
			| 'aria-owns'
			| 'aria-placeholder'
			| 'aria-posinset'
			| 'aria-pressed'
			| 'aria-readonly'
			| 'aria-relevant'
			| 'aria-required'
			| 'aria-roledescription'
			| 'aria-rowcount'
			| 'aria-rowindex'
			| 'aria-rowspan'
			| 'aria-selected'
			| 'aria-setsize'
			| 'aria-sort'
			| 'aria-valuemax'
			| 'aria-valuemin'
			| 'aria-valuenow'
			| 'aria-valuetext'
			| 'autoCapitalize'
			| 'autoComplete'
			| 'autoCorrect'
			| 'autoFocus'
			| 'autoSave'
			| 'children'
			| 'className'
			| 'color'
			| 'cols'
			| 'contentEditable'
			| 'contextMenu'
			| 'createAnalyticsEvent'
			| 'dangerouslySetInnerHTML'
			| 'datatype'
			| 'defaultChecked'
			| 'defaultValue'
			| 'dir'
			| 'dirName'
			| 'draggable'
			| 'form'
			| 'hidden'
			| 'id'
			| 'inlist'
			| 'inputMode'
			| 'is'
			| 'isCompact'
			| 'isDisabled'
			| 'isInvalid'
			| 'isMonospaced'
			| 'isReadOnly'
			| 'isRequired'
			| 'itemID'
			| 'itemProp'
			| 'itemRef'
			| 'itemScope'
			| 'itemType'
			| 'lang'
			| 'maxHeight'
			| 'maxLength'
			| 'minLength'
			| 'minimumRows'
			| 'name'
			| 'onAbort'
			| 'onAbortCapture'
			| 'onAnimationEnd'
			| 'onAnimationEndCapture'
			| 'onAnimationIteration'
			| 'onAnimationIterationCapture'
			| 'onAnimationStart'
			| 'onAnimationStartCapture'
			| 'onAuxClick'
			| 'onAuxClickCapture'
			| 'onBeforeInput'
			| 'onBeforeInputCapture'
			| 'onBlur'
			| 'onBlurCapture'
			| 'onCanPlay'
			| 'onCanPlayCapture'
			| 'onCanPlayThrough'
			| 'onCanPlayThroughCapture'
			| 'onChange'
			| 'onChangeCapture'
			| 'onClick'
			| 'onClickCapture'
			| 'onCompositionEnd'
			| 'onCompositionEndCapture'
			| 'onCompositionStart'
			| 'onCompositionStartCapture'
			| 'onCompositionUpdate'
			| 'onCompositionUpdateCapture'
			| 'onContextMenu'
			| 'onContextMenuCapture'
			| 'onCopy'
			| 'onCopyCapture'
			| 'onCut'
			| 'onCutCapture'
			| 'onDoubleClick'
			| 'onDoubleClickCapture'
			| 'onDrag'
			| 'onDragCapture'
			| 'onDragEnd'
			| 'onDragEndCapture'
			| 'onDragEnter'
			| 'onDragEnterCapture'
			| 'onDragExit'
			| 'onDragExitCapture'
			| 'onDragLeave'
			| 'onDragLeaveCapture'
			| 'onDragOver'
			| 'onDragOverCapture'
			| 'onDragStart'
			| 'onDragStartCapture'
			| 'onDrop'
			| 'onDropCapture'
			| 'onDurationChange'
			| 'onDurationChangeCapture'
			| 'onEmptied'
			| 'onEmptiedCapture'
			| 'onEncrypted'
			| 'onEncryptedCapture'
			| 'onEnded'
			| 'onEndedCapture'
			| 'onError'
			| 'onErrorCapture'
			| 'onFocus'
			| 'onFocusCapture'
			| 'onGotPointerCapture'
			| 'onGotPointerCaptureCapture'
			| 'onInput'
			| 'onInputCapture'
			| 'onInvalid'
			| 'onInvalidCapture'
			| 'onKeyDown'
			| 'onKeyDownCapture'
			| 'onKeyPress'
			| 'onKeyPressCapture'
			| 'onKeyUp'
			| 'onKeyUpCapture'
			| 'onLoad'
			| 'onLoadCapture'
			| 'onLoadStart'
			| 'onLoadStartCapture'
			| 'onLoadedData'
			| 'onLoadedDataCapture'
			| 'onLoadedMetadata'
			| 'onLoadedMetadataCapture'
			| 'onLostPointerCapture'
			| 'onLostPointerCaptureCapture'
			| 'onMouseDown'
			| 'onMouseDownCapture'
			| 'onMouseEnter'
			| 'onMouseLeave'
			| 'onMouseMove'
			| 'onMouseMoveCapture'
			| 'onMouseOut'
			| 'onMouseOutCapture'
			| 'onMouseOver'
			| 'onMouseOverCapture'
			| 'onMouseUp'
			| 'onMouseUpCapture'
			| 'onPaste'
			| 'onPasteCapture'
			| 'onPause'
			| 'onPauseCapture'
			| 'onPlay'
			| 'onPlayCapture'
			| 'onPlaying'
			| 'onPlayingCapture'
			| 'onPointerCancel'
			| 'onPointerCancelCapture'
			| 'onPointerDown'
			| 'onPointerDownCapture'
			| 'onPointerEnter'
			| 'onPointerEnterCapture'
			| 'onPointerLeave'
			| 'onPointerLeaveCapture'
			| 'onPointerMove'
			| 'onPointerMoveCapture'
			| 'onPointerOut'
			| 'onPointerOutCapture'
			| 'onPointerOver'
			| 'onPointerOverCapture'
			| 'onPointerUp'
			| 'onPointerUpCapture'
			| 'onProgress'
			| 'onProgressCapture'
			| 'onRateChange'
			| 'onRateChangeCapture'
			| 'onReset'
			| 'onResetCapture'
			| 'onScroll'
			| 'onScrollCapture'
			| 'onSeeked'
			| 'onSeekedCapture'
			| 'onSeeking'
			| 'onSeekingCapture'
			| 'onSelect'
			| 'onSelectCapture'
			| 'onStalled'
			| 'onStalledCapture'
			| 'onSubmit'
			| 'onSubmitCapture'
			| 'onSuspend'
			| 'onSuspendCapture'
			| 'onTimeUpdate'
			| 'onTimeUpdateCapture'
			| 'onTouchCancel'
			| 'onTouchCancelCapture'
			| 'onTouchEnd'
			| 'onTouchEndCapture'
			| 'onTouchMove'
			| 'onTouchMoveCapture'
			| 'onTouchStart'
			| 'onTouchStartCapture'
			| 'onTransitionEnd'
			| 'onTransitionEndCapture'
			| 'onVolumeChange'
			| 'onVolumeChangeCapture'
			| 'onWaiting'
			| 'onWaitingCapture'
			| 'onWheel'
			| 'onWheelCapture'
			| 'placeholder'
			| 'prefix'
			| 'property'
			| 'radioGroup'
			| 'readOnly'
			| 'resize'
			| 'resource'
			| 'results'
			| 'role'
			| 'rows'
			| 'security'
			| 'slot'
			| 'spellCheck'
			| 'style'
			| 'suppressContentEditableWarning'
			| 'suppressHydrationWarning'
			| 'tabIndex'
			| 'testId'
			| 'theme'
			| 'title'
			| 'translate'
			| 'typeof'
			| 'unselectable'
			| 'value'
			| 'vocab'
			| 'wrap'
		> &
			React_2.RefAttributes<HTMLTextAreaElement>
	>
>;
export default TextArea;

// @public (undocumented)
export type TextAreaProps = Combine<
	Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled' | 'readonly' | 'required'>,
	OwnProps
>;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
