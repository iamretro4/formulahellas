import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Contact",
  description: "Get in touch with Formula Hellas. Contact us for questions about the competition, registration, or media inquiries.",
  url: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

