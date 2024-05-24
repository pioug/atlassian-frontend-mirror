/** @jsx jsx */
import { jsx } from '@emotion/react';
import { type ViewRelatedLinksActionProps } from './types';
import Action from '../action';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import RelatedLinksActionIcon from './related-links-action-icon';

const ViewRelatedLinksAction = (props: ViewRelatedLinksActionProps) => {
  const context = useFlexibleUiContext();
  const actionData = context?.actions?.ViewRelatedLinksAction;

  return actionData ? (
    <Action
      content={
        <FormattedMessage {...messages.related_links_view_related_urls} />
      }
      icon={<RelatedLinksActionIcon />}
      testId="smart-action-view-related-links-action"
      ariaLabel="View most recent pages or content types coming from or found on this link"
      {...props}
    />
  ) : null;
};

export default ViewRelatedLinksAction;
