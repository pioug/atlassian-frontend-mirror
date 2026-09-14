import { AbstractResource } from '@atlaskit/util-service-support';

import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPicker from './components/picker/EmojiPicker';
import { preloadEmojiPicker } from './components/picker/preloadEmojiPicker';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiTypeAheadItem from './components/typeahead/EmojiTypeAheadItem';
import EmojiUploader from './components/uploader/EmojiUploader';
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
import EmojiLoader from './api/EmojiLoader';
import EmojiRepository from './api/EmojiRepository';
import { denormaliseEmojiServiceResponse } from './api/denormaliseEmojiServiceResponse';
import { recordSelectionFailedSli } from './util/analytics/recordSelectionFailedSli';
import { recordSelectionSucceededSli } from './util/analytics/recordSelectionSucceededSli';
import type { WithSamplingUFOExperience } from './util/analytics/samplingUfo';
import { ufoExperiences } from './util/analytics/ufoExperiences';
import { withSampling } from './util/analytics/withSampling';
import { toEmojiId } from './util/to-emoji-id';
import { toOptionalEmojiId } from './util/to-optional-emoji-id';
import {
	customCategory,
	defaultEmojiHeight,
	defaultDenseEmojiHeight,
	scaledEmojiHeightH1,
	scaledEmojiHeightH2,
	scaledEmojiHeightH3,
	scaledEmojiHeightH4,
	denseEmojiHeightH1,
	denseEmojiHeightH2,
	denseEmojiHeightH3,
	denseEmojiHeightH4,
	emojiPickerWidth,
	emojiPickerHeight,
} from './util/constants';
import { UsageFrequencyTracker } from './api/internal/UsageFrequencyTracker';
import { EmojiCommonProvider } from './context/EmojiCommonProvider';
import { EmojiContextProvider } from './context/EmojiContextProvider';
import { useEmoji } from './hooks/useEmoji';
import { useEmojiContext } from './hooks/useEmojiContext';

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
	preloadEmojiPicker,
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
	defaultDenseEmojiHeight,
	scaledEmojiHeightH1,
	scaledEmojiHeightH2,
	scaledEmojiHeightH3,
	scaledEmojiHeightH4,
	denseEmojiHeightH1,
	denseEmojiHeightH2,
	denseEmojiHeightH3,
	denseEmojiHeightH4,
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
