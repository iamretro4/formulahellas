import { getPostBySlug, getPosts } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { generateStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';

const options = { next: { revalidate: 30 } };

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((post: any) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return generateSEOMetadata({ title: "Post Not Found" });
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(1200).height(630).url()
    : undefined;

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    image: postImageUrl,
    url: `/posts/${slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(550).height(310).url()
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formulahellas.gr';
  
  const structuredData = generateStructuredData({
    type: 'Article',
    data: {
      headline: post.title,
      description: post.excerpt || post.title,
      image: postImageUrl || `${siteUrl}/images/brand/fh-logo.png`,
      datePublished: post.publishedAt,
      dateModified: post._updatedAt || post.publishedAt,
    },
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'News & Posts', url: `${siteUrl}/posts` },
    { name: post.title, url: `${siteUrl}/posts/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <Breadcrumbs
          items={[
            { label: 'News & Posts', href: '/posts' },
            { label: post.title },
          ]}
        />
        {postImageUrl && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
            <Image
              src={postImageUrl}
              alt={post.excerpt || post.title || 'Formula Hellas news article image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div className="prose prose-lg max-w-none">
          <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        </div>
    </main>
    </>
  );
}

