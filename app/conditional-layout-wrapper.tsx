import ConditionalLayout from './conditional-layout';

export default function ConditionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
