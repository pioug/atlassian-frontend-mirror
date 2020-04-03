/// <reference types="react" />
import { sizeOpts } from '../types';
declare type Props = {
    color?: string;
    size?: sizeOpts;
    weight?: 'normal' | 'strong';
};
declare const Skeleton: import("styled-components").StyledComponentClass<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & Props, any, import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & Props>;
export default Skeleton;
