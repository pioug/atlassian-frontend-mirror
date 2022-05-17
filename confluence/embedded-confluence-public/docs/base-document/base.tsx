import React from 'react';

import ReactMarkdown from 'react-markdown';

export default function Base(props: any) {
  return <ReactMarkdown children={props.content} />;
}
