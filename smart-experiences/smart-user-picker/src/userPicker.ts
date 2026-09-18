/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export {
	//Utils
	isEmail,
	isTeam,
	isUser,
	isExternalUser,
	isValidEmail,
	isGroup,
	// Constants
	EmailType,
	GroupType,
	TeamType,
	UserType,
} from '@atlaskit/user-picker';
export type {
	// Types
	ActionTypes,
	Appearance,
	AtlasKitSelectChange,
	AtlaskitSelectValue,
	DefaultValue,
	EmailValidationResponse,
	EmailValidator,
	InputActionTypes,
	LozengeProps,
	OnChange,
	OnInputChange,
	OnOption,
	OnPicker,
	Option,
	OptionData,
	OptionIdentifier,
	PopupUserPickerProps,
	Promisable,
	Target,
	UserPickerProps,
	UserPickerState,
	Value,
	// Interfaces
	Email,
	Group,
	GroupHighlight,
	HighlightRange,
	LoadOptions,
	Team,
	TeamHighlight,
	TeamMember,
	User,
	UserHighlight,
	ExternalUser,
	UserSource,
} from '@atlaskit/user-picker';
