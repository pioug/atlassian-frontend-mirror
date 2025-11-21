import React from 'react';

import { ErrorMessage, HelperMessage, MessageWrapper, ValidMessage } from '@atlaskit/form';
import Link from '@atlaskit/link';
import Lozenge from '@atlaskit/lozenge';

export default function MessagesExample(): React.JSX.Element {
	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div data-testid="messages--short" style={{ width: 'max-content' }}>
				<MessageWrapper>
					<HelperMessage testId="helper">This is a help message.</HelperMessage>
					<ErrorMessage testId="error">This is an error message.</ErrorMessage>
					<ValidMessage testId="valid">This is a success message.</ValidMessage>
				</MessageWrapper>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div data-testid="messages--long" style={{ maxWidth: 240 }}>
				<MessageWrapper>
					<HelperMessage testId="helper--long">
						This is a help message, but it's really really really long.
					</HelperMessage>
					<ErrorMessage testId="error--long">
						This is an error message, but it's really really really long.
					</ErrorMessage>
					<ValidMessage testId="valid--long">
						This is a validation message, but it's really really really long.
					</ValidMessage>
				</MessageWrapper>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div data-testid="messages--inline-content" style={{ maxWidth: 240 }}>
				<MessageWrapper>
					<HelperMessage testId="helper--long">
						This message contains <strong>strong</strong> text.
					</HelperMessage>
					<ErrorMessage testId="error--long">
						This message contains a link to{' '}
						<Link href="http://www.atlassian.com">the Atlassian website</Link>.
					</ErrorMessage>
					<ValidMessage testId="valid--long">
						This message contains a <Lozenge appearance="success">success</Lozenge> lozenge.
					</ValidMessage>
				</MessageWrapper>
			</div>
		</div>
	);
}
