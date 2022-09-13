export const linkCreatedPayload = {
  action: 'created',
  actionSubject: 'link',
  eventType: 'track',
} as const;

export const linkUpdatedPayload = {
  action: 'updated',
  actionSubject: 'link',
  eventType: 'track',
} as const;

export const linkDeletedPayload = {
  action: 'deleted',
  actionSubject: 'link',
  eventType: 'track',
} as const;
