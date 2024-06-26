/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

const style = `
.cls-1{fill:url(#linear-gradient);}
.cls-2{fill:#253858;}
.cls-3{fill:#ffc400;}
.cls-4{fill:#ffab00;}
.cls-5,.cls-6{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;}
.cls-5{stroke:#344563;}
.cls-6{stroke:#5e6c84;}
`;

export const errorIcon = (
	<svg viewBox="0 0 163.28 218">
		<defs>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766 */}
			<style>{style}</style>
			<linearGradient
				id="linear-gradient"
				x1="133.86"
				y1="136.43"
				x2="-2.79"
				y2="200.15"
				gradientUnits="userSpaceOnUse"
			>
				{/* TODO https://product-fabric.atlassian.net/browse/DSP-6955 */}
				<stop offset="0" stopColor="#ffd740" />
				<stop offset="1" stopColor="#ffab00" />
			</linearGradient>
			<clipPath>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-1"
					d="M94.78,80.16l66.44,115.08A15.17,15.17,0,0,1,148.08,218H15.2A15.17,15.17,0,0,1,2.06,195.24L68.5,80.16A15.17,15.17,0,0,1,94.78,80.16Z"
				/>
			</clipPath>
		</defs>
		<g>
			<g>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-1"
					d="M94.78,80.16l66.44,115.08A15.17,15.17,0,0,1,148.08,218H15.2A15.17,15.17,0,0,1,2.06,195.24L68.5,80.16A15.17,15.17,0,0,1,94.78,80.16Z"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-2"
					d="M87.22,163.71l2.88-44.35a9.18,9.18,0,0,0-9.16-9.78h0a9.18,9.18,0,0,0-9.16,9.78l2.88,44.35a6.3,6.3,0,0,0,6.28,5.89h0A6.3,6.3,0,0,0,87.22,163.71Z"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-2"
					d="M71.38,187.25a9.53,9.53,0,0,0,10.39,9.58,9.68,9.68,0,0,0-.9-19.32A9.64,9.64,0,0,0,71.38,187.25Z"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-3"
					d="M91.7,27.17,84.29.45A.61.61,0,0,0,83.1.5L78.44,25.6l-5.8-1.08a.61.61,0,0,0-.7.76L79.35,52A.61.61,0,0,0,80.54,52l4.66-25.1L91,27.93A.61.61,0,0,0,91.7,27.17Z"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-4"
					d="M65.12,41.81,54.24,33.26a.27.27,0,0,0-.41.33L59.36,45,56.7,46.31a.27.27,0,0,0,0,.45l10.87,8.55a.27.27,0,0,0,.41-.33L62.41,43.55l2.66-1.29A.27.27,0,0,0,65.12,41.81Z"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-5"
					d="M115.15,36.6c-1.17,1.59-11-5.6-12.16-4s8.66,8.79,7.5,10.39-11-5.6-12.17-4,8.66,8.79,7.49,10.39-11-5.6-12.17-4,8.66,8.79,7.49,10.39"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-6"
					d="M119.92,64.19c-1.46,1.33-7.05-4.78-8.51-3.44s4.13,7.45,2.67,8.78-7.05-4.78-8.51-3.44c-.68.62.16,2.27,1.11,4"
				/>
				<path
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="cls-6"
					d="M44.8,64c1.82.77,5-6.87,6.86-6.1s-1.39,8.4.43,9.17,5-6.87,6.86-6.1c.85.36.61,2.19.29,4.13"
				/>
			</g>
		</g>
	</svg>
);
