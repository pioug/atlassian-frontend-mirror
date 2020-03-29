export default function cleanProps(props: Record<string, any>) {
  const { createAnalyticsEvent, ...cleanedProps } = props;

  return cleanedProps;
}
