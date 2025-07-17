import React from 'react';

interface SeoContentProps {
  content: string;
}

export const SeoContent: React.FC<SeoContentProps> = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className="game-seo-content text-gray-300 font-roboto bg-background/40 p-6 rounded-lg border border-gray-700 shadow-inner">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <style jsx global>{`
        .game-seo-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #f3f4f6;
          border-bottom: 1px solid rgba(107, 114, 128, 0.3);
          padding-bottom: 0.5rem;
        }
        .game-seo-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #e5e7eb;
        }
        .game-seo-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .game-seo-content ul, .game-seo-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .game-seo-content li {
          margin-bottom: 0.5rem;
          position: relative;
          line-height: 1.5;
        }
        .game-seo-content ul li::before {
          content: '•';
          color: var(--color-accent, #f59e0b);
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        .game-seo-content ol {
          counter-reset: item;
        }
        .game-seo-content ol li {
          counter-increment: item;
          padding-left: 0.5rem;
        }
        .game-seo-content ol li::before {
          content: counter(item) ".";
          color: var(--color-accent, #f59e0b);
          font-weight: bold;
          margin-right: 0.5rem;
        }
        .game-seo-content strong {
          color: var(--color-accent, #f59e0b);
          font-weight: 600;
        }
        .game-seo-content div {
          margin-bottom: 1.5rem;
        }
        .game-seo-content div:last-child {
          margin-bottom: 0;
        }
        
        /* 新增对 blockquote 的样式支持 */
        .game-seo-content blockquote {
          border-left: 4px solid var(--color-accent, #f59e0b);
          padding: 0.5rem 0 0.5rem 1rem;
          margin: 1rem 0;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0 0.25rem 0.25rem 0;
        }
        .game-seo-content blockquote p {
          margin-bottom: 0.5rem;
          font-style: italic;
        }
        .game-seo-content blockquote p:last-child {
          margin-bottom: 0;
        }
        
        /* 新增对 a 标签的样式支持 - 修改为常驻下划线 */
        .game-seo-content a {
          color: var(--color-accent, #f59e0b);
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-thickness: 1px;
          position: relative;
          transition: all 0.2s ease;
        }
        .game-seo-content a:hover {
          opacity: 0.8;
          text-decoration-thickness: 2px;
        }
        .game-seo-content a:focus {
          outline: 2px dashed var(--color-accent, #f59e0b);
          outline-offset: 2px;
        }
        .game-seo-content a:active {
          transform: translateY(1px);
        }
        
        /* 确保图片正确显示 */
        .game-seo-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default SeoContent; 