import { getDocuments } from '@/lib/sanity.queries';
import DocumentCard from '@/components/DocumentCard';
import { FileText, Download, ExternalLink, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { rules } from '@/content/site';
import { TECHNICAL_EMAIL, COMING_SOON } from '@/lib/site-config';

export const metadata = generateSEOMetadata({
  title: 'Rules & Documents',
  description:
    'Formula Hellas runs in compliance with the Formula Student Rules 2026 (V1.1), plus Formula Hellas additions and clarifications. Download the documents here.',
  url: '/rules',
});

// Non-history document categories only.
const categoryLabels: Record<string, string> = {
  handbook: 'Competition Handbook',
  'event-handbook': 'Event Handbook',
  rules: 'Rules',
  other: 'Other',
};

export const revalidate = 60;

export default async function RulesPage() {
  // Only show rules/handbook/other documents (no results, no past-event material).
  const allDocuments = await getDocuments()
    .then((docs) =>
      docs.filter(
        (doc: any) =>
          doc.category === 'rules' || doc.category === 'handbook' || doc.category === 'other'
      )
    )
    .catch(() => []);
  const categories = Array.from(new Set(allDocuments.map((doc: any) => doc.category)));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{rules.title}</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">{rules.intro}</p>

        <div className="space-y-12">
          {/* Rules Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Formula Student Rules 2026 — external link */}
              <Card className="h-full flex flex-col group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center group-hover:bg-primary-blue/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary-blue" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rules</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                    {rules.fsRules.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {rules.fsRules.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <a
                    href={rules.fsRules.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold text-sm transition-all group/link"
                  >
                    <Download className="w-4 h-4 mr-2 group-hover/link:translate-y-0.5 transition-transform" />
                    Download
                    <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Card>

              {/* Formula Hellas Additions & Clarifications — download placeholder (Coming soon) */}
              <Card className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rules</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{rules.additions.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {rules.additions.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span
                    className="inline-flex items-center text-gray-400 font-semibold text-sm cursor-not-allowed"
                    aria-disabled="true"
                    title={COMING_SOON}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Download — {COMING_SOON}
                  </span>
                </div>
              </Card>

              {/* Additional rules documents from CMS */}
              {allDocuments
                .filter((doc: any) => doc.category === 'rules')
                .map((doc: any) => (
                  <DocumentCard key={doc._id} document={doc} />
                ))}
            </div>
          </div>

          {/* Other categories */}
          {(categories as string[]).map((category: string) => {
            if (category === 'rules') return null;
            const categoryDocs = allDocuments.filter((doc: any) => doc.category === category);
            if (categoryDocs.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  {categoryLabels[category] || category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categoryDocs.map((doc: any) => (
                    <DocumentCard key={doc._id} document={doc} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Information</h2>
          <div className="space-y-4 text-gray-700">
            <p>{rules.note}</p>
            <p>
              For questions about rules or documents, please contact us at{' '}
              {TECHNICAL_EMAIL ? (
                <a href={`mailto:${TECHNICAL_EMAIL}`} className="text-blue-600 hover:text-blue-700">
                  {TECHNICAL_EMAIL}
                </a>
              ) : (
                <span className="font-semibold">{COMING_SOON}</span>
              )}
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
