import React, { FC } from 'react';
export declare type Sizes = 'small' | 'medium' | 'large' | 'xlarge';
export declare const size: {};
export interface IconProps {
    /** This is for internal use only in this package. If you want to use prop please consider using the
     * @atlaskit/icon package  */
    dangerouslySetGlyph?: string;
    /** String to use as the aria-label for the icon. Set to an empty string if you are rendering the icon with visible text to prevent accessibility label duplication. */
    label: string;
    /** Control the size of the icon */
    size?: Sizes;
}
interface IconWrapperProps {
    size: Sizes;
    primaryColor?: string;
    secondaryColor?: string;
}
export declare const IconWrapper: import("styled-components").StyledComponentClass<React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & IconWrapperProps, any, React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & IconWrapperProps>;
declare const Icon: FC<IconProps>;
export default Icon;
