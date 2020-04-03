import React, { ReactElement } from 'react';
import { sizeOpts } from '../types';
interface WrapperProps {
    primaryColor?: string;
    secondaryColor?: string;
    size?: sizeOpts;
}
export declare const IconWrapper: import("styled-components").StyledComponentClass<React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & WrapperProps, any, React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & WrapperProps>;
export interface IconProps {
    /**
     * String to use as the aria-label for the icon.
     * **Use an empty string when you already have readable text around the icon,
     * like text inside a button**!
     */
    label: string;
    /**
     * Glyph to show by Icon component (not required when you import a glyph directly).
     * Please ensure you have a stable reference.
     */
    glyph?: (props: {
        role: string;
    }) => ReactElement;
    /**
     * More performant than the glyph prop,
     * but potentially dangerous if the SVG string hasn't been "sanitised"
     */
    dangerouslySetGlyph?: string;
    /**
     * For primary colour for icons.
     */
    primaryColor?: string;
    /**
     * For secondary colour for 2-color icons.
     * Set to inherit to control this via "fill" in CSS
     */
    secondaryColor?: string;
    /**
     * Control the size of the icon.
     */
    size?: sizeOpts;
    /**
     * A `testId` prop is provided for specified elements,
     * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
     * serving as a hook for automated tests.
     */
    testId?: string;
}
declare const Icon: (props: IconProps) => JSX.Element;
export default Icon;
