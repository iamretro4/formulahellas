import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { getPosts } from '@/lib/sanity.queries';
import { generateMetadata as generateSEOMetadata, generateBreadcrumbStructuredData } from "@/lib/seo";
import Breadcrumbs from '@/components/Breadcrumbs';

const options = { next: { revalidate: 30 } };

export const metadata = generateSEOMetadata({
  title: "News & Posts",
  description: "Stay updated with the latest news, announcements, and updates from Formula Hellas.",
  url: "/posts",
});

export default async function PostsPage() {
  const posts = await getPosts().catch(() => []);
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formulahellas.gr';
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'News & Posts', url: `${siteUrl}/posts` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <Breadcrumbs
          items={[
            { label: 'News & Posts' },
          ]}
          className="mb-6"
        />
        <h1 className="text-4xl font-bold mb-8">News & Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post: SanityDocument) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/posts/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-gray-500">No posts found.</li>
        )}
      </ul>
    </main>
    </>
  );
}

