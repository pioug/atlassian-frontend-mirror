import React from 'react';

import { SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { UserAttributes } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

// Test data for different scenarios
const fullUserAttributes = {
	role: 'Frontend Developer (React/TypeScript)',
	department: 'Engineering-Atlassian Home',
	location: 'India',
	pronouns: 'he/him',
};

const partialUserAttributes = {
	role: 'Product Manager',
	location: 'San Francisco, CA',
};

const longTextUserAttributes = {
	role: 'Senior Software Engineer - Full Stack Development',
	department: 'Engineering - Platform & Infrastructure Team',
	location: 'Sydney, New South Wales, Australia',
	pronouns: 'she/her/hers',
};

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: getContext() }}>
				{/* Test different sizes with full user attributes */}
				<h5>All Sizes - Full User Attributes</h5>
				{Object.values(SmartLinkSize).map((size, idx) => (
					<React.Fragment key={idx}>
						<h6>Size: {size}</h6>
						<HorizontalWrapper>
							<FlexibleCardContext.Provider
								value={{ data: getContext({ userAttributes: fullUserAttributes }) }}
							>
								<UserAttributes size={size} testId={`vr-test-user-attributes-full-${size}`} />
							</FlexibleCardContext.Provider>
						</HorizontalWrapper>
					</React.Fragment>
				))}

				{/* Test partial user attributes */}
				<h5>Partial User Attributes (Role + Location)</h5>
				<HorizontalWrapper>
					<FlexibleCardContext.Provider
						value={{ data: getContext({ userAttributes: partialUserAttributes }) }}
					>
						<UserAttributes testId="vr-test-user-attributes-partial" />
					</FlexibleCardContext.Provider>
				</HorizontalWrapper>

				{/* Test long text */}
				<h5>Long Text Attributes</h5>
				<HorizontalWrapper>
					<FlexibleCardContext.Provider
						value={{ data: getContext({ userAttributes: longTextUserAttributes }) }}
					>
						<UserAttributes testId="vr-test-user-attributes-long-text" />
					</FlexibleCardContext.Provider>
				</HorizontalWrapper>

				{/* Test empty state */}
				<h5>Empty State (No userAttributes)</h5>
				<HorizontalWrapper>
					<UserAttributes testId="vr-test-user-attributes-empty" />
				</HorizontalWrapper>
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
