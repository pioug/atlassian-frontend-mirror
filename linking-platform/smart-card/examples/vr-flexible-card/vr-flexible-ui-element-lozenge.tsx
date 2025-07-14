/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { DueOn, State } from '../../src/view/FlexibleCard/components/elements';
import { type LozengeAppearance } from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper, LozengeActionExample } from '../utils/vr-test';
import '../utils/fetch-mock-invoke';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	dueOn: '2020-02-04T12:40:12.353+0800',
	state: { text: 'State' },
});
const content = ['Short', 'Very long text, longer than long, long, long'];
const appearances: LozengeAppearance[] = [
	'default',
	'inprogress',
	'moved',
	'new',
	'removed',
	'success',
];
const overrideCss = css({
	textDecoration: 'line-through',
});

export default () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<FlexibleCardContext.Provider value={{ data: context }}>
					<HorizontalWrapper>
						{appearances.map((appearance: LozengeAppearance, idx: number) => (
							<State
								key={idx}
								text={appearance as string}
								appearance={appearance}
								testId="vr-test-lozenge"
							/>
						))}
					</HorizontalWrapper>
					<HorizontalWrapper>
						{content.map((text: string, idx: number) => (
							<State key={idx} text={text} appearance="default" testId="vr-test-lozenge" />
						))}
					</HorizontalWrapper>
					<HorizontalWrapper>
						<DueOn />
					</HorizontalWrapper>
					<h5>Override CSS</h5>
					<State appearance="moved" css={overrideCss} text="override" />
					<h5>Action</h5>
					<div>
						<State action={LozengeActionExample} text="To Do" testId="vr-test-lozenge-action" />
					</div>
					<br />
				</FlexibleCardContext.Provider>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
