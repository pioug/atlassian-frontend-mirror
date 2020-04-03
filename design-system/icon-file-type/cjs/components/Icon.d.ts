import { Component } from 'react';
interface Props {
    /** More performant than the glyph prop, but potentially dangerous if the SVG string hasn't
     been "sanitised" */
    dangerouslySetGlyph?: string;
    /** String to use as the aria-label for the icon. Set to an empty string if you are rendering the icon with visible text to prevent accessibility label duplication. */
    label: string;
    /** Control the size of the icon */
    size?: 'small' | 'medium' | 'xlarge';
}
export default class Icon extends Component<Props> {
    render(): JSX.Element;
}
export declare const size: {};
export {};
