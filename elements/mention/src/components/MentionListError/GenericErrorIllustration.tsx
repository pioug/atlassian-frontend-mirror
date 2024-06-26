/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { GenericErrorVisualStyle } from './styles';

export interface Props {
	title?: string;
}

export class GenericErrorIllustration extends React.PureComponent<Props, {}> {
	render() {
		return (
			<GenericErrorVisualStyle>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163.3 212" aria-labelledby="title">
					<defs>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766 */}
						<style
							dangerouslySetInnerHTML={{
								__html:
									'.cls-1{fill:url(#linear-gradient);}.cls-2,.cls-5{opacity:0.6;}.cls-3{fill:#c1c7d0;}.cls-4{fill:#b3bac5;}.cls-5{isolation:isolate;}',
							}}
						/>
						<linearGradient
							id="linear-gradient"
							x1="25.54"
							y1="806.64"
							x2="137.75"
							y2="694.44"
							gradientTransform="translate(0 -578)"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset={0} stopColor="#c1c7d0" />
							<stop offset="0.24" stopColor="#c4cad2" stopOpacity="0.97" />
							<stop offset="0.5" stopColor="#cdd1d9" stopOpacity="0.89" />
							<stop offset="0.78" stopColor="#dcdee4" stopOpacity="0.75" />
							<stop offset={1} stopColor="#ebecf0" stopOpacity="0.6" />
						</linearGradient>
					</defs>
					<title>{this.props.title ? this.props.title : 'Generic Error'}</title>
					<g data-name="Layer 2">
						<g data-name="Layer 1-2">
							<path
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="cls-1"
								d="M94.8,74.2l66.4,115.1a15.16,15.16,0,0,1-5.5,20.7,15.4,15.4,0,0,1-7.6,2H15.2A15.19,15.19,0,0,1,0,196.8a15.4,15.4,0,0,1,2-7.6l66.5-115a15.21,15.21,0,0,1,20.7-5.6A15.81,15.81,0,0,1,94.8,74.2Zm-7.6,83.5,2.9-44.3a9.26,9.26,0,0,0-8.6-9.8h-.6a9.18,9.18,0,0,0-9.2,9.2v.6l2.9,44.3a6.33,6.33,0,0,0,6.3,5.9h0A6.26,6.26,0,0,0,87.2,157.7ZM71.4,181.2a9.5,9.5,0,0,0,9.4,9.6h.9a9.79,9.79,0,0,0,8.8-10.5,9.69,9.69,0,0,0-9.7-8.8A9.58,9.58,0,0,0,71.4,181.2Z"
							/>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
							<g className="cls-2">
								<path
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="cls-3"
									d="M92.7,27.2,85.3.4a.57.57,0,0,0-.7-.4c-.2.1-.4.2-.4.5L79.5,25.6l-5.8-1.1c-.3-.1-.6.2-.7.5v.3L80.3,52a.75.75,0,0,0,.7.5.82.82,0,0,0,.5-.5l4.7-25.1,5.8,1c.3.1.6-.2.7-.5Z"
								/>
								<path
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="cls-3"
									d="M66.1,41.8,55.2,33.2a.3.3,0,0,0-.4,0,.19.19,0,0,0,0,.3L60.4,45l-2.7,1.3c-.1.1-.2.2-.1.4a.1.1,0,0,0,.1.1l10.9,8.5a.3.3,0,0,0,.4,0,.19.19,0,0,0,0-.3L63.4,43.6l2.7-1.3a.33.33,0,0,0,0-.5Z"
								/>
							</g>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<g className="cls-2">
								<path
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="cls-4"
									d="M102.1,56.8a1.42,1.42,0,0,1-.6-.2,1,1,0,0,1-.3-1.2c-.2-.8-2.3-2.8-3.5-4.1-3-3-4.9-5-3.8-6.5s3.6-.2,7.3,1.7a28.41,28.41,0,0,0,4.5,2,21.58,21.58,0,0,0-3.3-3.6c-3-3-4.9-5-3.8-6.5s3.6-.2,7.4,1.7a27.65,27.65,0,0,0,4.4,2,21.58,21.58,0,0,0-3.3-3.6c-3-3-4.9-5-3.8-6.5s3.6-.2,7.3,1.7c1.6.8,4.2,2.1,5,2.1a.91.91,0,0,1,1.2,0,1.08,1.08,0,0,1,.2,1.4c-1.1,1.5-3.6.2-7.3-1.7a27.65,27.65,0,0,0-4.4-2,21.58,21.58,0,0,0,3.3,3.6c3,3,4.9,5,3.8,6.5s-3.6.2-7.3-1.7a28.41,28.41,0,0,0-4.5-2,21.58,21.58,0,0,0,3.3,3.6c3,3,4.9,5,3.8,6.5s-3.6.2-7.3-1.7a28.41,28.41,0,0,0-4.5-2,21.58,21.58,0,0,0,3.3,3.6c3,3,4.9,5,3.8,6.5A1.8,1.8,0,0,1,102.1,56.8Z"
								/>
							</g>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<g className="cls-5">
								<path
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="cls-4"
									d="M107.7,71.1a1.05,1.05,0,0,1-.9-.5c-1-1.9-2.2-4-.9-5.2s3.3.2,5.5,1.6a19.31,19.31,0,0,0,2.9,1.7,15.89,15.89,0,0,0-1.4-3.1c-1.3-2.3-2.5-4.4-1.1-5.6s3.3.2,5.5,1.6c1,.6,2.5,1.7,3.1,1.7a1,1,0,0,1,1.3.1,1,1,0,0,1-.1,1.4c-1.3,1.2-3.3-.2-5.5-1.6a19.31,19.31,0,0,0-2.9-1.7,13.64,13.64,0,0,0,1.4,3.1c1.3,2.3,2.4,4.4,1.1,5.6s-3.3-.2-5.5-1.6a19.31,19.31,0,0,0-2.9-1.7,13.07,13.07,0,0,0,1.2,2.7,1,1,0,0,1-.4,1.4A.6.6,0,0,1,107.7,71.1Zm12.5-7.6Z"
								/>
							</g>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<g className="cls-5">
								<path
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="cls-4"
									d="M53.4,68.1a2,2,0,0,1-.7-.1c-1.6-.7-1.2-3.1-.8-5.6a10.87,10.87,0,0,0,.3-3.4A15,15,0,0,0,50,61.6c-1.5,2.1-3,4.1-4.6,3.4a1,1,0,0,1-.5-1.3,1,1,0,0,1,1.2-.6,11.23,11.23,0,0,0,2.3-2.7c1.5-2.1,3-4.1,4.7-3.4s1.3,3.1.8,5.7a13.86,13.86,0,0,0-.3,3.3,11.82,11.82,0,0,0,2.1-2.6c1.5-2.1,3-4.1,4.7-3.4s1.2,3.1.9,5.2a1,1,0,1,1-1.9-.3,14.28,14.28,0,0,0,.3-2.9,15,15,0,0,0-2.2,2.6C56,66.4,54.7,68.1,53.4,68.1Z"
								/>
							</g>
						</g>
					</g>
				</svg>
			</GenericErrorVisualStyle>
		);
	}
}
