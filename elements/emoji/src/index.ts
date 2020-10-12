import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPicker from './components/picker/EmojiPicker';
import EmojiUploader from './components/uploader/EmojiUploader';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiTypeAheadItem from './components/typeahead/EmojiTypeAheadItem';
export {
  selected,
  selectOnHover,
  emojiSprite,
  emojiNode,
  emojiImage,
} from './components/common/styles';
import EmojiResource, {
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
} from './api/EmojiResource';
import EmojiRepository from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';
import { toEmojiId, toOptionalEmojiId } from './util/type-helpers';
import {
  recordSelectionFailedSli,
  recordSelectionSucceededSli,
} from './util/analytics';
import {
  customCategory,
  defaultEmojiHeight,
  emojiPickerWidth,
  emojiPickerHeight,
} from './util/constants';
import { UsageFrequencyTracker } from './api/internal/UsageFrequencyTracker';

export {
  // Classes
  AbstractResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiPicker,
  EmojiUploader,
  EmojiResource,
  EmojiRepository,
  EmojiTypeAhead,
  ResourcedEmoji,
  // functions
  denormaliseEmojiServiceResponse,
  toEmojiId,
  toOptionalEmojiId,
  recordSelectionFailedSli,
  recordSelectionSucceededSli,
  // interfaces
  EmojiProvider,
  UploadingEmojiProvider,
  // Constants
  emojiPickerWidth,
  emojiPickerHeight,
  defaultEmojiHeight,
  customCategory,
  EmojiResourceConfig,
  UsageFrequencyTracker,
  EmojiTypeAheadItem,
};

export {
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
  // Enums
  SearchSort,
} from './types';

export default EmojiPicker;
