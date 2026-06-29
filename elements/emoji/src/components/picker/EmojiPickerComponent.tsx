/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import FeatureGates from '@atlaskit/feature-gate-js-client';
import {
	type SyntheticEvent,
	type MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	createRef,
	memo,
	type MemoExoticComponent,
} from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { getDocument } from '@atlaskit/browser-apis';
import {
	dropTargetForExternal,
	monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { token } from '@atlaskit/tokens';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl';
import { getEmojiVariation } from '../../api/EmojiRepository';
import { type OnEmojiProviderChange, supportsUploadFeature } from '../../api/EmojiResource';
import {
	KeyboardKeys,
	customCategory,
	defaultEmojiPickerSize,
	frequentCategory,
} from '../../util/constants';
import {
	containsEmojiId,
	isPromise /*, isEmojiIdEqual, isEmojiLoaded*/,
	isEmojiDescription,
} from '../../util/type-helpers';
import {
	type EmojiDescription,
	type EmojiId,
	type EmojiSearchResult,
	type EmojiUpload,
	type OnEmojiEvent,
	type OptionalEmojiDescription,
	type OptionalEmojiDescriptionWithVariations,
	type PickerSize,
	type SearchOptions,
	SearchSort,
	SearchSourceTypes,
	type ToneSelection,
} from '../../types';
import { getToneEmoji } from '../../util/filters';
import { uploadEmoji } from '../common/UploadEmoji';
import { createRecordSelectionDefault } from '../common/RecordSelectionDefault';
import type { CategoryId } from './categories';
import CategorySelector from './CategorySelector';
import EmojiPickerFooter from './EmojiPickerFooter';
import {
	EmojiPickerVirtualListInternal as EmojiPickerList,
	type PickerListRef,
} from './EmojiPickerList';
import type { AnalyticsEventPayload, CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
	createAndFireEventInElementsChannel,
	categoryClickedEvent,
	closedPickerEvent,
	deleteBeginEvent,
	deleteCancelEvent,
	deleteConfirmEvent,
	openedPickerEvent,
	pickerClickedEvent,
	pickerSearchedEvent,
	selectedFileEvent,
	uploadBeginButton,
	uploadCancelButton,
	uploadConfirmButton,
	toneSelectorClosedEvent,
	ufoExperiences,
} from '../../util/analytics';
import { useEmoji } from '../../hooks/useEmoji';
import { useIsMounted } from '../../hooks/useIsMounted';
import { messages } from '../i18n';
import {
	defaultProductivityColor,
	getStoredProductivityColor,
	storeProductivityColor,
	type ProductivityColor,
} from '../../util/productivity-colors';
import { filterHiddenEmojis } from '../../util/hidden-emojis';

const isRefreshEmojiPickerEnabled = (): boolean => {
	if (!FeatureGates.initializeCompleted()) {
		return false;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const isEnabled = FeatureGates.getExperimentValue(
		'platform_teamoji_26_refresh_emoji_picker',
		'isEnabled',
		false,
	);

	return isEnabled;
};

const emojiPickerBoxShadow = token('elevation.shadow.overlay');
const emojiPickerHeight = 295;
const emojiPickerHeightWithPreview = 349; // emojiPickerHeight + emojiPickerPreviewHeight;
const emojiPickerHeightWithPreviewNew = 310;
const emojiPickerHeightDeleteRefresh = 339;
const emojiPickerWidth = 350;
const emojiPickerMinHeight = 260;
const heightOffset = 80;

const emojiPicker = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('color.border')} ${token('border.width')} solid`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: emojiPickerBoxShadow,
	height: `${emojiPickerHeight}px`,
	width: `${emojiPickerWidth}px`,
	minWidth: `${emojiPickerWidth}px`,
	maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
	position: 'relative',
});

const emojiPickerNew = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('color.border')} ${token('border.width')} solid`,
	borderRadius: token('radius.large', '8px'),
	boxShadow: emojiPickerBoxShadow,
	height: `${emojiPickerHeight}px`,
	width: `${emojiPickerWidth}px`,
	minWidth: `${emojiPickerWidth}px`,
	maxHeight: 'calc(80vh - 86px)',
	position: 'relative',
});

