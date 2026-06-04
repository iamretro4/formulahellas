import { groq } from 'next-sanity';
import { client } from './sanity';

export async function getNews(limit?: number) {
  const query = groq`*[_type == "news"] | order(publishedAt desc)${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    featuredImage,
    isFeatured
  }`;
  return await client.fetch(query);
}

export async function getFeaturedNews() {
  const query = groq`*[_type == "news" && isFeatured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    featuredImage
  }`;
  return await client.fetch(query);
}

export async function getDocuments(category?: string) {
  const categoryFilter = category ? `&& category == "${category}"` : '';
  const query = groq`*[_type == "competitionDocument" ${categoryFilter}] | order(publishedAt desc) {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        url,
        originalFilename,
        size,
        mimeType
      }
    },
    publishedAt,
    isFeatured
  }`;
  return await client.fetch(query);
}

export async function getSponsors(tier?: string) {
  const tierFilter = tier ? `&& tier == "${tier}"` : '';
  const query = groq`*[_type == "sponsor" ${tierFilter}] | order(tier asc, order asc) {
    _id,
    name,
    logo,
    website,
    tier,
    order
  }`;
  return await client.fetch(query);
}

export async function getPageContent(page: string) {
  const query = groq`*[_type == "pageContent" && page == "${page}"][0] {
    _id,
    title,
    content
  }`;
  return await client.fetch(query);
}

export async function getHomePageContent() {
  const query = groq`*[_type == "homePage"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    competitionTitle,
    competitionDescription,
    quickLinksTitle
  }`;
  return await client.fetch(query);
}

export async function getSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0] {
    title,
    tagline,
    contact,
    social,
    footer
  }`;
  return await client.fetch(query);
}

export async function getPosts(limit?: number) {
  const query = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)${limit ? `[0...${limit}]` : '[0...12]'} {
    _id,
    title,
    slug,
    publishedAt,
    image
  }`;
  return await client.fetch(query);
}

export async function getPostBySlug(slug: string) {
  const query = groq`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }`;
  return await client.fetch(query, { slug });
}

// Event queries
export async function getEvents(status?: string) {
  const statusFilter = status ? `&& status == "${status}"` : '';
  const query = groq`*[_type == "event" ${statusFilter}] | order(year desc) {
    _id,
    year,
    title,
    startDate,
    endDate,
    location,
    venue,
    description,
    status,
    featuredImage,
    registrationOpen,
    registrationDeadline
  }`;
  return await client.fetch(query);
}

export async function getEventByYear(year: number) {
  const query = groq`*[_type == "event" && year == $year][0] {
    _id,
    year,
    title,
    startDate,
    endDate,
    location,
    venue,
    description,
    status,
    featuredImage,
    registrationOpen,
    registrationDeadline
  }`;
  return await client.fetch(query, { year });
}

// Event documents query
export async function getEventDocuments(eventId: string) {
  const query = groq`*[_type == "competitionDocument" && event._ref == "${eventId}"] | order(publishedAt desc) {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        url,
        originalFilename,
        size,
        mimeType
      }
    },
    publishedAt,
    isFeatured
  }`;
  return await client.fetch(query);
}
