import React, { ReactNode } from 'react';
import { Header, Description } from './common';

export interface ThankYouProps {
  messages: {
    title: ReactNode;
    description: ReactNode;
  };
  canClose: boolean;
  canOptOut: boolean;
  onClose: () => void;
  onOptOut: () => void;
}

export default function Thankyou({
  messages,
  canClose,
  canOptOut,
  onClose,
  onOptOut,
}: ThankYouProps) {
  return (
    <div>
      <Header
        title={messages.title}
        canClose={canClose}
        canOptOut={canOptOut}
        onClose={onClose}
        onOptOut={onOptOut}
      />
      <Description>{messages.description}</Description>
    </div>
  );
}
