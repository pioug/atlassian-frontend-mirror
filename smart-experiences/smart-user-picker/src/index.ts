export { default } from './components';
export { getUserRecommendations, hydrateDefaultValues } from './service';
export type { RecommendationRequest, Props, State } from './types';
export {
  //Utils
  isEmail,
  isTeam,
  isUser,
  isValidEmail,
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
  User,
  UserHighlight,
  ExternalUser,
  UserSource,
} from '@atlaskit/user-picker';

export { setSmartUserPickerEnv } from './config';
