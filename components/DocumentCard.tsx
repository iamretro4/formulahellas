import Link from 'next/link';
import { FileText, Download } from 'lucide-react';
import Card from './ui/Card';

interface Document {
  _id: string;
  title: string;
  description?: string;
  category: string;
  file: {
    asset: {
      url: string;
      originalFilename?: string;
      mimeType?: string;
    };
  };
  publishedAt?: string;
}

interface DocumentCardProps {
  document: Document;
}

const categoryLabels: Record<string, string> = {
  handbook: 'Competition Handbook',
  'event-handbook': 'Event Handbook',
  rules: 'Rules',
  other: 'Other',
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const fileUrl = document.file?.asset?.url;
  
  // Get download URL through API proxy for better compatibility
  const getDownloadUrl = (url: string | undefined) => {
    if (!url) return null;
    
    // Use original filename if available, otherwise generate from title
    const originalFilename = document.file?.asset?.originalFilename;
    const filename = originalFilename || 
      document.title
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase() + 
      (document.file?.asset?.mimeType === 'application/pdf' ? '.pdf' : 
       document.file?.asset?.mimeType?.includes('word') ? '.docx' : '.pdf');
    
    // Use API route to proxy the download
    return `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
  };

  const downloadUrl = getDownloadUrl(fileUrl);

  return (
    <Card className="h-full flex flex-col group">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center group-hover:bg-primary-blue/20 transition-colors">
            <FileText className="w-6 h-6 text-primary-blue" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {categoryLabels[document.category] || document.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
          {document.title}
        </h3>
        {document.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {document.description}
          </p>
        )}
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold text-sm transition-all group/link"
          >
            <Download className="w-4 h-4 mr-2 group-hover/link:translate-y-0.5 transition-transform" />
            Download
            <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        {document.publishedAt && (
          <p className="text-xs text-gray-400 mt-3">
            {new Date(document.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    </Card>
  );
}

