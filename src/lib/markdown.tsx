import { FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

// Simple markdown renderer
export function renderMarkdown(content: string) {
  if (!content) return null;
  
  const processedContent = content
    // Process headers
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4 font-inter">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 font-inter">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3 font-inter">$1</h3>')
    
    // Process emphasis
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Process links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>')
    
    // Process lists
    .replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="list-decimal list-inside text-gray-300 mt-1">$1</li>')
    .replace(/^\s*\*\s+(.*$)/gm, '<li class="list-disc list-inside text-gray-300 mt-1">$1</li>')
    
    // Process blockquotes
    .replace(/^\> (.*$)/gm, '<blockquote class="bg-background p-4 border-l-4 border-accent my-6"><p class="text-gray-300 italic">$1</p></blockquote>')
    
    // Process code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-background p-4 rounded-md overflow-x-auto font-fira text-sm my-4"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-background text-accent px-1 py-0.5 rounded font-fira text-sm">$1</code>')
    
    // Process horizontal rules
    .replace(/^---$/gm, '<hr class="border-gray-700 my-6" />')
    
    // Process paragraphs (must be last)
    .replace(/^(?!<[h|p|u|o]|<bl|<pr)(.+)/gm, '<p class="text-gray-300 mb-4 font-roboto">$1</p>')
    
    // Process containers
    .replace(
      /:::tip([\s\S]*?):::/gm, 
      '<div class="bg-background rounded-lg p-4 my-6 border-l-4 border-accent"><div class="flex items-start"><span class="text-accent mr-2"><FaInfoCircle /></span><div>$1</div></div></div>'
    )
    .replace(
      /:::warning([\s\S]*?):::/gm, 
      '<div class="bg-background rounded-lg p-4 my-6 border-l-4 border-yellow-500"><div class="flex items-start"><span class="text-yellow-500 mr-2"><FaExclamationTriangle /></span><div>$1</div></div></div>'
    );

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}
