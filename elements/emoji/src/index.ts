import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPicker from './components/picker/EmojiPicker';
import EmojiUploader from './components/uploader/EmojiUploader';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiTypeAheadItem from './components/typeahead/EmojiTypeAheadItem';
export {
  // renaming exports to prevent breaking changes due to renaming
  commonSelectedStyles as selected,
  selectOnHoverStyles as selectOnHover,
  emojiSprite,
  emojiNodeStyles as emojiNode,
  emojiImage,
  placeholder as emojiPlaceholder,
} from './components/common/styles';
import EmojiResource, {
  type EmojiProvider,
  type UploadingEmojiProvider,
  type EmojiResourceConfig,
} from './api/EmojiResource';
import EmojiRepository from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';
import { toEmojiId, toOptionalEmojiId } from './util/type-helpers';
import {
  recordSelectionFailedSli,
  recordSelectionSucceededSli,
  ufoExperiences,
  withSampling,
  WithSamplingUFOExperience,
} from './util/analytics';
import {
  customCategory,
  defaultEmojiHeight,
  emojiPickerWidth,
  emojiPickerHeight,
} from './util/constants';
import { UsageFrequencyTracker } from './api/internal/UsageFrequencyTracker';
import { useEmoji } from './hooks/useEmoji';
import { useEmojiContext } from './hooks/useEmojiContext';
import { EmojiContextProvider } from './context/EmojiContextProvider';
import { EmojiCommonProvider } from './context/EmojiCommonProvider';

export {
  // Classes
  AbstractResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiPicker,
  EmojiUploader,
  EmojiResource,
  EmojiCommonProvider,
  EmojiRepository,
  EmojiTypeAhead,
  ResourcedEmoji,
  EmojiContextProvider,
  // hooks,
  useEmoji,
  useEmojiContext,
  // functions
  denormaliseEmojiServiceResponse,
  toEmojiId,
  toOptionalEmojiId,
  recordSelectionFailedSli,
  recordSelectionSucceededSli,
  ufoExperiences,
  withSampling,
  // Constants
  emojiPickerWidth,
  emojiPickerHeight,
  defaultEmojiHeight,
  customCategory,
  UsageFrequencyTracker,
  EmojiTypeAheadItem,
};
export type {
  // interfaces
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
  WithSamplingUFOExperience,
};

export {
  // Enums
  SearchSort,
  UfoExperienceName,
  UfoComponentName,
} from './types';

export type {
  // Types
  CategoryId,
  EmojiRepresentation,
  EmojiServiceRepresentation,
  Message,
  OptionalEmojiDescription,
  OptionalEmojiDescriptionWithVariations,
  OptionalUser,
  RelativePosition,
  ToneSelection,
  // Interfaces
  AltRepresentations,
  CategoryDescription,
  EmojiDescription,
  EmojiDescriptionWithVariations,
  EmojiId,
  EmojiImageRepresentation,
  EmojiMeta,
  EmojiResponse,
  EmojiSearchResult,
  EmojiServiceDescription,
  EmojiServiceDescriptionWithVariations,
  EmojiServiceResponse,
  EmojiUpload,
  EmojiVariationDescription,
  ImageRepresentation,
  MediaApiRepresentation,
  MediaApiToken,
  OnCategory,
  OnEmojiEvent,
  OnToneSelected,
  OnToneSelectorCancelled,
  SearchOptions,
  SpriteImageRepresentation,
  SpriteRepresentation,
  SpriteServiceRepresentation,
  SpriteSheet,
  SpriteSheets,
  Styles,
  User,
  PickerSize,
} from './types';

export default EmojiPicker;
