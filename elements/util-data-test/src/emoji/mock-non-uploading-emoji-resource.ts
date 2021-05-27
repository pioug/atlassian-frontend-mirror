import { AbstractResource } from '@atlaskit/util-service-support';

import { EmojiProvider, EmojiRepository } from '@atlaskit/emoji/resource';

import {
  EmojiDescription,
  EmojiId,
  EmojiSearchResult,
  OptionalEmojiDescription,
  SearchOptions,
  ToneSelection,
  User,
  OptionalUser,
  CategoryId,
} from '@atlaskit/emoji/types';

import { MockEmojiResourceConfig, PromiseBuilder } from './types';
import { selectedToneStorageKey } from '../emoji-constants';

export class MockNonUploadingEmojiResource
  extends AbstractResource<
    string,
    EmojiSearchResult,
    any,
    undefined,
    SearchOptions
  >
  implements EmojiProvider {
  protected emojiRepository: EmojiRepository;
  protected promiseBuilder: PromiseBuilder<any>;
  protected lastQuery: string = '';
  protected selectedTone: ToneSelection;
  protected optimisticRendering?: boolean;
  protected currentUser?: User;

  recordedSelections: EmojiDescription[] = [];

  constructor(emojiService: EmojiRepository, config?: MockEmojiResourceConfig) {
    super();
    this.currentUser = (config && config.currentUser) || undefined;
    this.emojiRepository = emojiService;
    this.promiseBuilder = result => Promise.resolve(result);
    if (config) {
      if (config.promiseBuilder) {
        this.promiseBuilder = config.promiseBuilder;
      }
      this.optimisticRendering = config.optimisticRendering;
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTone = window.localStorage.getItem(selectedToneStorageKey);
      this.selectedTone = storedTone ? parseInt(storedTone, 10) : undefined;
    }
  }

  getCurrentUser(): OptionalUser {
    return this.currentUser;
  }

  filter(query?: string, options?: SearchOptions) {
    if (query) {
      this.lastQuery = query;
    } else {
      this.lastQuery = '';
    }

    this.promiseBuilder(
      this.emojiRepository.search(query, options),
      'filter',
    ).then((result: EmojiSearchResult) => {
      this.notifyResult(result);
    });
  }

  findByShortName(shortName: string): Promise<OptionalEmojiDescription> {
    const emoji = this.emojiRepository.findByShortName(shortName);
    return this.promiseBuilder(emoji, 'findByShortName');
  }

  findByEmojiId(
    emojiId: EmojiId,
  ): Promise<OptionalEmojiDescription> | OptionalEmojiDescription {
    const { id, shortName } = emojiId;
    if (id) {
      const emoji = this.emojiRepository.findById(id);
      return this.promiseBuilder(emoji, 'findByEmojiId');
    }
    return this.emojiRepository.findByShortName(shortName);
  }

  findById(id: string): Promise<OptionalEmojiDescription> {
    const emoji = this.emojiRepository.findById(id);
    return this.promiseBuilder(emoji, 'findById');
  }

  findInCategory(categoryId: CategoryId): Promise<EmojiDescription[]> {
    const emojis = this.emojiRepository.findInCategory(categoryId);
    return this.promiseBuilder(emojis, 'findInCategory');
  }

  getAsciiMap(): Promise<Map<string, EmojiDescription>> {
    return this.promiseBuilder(
      this.emojiRepository.getAsciiMap(),
      'getAsciiMap',
    );
  }

  async getFrequentlyUsed(
    options?: SearchOptions,
  ): Promise<EmojiDescription[]> {
    return this.promiseBuilder(
      this.emojiRepository.getFrequentlyUsed(options),
      'getFrequentlyUsed',
    );
  }

  recordSelection?(emoji: EmojiDescription): Promise<any> {
    this.recordedSelections.push(emoji);
    this.emojiRepository.used(emoji);
    return this.promiseBuilder(undefined, 'recordSelection');
  }

  deleteSiteEmoji(emoji: EmojiDescription): Promise<boolean> {
    this.emojiRepository.delete(emoji);
    this.filter(this.lastQuery);
    return this.promiseBuilder(true, 'deleteSiteEmoji');
  }

  loadMediaEmoji(
    emoji: EmojiDescription,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    return emoji;
  }

  optimisticMediaRendering(emoji: EmojiDescription) {
    return emoji && !!this.optimisticRendering;
  }

  getSelectedTone(): ToneSelection {
    return this.selectedTone;
  }

  setSelectedTone(tone: ToneSelection) {
    this.selectedTone = tone;
    if (window.localStorage) {
      try {
        window.localStorage.setItem(
          selectedToneStorageKey,
          tone ? tone.toString() : '',
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('failed to store selected emoji skin tone', e);
      }
    }
  }

  calculateDynamicCategories(): Promise<string[]> {
    if (!this.emojiRepository) {
      return Promise.resolve([]);
    }
    return Promise.resolve(this.emojiRepository.getDynamicCategoryList());
  }
}
