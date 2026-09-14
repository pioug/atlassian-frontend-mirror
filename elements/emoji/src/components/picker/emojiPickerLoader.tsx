/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import type { Props as ComponentProps } from './EmojiPickerComponent';
import { emojiPickerModuleLoader } from './emojiPickerModuleLoader';

export const emojiPickerLoader: () => Promise<
	React.ComponentType<React.PropsWithChildren<ComponentProps>>
> = () => emojiPickerModuleLoader().then((module) => module.default);