const emojiPickerWrapper = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	flex: 1,
	minHeight: 0,
	overflow: 'hidden',
});

const withPreviewHeight = cssMap({
	small: {
		height: `${emojiPickerHeightWithPreview}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeightWithPreview + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeightWithPreview + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

const withUploadRefreshHeight = cssMap({
	small: {
		height: `${emojiPickerHeightWithPreviewNew}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeightWithPreviewNew + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeightWithPreviewNew + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

const withDeleteRefreshHeight = cssMap({
	small: {
		height: `${emojiPickerHeightDeleteRefresh}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeightDeleteRefresh + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeightDeleteRefresh + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

const withoutPreviewHeight = cssMap({
	small: {
		height: `${emojiPickerHeight}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeight + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeight + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

const emojiPickerHeightNoResults = 354;
const withNoResultsRefreshHeight = cssMap({
	small: {
		height: `${emojiPickerHeightNoResults}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeightNoResults + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeightNoResults + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

const FREQUENTLY_USED_MAX = 16;

export interface PickerRefHandler {
	(ref: any): any;
}

export interface Props {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	/**
	 * Flag to disable tone selector.
	 */
	hideToneSelector?: boolean;
	/**
	 * Callback performed when picker reference is being set.
	 */
	onPickerRef?: PickerRefHandler;
	/**
	 * Callback to be executed when user selects an emoji.
	 */
	onSelection?: OnEmojiEvent;
	size?: PickerSize;
}

const EmojiPickerComponent = ({
	onSelection,
	onPickerRef,
	hideToneSelector,
	createAnalyticsEvent,
	size = defaultEmojiPickerSize,
}: Props): JSX.Element => {
	const { formatMessage } = useIntl();
	const { emojiProvider, isUploadSupported } = useEmoji();
	const isTeamojiExperimentEnabled = isRefreshEmojiPickerEnabled();
	const [filteredEmojis, setFilteredEmojis] = useState<EmojiDescription[]>([]);
	const [searchEmojis, setSearchEmojis] = useState<EmojiDescription[]>([]);
	const [frequentlyUsedEmojis, setFrequentlyUsedEmojis] = useState<EmojiDescription[]>([]);
	const [query, setQuery] = useState<string>('');
	const [dynamicCategories, setDynamicCategories] = useState<CategoryId[]>([]);
	const [selectedTone, setSelectedTone] = useState(
		!hideToneSelector ? emojiProvider.getSelectedTone() : undefined,
	);
	const [selectedProductivityColor, setSelectedProductivityColor] = useState<ProductivityColor>(
		() => (isTeamojiExperimentEnabled ? getStoredProductivityColor() : defaultProductivityColor),
	);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [selectedEmoji, setSelectedEmoji] = useState<EmojiDescription | undefined>();
	const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
	const [disableCategories, setDisableCategories] = useState(false);
	const [uploadErrorMessage, setUploadErrorMessage] = useState<MessageDescriptor | undefined>();
	const [emojiToDelete, setEmojiToDelete] = useState<EmojiDescription | undefined>();
	const [toneEmoji, setToneEmoji] = useState<OptionalEmojiDescriptionWithVariations | undefined>();

	const emojiPickerList = useMemo(() => createRef<PickerListRef>(), []);
	const openTime = useRef(0);
	const isMounting = useRef(true);
	const lastNonSearchCategory = useRef<CategoryId | null>(activeCategory);
	const previousEmojiProvider = useRef(emojiProvider);
	const isProgrammaticScroll = useRef(false);
	const pickerRef = useRef<HTMLDivElement>(null);
	const setPickerRef = useCallback(
		(el: HTMLDivElement | null) => {
			if (isTeamojiExperimentEnabled) {
				(pickerRef as MutableRefObject<HTMLDivElement | null>).current = el;
			}
			onPickerRef?.(el);
		},
		[isTeamojiExperimentEnabled, onPickerRef],
	);
	const currentUser = useMemo(() => {
		return emojiProvider.getCurrentUser();
	}, [emojiProvider]);
	const isMounted = useIsMounted();

	const fireAnalytics = useCallback(
		(analyticsEvent: AnalyticsEventPayload) => {
			if (createAnalyticsEvent) {
				createAndFireEventInElementsChannel(analyticsEvent)(createAnalyticsEvent);
			}
		},
		[createAnalyticsEvent],
	);

	const onEmojiActive = useCallback(
		(emojiId?: EmojiId, emoji?: EmojiDescription) => {
			if (!selectedEmoji || selectedEmoji.id !== emojiId?.id) {
				setSelectedEmoji(emoji);
			}
		},
		[selectedEmoji],
	);

	const onEmojiLeave = useCallback(() => {
		if (isRefreshEmojiPickerEnabled()) {
			setSelectedEmoji(undefined);
		}
	}, []);

	const onCategoryActivated = useCallback(
		(category: CategoryId | null) => {
			// Ignore scroll-driven category changes while a programmatic reveal()
			// scroll is in progress — they would flicker the indicator through
			// intermediate categories before landing on the correct one.
			if (isProgrammaticScroll.current && isRefreshEmojiPickerEnabled()) {
				return;
			}
			// Ignore scroll-driven category changes while the upload or delete screen is open
			if ((uploading || emojiToDelete) && isRefreshEmojiPickerEnabled()) {
				return;
			}
			if (activeCategory !== category) {
				setActiveCategory(category);
				if (!query && isRefreshEmojiPickerEnabled()) {
					lastNonSearchCategory.current = category;
				}
			}
		},
		[activeCategory, uploading, emojiToDelete, query],
	);

	const calculateElapsedTime = () => {
		return Date.now() - openTime.current;
	};

	const onDynamicCategoryChange = useCallback((categories: CategoryId[]) => {
		setDynamicCategories(categories);
	}, []);

	const onUploadCancelled = useCallback(() => {
		batchedUpdates(() => {
			setUploading(false);
			setUploadErrorMessage(undefined);
		});
		fireAnalytics(uploadCancelButton());
		if (isRefreshEmojiPickerEnabled()) {
			setTimeout(() => {
				getDocument()?.getElementById('add-custom-emoji')?.focus();
			}, 0);
		}
	}, [fireAnalytics]);

	const getDynamicCategories = useCallback((): Promise<CategoryId[]> => {
		if (!emojiProvider.calculateDynamicCategories) {
			return Promise.resolve([]);
		}

		return emojiProvider.calculateDynamicCategories() as Promise<CategoryId[]>;
	}, [emojiProvider]);

	/**
	 * Calculate and set the new state of the component in response to the list of emoji changing for some reason (a search has returned
	 * or the frequently used emoji have updated.)
	 */
	const setStateAfterEmojiChange = useCallback(
		({
			searchQuery,
			emojiToRender,
			searchEmoji,
			frequentEmoji,
		}: {
			emojiToRender?: EmojiDescription[];
			frequentEmoji?: EmojiDescription[];
			searchEmoji?: EmojiDescription[];
			searchQuery?: string;
		}) => {
			// Only enable categories for full emoji list (non-search)
			const disableCategories = !!searchQuery;
			if (!disableCategories && emojiToRender && emojiToRender.length !== filteredEmojis.length) {
				getDynamicCategories().then((categories) => {
					onDynamicCategoryChange(categories);
				});
			}

			if (emojiToRender && !containsEmojiId(emojiToRender, selectedEmoji)) {
				batchedUpdates(() => {
					setSelectedEmoji(undefined);
				});
			}
			batchedUpdates(() => {
				if (emojiToRender) {
					setFilteredEmojis(emojiToRender);
				}

				if (searchEmoji) {
					setSearchEmojis(searchEmoji);
				}

				if (frequentEmoji) {
					setFrequentlyUsedEmojis(frequentEmoji);
				}

				setLoading(false);
				setDisableCategories(disableCategories);
			});
		},
		[filteredEmojis.length, getDynamicCategories, onDynamicCategoryChange, selectedEmoji],
	);

	const onFrequentEmojiResult = useCallback(
		(frequentEmoji: EmojiDescription[]): void => {
			// change the category of each of the featured emoji
			const visibleFrequentEmoji = isTeamojiExperimentEnabled
				? filterHiddenEmojis(frequentEmoji)
				: frequentEmoji;
			const recategorised = visibleFrequentEmoji.map((emoji) => {
				const clone = JSON.parse(JSON.stringify(emoji));
				clone.category = frequentCategory;
				return clone;
			});

			setStateAfterEmojiChange({
				frequentEmoji: recategorised,
			});
		},
		[isTeamojiExperimentEnabled, setStateAfterEmojiChange],
	);

	const onSearchResult = useCallback(
		(searchResults: EmojiSearchResult): void => {
			const frequentlyUsedEmoji = frequentlyUsedEmojis || [];
			const searchQuery = searchResults.query || '';
			const visibleSearchEmojis = isTeamojiExperimentEnabled
				? filterHiddenEmojis(searchResults.emojis)
				: searchResults.emojis;

			/**
			 * If there is no user search in the EmojiPicker then it should display all emoji received from the EmojiRepository and should
			 * also include a special category of most frequently used emoji (if there are any). This method decides if we are in this 'no search'
			 * state and appends the frequent emoji if necessary.
			 */
			let emojiToRender: EmojiDescription[];
			if (!frequentlyUsedEmoji.length || query) {
				emojiToRender = visibleSearchEmojis;
			} else {
				emojiToRender = [...visibleSearchEmojis, ...frequentlyUsedEmoji];
			}

			setStateAfterEmojiChange({
				searchQuery,
				emojiToRender,
				searchEmoji: visibleSearchEmojis,
			});

			fireAnalytics(
				pickerSearchedEvent({
					queryLength: searchQuery.length,
					numMatches: visibleSearchEmojis.length,
				}),
			);
		},
		[
			frequentlyUsedEmojis,
			isTeamojiExperimentEnabled,
			query,
			setStateAfterEmojiChange,
			fireAnalytics,
		],
	);

	const onProviderChange: OnEmojiProviderChange = useMemo(() => {
		return {
			result: onSearchResult,
		};
	}, [onSearchResult]);

	/**
	 * Updates the emoji displayed by the picker. If there is no query specified then we expect to retrieve all emoji for display,
	 * by category, in the picker. This differs from when there is a query in which case we expect to receive a sorted result matching
	 * the search.
	 */
	const updateEmojis = useCallback(
		(query?: string, options?: SearchOptions) => {
			// if the query is empty then we want the emoji to be in service defined order, unless specified otherwise
			// and we want emoji for the 'frequently used' category to be refreshed as well.
			if (!query) {
				if (!options) {
					options = {};
				}

				if (!options.sort) {
					options.sort = SearchSort.None;
				}

				// take a copy of search options so that the frequently used can be limited to 16 without affecting the full emoji query
				const frequentOptions: SearchOptions = {
					...options,
					sort: SearchSort.None,
					limit: FREQUENTLY_USED_MAX,
				};

				emojiProvider.getFrequentlyUsed(frequentOptions).then(onFrequentEmojiResult);
			}
			emojiProvider.filter(query, options);
		},
		[emojiProvider, onFrequentEmojiResult],
	);

	const onToneSelected = useCallback(
		(toneValue: ToneSelection) => {
			emojiProvider.setSelectedTone(toneValue);
			updateEmojis(query, { skinTone: toneValue });
			setSelectedTone(toneValue);
		},
		[emojiProvider, query, updateEmojis],
	);

	const onToneSelectorCancelled = useCallback(() => {
		fireAnalytics(toneSelectorClosedEvent());
	}, [fireAnalytics]);

	const onProductivityColorSelected = useCallback((color: ProductivityColor) => {
		setSelectedProductivityColor(color);
		storeProductivityColor(color);
	}, []);

	const onSelectWrapper = useCallback(
		(emojiId: EmojiId, emoji: OptionalEmojiDescription, event?: SyntheticEvent<any>): void => {
			if (onSelection) {
				onSelection(emojiId, emoji, event);
				fireAnalytics(
					pickerClickedEvent({
						duration: calculateElapsedTime(),
						emojiId: emojiId?.id || '',
						category: (emoji && emoji.category) || '',
						type: (emoji && emoji.type) || '',
						queryLength: (query && query.length) || 0,
					}),
				);
			}
		},
		[fireAnalytics, onSelection, query],
	);

	const onCategorySelected = useCallback(
		(categoryId: CategoryId | null) => {
			if (!categoryId) {
				return;
			}

			// If the upload or delete screen is open, close it when a category is selected
			if (isRefreshEmojiPickerEnabled()) {
				if (uploading) {
					setUploading(false);
					setUploadErrorMessage(undefined);
				}
				if (emojiToDelete) {
					setEmojiToDelete(undefined);
				}
			}

			emojiProvider.findInCategory(categoryId).then((emojisInCategory) => {
				if (!disableCategories) {
					let newSelectedEmoji: EmojiDescription | undefined;
					const visibleEmojisInCategory = isTeamojiExperimentEnabled
						? filterHiddenEmojis(emojisInCategory || [])
						: emojisInCategory || [];
					if (visibleEmojisInCategory.length > 0) {
						newSelectedEmoji = getEmojiVariation(visibleEmojisInCategory[0], {
							skinTone: selectedTone,
						});
					}

					if (emojiPickerList.current) {
						if (isTeamojiExperimentEnabled) {
							isProgrammaticScroll.current = true;
						}
						emojiPickerList.current.reveal(categoryId, isTeamojiExperimentEnabled);
						if (isTeamojiExperimentEnabled) {
							// Clear the flag after the scroll animation has settled.
							setTimeout(() => {
								isProgrammaticScroll.current = false;
							}, 300);
						}
					}

					batchedUpdates(() => {
						setActiveCategory(categoryId);
						setSelectedEmoji(newSelectedEmoji);
					});
					fireAnalytics(categoryClickedEvent({ category: categoryId }));
				}
			});
		},
		[
			disableCategories,
			emojiPickerList,
			emojiProvider,
			fireAnalytics,
			isTeamojiExperimentEnabled,
			selectedTone,
			uploading,
			emojiToDelete,
		],
	);

	const recordUsageOnSelection = useMemo(
		() =>
			createRecordSelectionDefault(emojiProvider, onSelectWrapper, (analytic) =>
				fireAnalytics(analytic(SearchSourceTypes.PICKER)),
			),
		[emojiProvider, fireAnalytics, onSelectWrapper],
	);

	const formattedErrorMessage = useMemo(
		() => (uploadErrorMessage ? <FormattedMessage {...uploadErrorMessage} /> : null),
		[uploadErrorMessage],
	);

	const onFileChooserClicked = useCallback(() => {
		fireAnalytics(selectedFileEvent());
	}, [fireAnalytics]);

	const scrollToTopOfList = useCallback(() => {
		emojiPickerList.current?.scrollToTop();
	}, [emojiPickerList]);

	const onSearch = useCallback(
		(searchQuery: string) => {
			const options = {
				skinTone: selectedTone,
				source: SearchSourceTypes.PICKER,
			};
			if (searchQuery !== query) {
				// Capture the active category before entering search so we can keep it highlighted
				if (!query && searchQuery && isRefreshEmojiPickerEnabled()) {
					lastNonSearchCategory.current = activeCategory;
				}
				setQuery(searchQuery);
			}

			updateEmojis(searchQuery, options);

			if (filteredEmojis.length > 0) {
				// scroll to top when search, which is search results section
				scrollToTopOfList();
			}
		},
		[activeCategory, query, filteredEmojis, selectedTone, updateEmojis, scrollToTopOfList],
	);

	// When the upload screen is open, intercept any file drag at the window level so it
	// cannot reach underlying page drop handlers (e.g. the Confluence editor).
	useEffect(() => {
		if (!uploading || !isRefreshEmojiPickerEnabled()) {
			return;
		}

		const body = getDocument()?.body;
		if (!body) {
			return;
		}

		// Register a full-page drop target on document.body and a monitor using
		// pragmatic-drag-and-drop so that file drops are intercepted before reaching
		// any underlying native DOM handlers (e.g. the Confluence editor).
		// The FileChooser's own drop target (registered on pickerRef) takes priority
		// over the body target for drops inside the picker.
		const cleanup = combine(
			dropTargetForExternal({
				element: body,
				canDrop: containsFiles,
			}),
			monitorForExternal({
				onDragStart: () => preventUnhandled.start(),
				onDrop: () => preventUnhandled.stop(),
			}),
		);

		return () => {
			preventUnhandled.stop();
			cleanup();
		};
	}, [uploading]);

	const onOpenUpload = useCallback(() => {
		// Prime upload token so it's ready when the user adds
		if (supportsUploadFeature(emojiProvider)) {
			emojiProvider.prepareForUpload();
		}
		batchedUpdates(() => {
			setUploadErrorMessage(undefined);
			setUploading(true);
		});
		fireAnalytics(uploadBeginButton());
	}, [emojiProvider, fireAnalytics]);

	const scrollToUploadedEmoji = useCallback(
		(emojiDescription: EmojiDescription) => {
			if (emojiPickerList.current) {
				// Wait a tick to ensure repaint and updated height for picker list
				window.setTimeout(() => {
					emojiPickerList.current?.scrollToRecentlyUploaded(emojiDescription, false);
				}, 0);
			}
		},
		[emojiPickerList],
	);

	const onUploadEmoji = useCallback(
		async (upload: EmojiUpload, retry: boolean) => {
			fireAnalytics(uploadConfirmButton({ retry }));
			const errorSetter = (message?: MessageDescriptor) => {
				setUploadErrorMessage(message);
			};
			const onSuccess = (emojiDescription: EmojiDescription) => {
				batchedUpdates(() => {
					setActiveCategory(customCategory);
					setSelectedEmoji(emojiDescription);
					setUploading(false);
				});
				scrollToUploadedEmoji(emojiDescription);
			};

			if (isRefreshEmojiPickerEnabled()) {
				const uploadShortName = `:${upload.name.toLowerCase()}:`;
				const existing = await emojiProvider.findByShortName(uploadShortName);
				if (existing) {
					errorSetter(messages.emojiDuplicateName);
					return;
				}
			}

			uploadEmoji(upload, emojiProvider, errorSetter, onSuccess, fireAnalytics, retry);
		},
		[emojiProvider, fireAnalytics, scrollToUploadedEmoji],
	);

	const onTriggerDelete = useCallback(
		(_emojiId?: EmojiId, emoji?: EmojiDescription) => {
			if (_emojiId) {
				fireAnalytics(deleteBeginEvent({ emojiId: _emojiId.id }));
				setEmojiToDelete(emoji);
			}
		},
		[fireAnalytics],
	);

	const onCloseDelete = useCallback(() => {
		fireAnalytics(
			deleteCancelEvent({
				emojiId: emojiToDelete && emojiToDelete.id,
			}),
		);
		setEmojiToDelete(undefined);
	}, [emojiToDelete, fireAnalytics]);

	const onDeleteEmoji = useCallback(
		(emoji: EmojiDescription): Promise<boolean> => {
			fireAnalytics(
				deleteConfirmEvent({
					emojiId: emojiToDelete && emojiToDelete.id,
				}),
			);
			return emojiProvider.deleteSiteEmoji(emoji).then((success) => {
				if (success) {
					updateEmojis(query, { skinTone: selectedTone });
				}
				return success;
			});
		},
		[emojiProvider, emojiToDelete, fireAnalytics, query, selectedTone, updateEmojis],
	);

	const onComponentDidMount = useCallback(() => {
		emojiProvider.subscribe(onProviderChange);
		onSearch(query);
		if (!hideToneSelector) {
			const toneEmoji = getToneEmoji(emojiProvider);
			if (isPromise<OptionalEmojiDescriptionWithVariations>(toneEmoji)) {
				toneEmoji.then((emoji) => setToneEmoji(emoji));
			} else if (toneEmoji === undefined || isEmojiDescription(toneEmoji)) {
				setToneEmoji(toneEmoji);
			}
		}
	}, [emojiProvider, hideToneSelector, onProviderChange, onSearch, query]);

	if (isMounting.current) {
		// componentWillMount equivalent
		ufoExperiences['emoji-picker-opened'].success();
		openTime.current = Date.now();
		fireAnalytics(openedPickerEvent());
		isMounting.current = false;
	}

	// stop all key propagation to other event listeners
	const suppressKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Allow escape key to propagate so parent components can handle it (behind feature gate)
		if (e.key === 'Escape' || e.key === 'Esc') {
			return;
		}

		e.stopPropagation();
		// We prevent default for enter keypresses
		// since products like Bitbucket might have parent forms
		// that listen for keydown events to trigger form submission
		// https://product-fabric.atlassian.net/browse/ED-19532
		if (e.key === KeyboardKeys.Enter) {
			e.preventDefault();
		}
	};

	useEffect(() => {
		// componentDidMount logic
		if (!isMounted) {
			onComponentDidMount();
		}
	}, [onComponentDidMount, isMounted]);

	useEffect(() => {
		previousEmojiProvider.current.unsubscribe(onProviderChange);
		previousEmojiProvider.current = emojiProvider;

		emojiProvider.subscribe(onProviderChange);

		return () => {
			emojiProvider.unsubscribe(onProviderChange);
		};
	}, [emojiProvider, onProviderChange]);

	useEffect(() => {
		if (!frequentlyUsedEmojis.length || query) {
			setFilteredEmojis(searchEmojis);
		} else {
			setFilteredEmojis([...searchEmojis, ...frequentlyUsedEmojis]);
		}
	}, [frequentlyUsedEmojis, query, searchEmojis]);

	useEffect(() => {
		// Fire analytics on component unmount
		return () => {
			fireAnalytics(closedPickerEvent({ duration: calculateElapsedTime() }));
			ufoExperiences['emoji-picker-opened'].abort({
				metadata: {
					source: 'EmojiPickerComponent',
					reason: 'unmount',
				},
			});
			ufoExperiences['emoji-searched'].abort({
				metadata: {
					source: 'EmojiPickerComponent',
					reason: 'unmount',
				},
			});
		};
	}, [fireAnalytics]);

	useEffect(() => {
		// Unsubscribe emojiProvider on component unmount
		return () => {
			emojiProvider.unsubscribe(onProviderChange);
		};
	}, [emojiProvider, onProviderChange]);

	const uploadEnabled = isUploadSupported && !uploading;
	const showPreview = isRefreshEmojiPickerEnabled() ? !uploading : selectedEmoji && !uploading;
	const shouldRenderFooter =
		showPreview &&
		!(emojiToDelete && isRefreshEmojiPickerEnabled()) &&
		!(query && filteredEmojis.length === 0 && isRefreshEmojiPickerEnabled()) &&
		(Boolean(selectedEmoji) || uploadEnabled || !isRefreshEmojiPickerEnabled());
	const useFooterSpaceForList =
		showPreview &&
		!selectedEmoji &&
		!uploadEnabled &&
		!emojiToDelete &&
		!(query && filteredEmojis.length === 0) &&
		isRefreshEmojiPickerEnabled();

	return (
		<div
			css={[
				isRefreshEmojiPickerEnabled() ? emojiPickerNew : emojiPicker,
				!!emojiToDelete && isRefreshEmojiPickerEnabled()
					? withDeleteRefreshHeight[size]
					: uploading && isRefreshEmojiPickerEnabled()
						? withUploadRefreshHeight[size]
						: query && filteredEmojis.length === 0 && isRefreshEmojiPickerEnabled()
							? withNoResultsRefreshHeight[size]
							: showPreview
								? withPreviewHeight[size]
								: withoutPreviewHeight[size],
			]}
			ref={setPickerRef}
			data-emoji-picker-container
			role="dialog"
			aria-label={formatMessage(messages.emojiPickerTitle)}
			aria-modal={true}
		>
			<div
				role="presentation"
				onKeyPress={suppressKeyPress}
				onKeyUp={suppressKeyPress}
				onKeyDown={suppressKeyPress}
				css={emojiPickerWrapper}
			>
				<CategorySelector
					activeCategoryId={
						(uploading || emojiToDelete) && isRefreshEmojiPickerEnabled() ? null : activeCategory
					}
					dynamicCategories={dynamicCategories}
					disableCategories={disableCategories}
					onCategorySelected={onCategorySelected}
				/>
				<EmojiPickerList
					emojis={filteredEmojis}
					currentUser={currentUser}
					onEmojiSelected={recordUsageOnSelection}
					onEmojiActive={onEmojiActive}
					onEmojiLeave={onEmojiLeave}
					onEmojiDelete={onTriggerDelete}
					onCategoryActivated={onCategoryActivated}
					onSearch={onSearch}
					query={query}
					selectedTone={selectedTone}
					selectedProductivityColor={
						isTeamojiExperimentEnabled ? selectedProductivityColor : undefined
					}
					loading={loading}
					ref={emojiPickerList}
					initialUploadName={query}
					onToneSelected={onToneSelected}
					onToneSelectorCancelled={onToneSelectorCancelled}
					onProductivityColorSelected={
						isTeamojiExperimentEnabled ? onProductivityColorSelected : undefined
					}
					toneEmoji={toneEmoji}
					uploading={uploading}
					emojiToDelete={emojiToDelete}
					uploadErrorMessage={formattedErrorMessage}
					uploadEnabled={uploadEnabled}
					onUploadEmoji={onUploadEmoji}
					onUploadCancelled={onUploadCancelled}
					onDeleteEmoji={onDeleteEmoji}
					onCloseDelete={onCloseDelete}
					onFileChooserClicked={onFileChooserClicked}
					onOpenUpload={onOpenUpload}
					size={size}
					activeCategoryId={activeCategory}
					useFooterSpaceForList={useFooterSpaceForList}
				/>
				{shouldRenderFooter && (
					<EmojiPickerFooter
						selectedEmoji={selectedEmoji}
						uploadEnabled={uploadEnabled}
						onOpenUpload={onOpenUpload}
					/>
				)}
			</div>
		</div>
	);
};

const _default_1: MemoExoticComponent<
	({ onSelection, onPickerRef, hideToneSelector, createAnalyticsEvent, size }: Props) => JSX.Element
> = memo(EmojiPickerComponent);
export default _default_1;
