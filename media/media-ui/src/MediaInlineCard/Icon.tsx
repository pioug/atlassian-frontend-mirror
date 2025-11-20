import React from 'react';
import { Icon as CompiledIcon } from './Icon-compiled';
import { AKIconWrapper as CompiledAKIconWrapper } from './Icon-compiled';

export const Icon = (
	props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
): React.JSX.Element => <CompiledIcon {...props} />;

export const AKIconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledAKIconWrapper {...props} />;
