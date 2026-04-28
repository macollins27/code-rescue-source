// Schema.org / JSON-LD builders. Every page composes from these so AI crawlers
// see one consistent entity graph keyed by @id.

export const ORG_ID = 'https://code-rescue.com/#organization';
export const PERSON_ID = 'https://code-rescue.com/#max';
export const SITE_ID = 'https://code-rescue.com/#website';

export function organization(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Code Rescue',
    legalName: 'Code Rescue LLC',
    url: 'https://code-rescue.com',
    email: 'max@code-rescue.com',
    founder: { '@id': PERSON_ID },
    description:
      'AI-augmented engineering and due-diligence audits for codebases that have to survive review.',
  };
}

export function person(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Maxwell A. Collins',
    email: 'max@code-rescue.com',
    url: 'https://code-rescue.com/about',
    jobTitle: 'Founder',
    worksFor: { '@id': ORG_ID },
    sameAs: ['https://github.com/macollins27'],
  };
}

export function website(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: 'https://code-rescue.com',
    name: 'Code Rescue',
    publisher: { '@id': ORG_ID },
  };
}

export interface ArticleArgs {
  type?: 'Article' | 'TechArticle' | 'BlogPosting';
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  wordCount?: number;
  keywords?: string[];
  articleSection?: string;
}

export function article(args: ArticleArgs): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': args.type ?? 'Article',
    headline: args.headline,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    ...(args.wordCount ? { wordCount: args.wordCount } : {}),
    ...(args.keywords ? { keywords: args.keywords.join(', ') } : {}),
    ...(args.articleSection ? { articleSection: args.articleSection } : {}),
  };
}

export interface ServiceArgs {
  name: string;
  description: string;
  serviceType: string;
  priceMin: number;
  priceMax: number;
  url: string;
}

export function service(args: ServiceArgs): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description,
    serviceType: args.serviceType,
    provider: { '@id': ORG_ID },
    url: args.url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: args.priceMin,
      highPrice: args.priceMax,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbs(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
