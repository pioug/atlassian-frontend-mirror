import { PureComponent } from 'react';
import type { GlyphProps } from '@atlaskit/icon/types';

export default class extends PureComponent<Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>> {}