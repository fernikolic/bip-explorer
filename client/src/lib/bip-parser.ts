export interface BipMetadata {
  number?: number;
  title?: string;
  authors?: string[];
  status?: string;
  type?: string;
  created?: string;
  layer?: string;
  comments?: string;
  abstract?: string;
}

export function parseMediaWikiContent(content: string): BipMetadata {
  const metadata: BipMetadata = {};
  
  // Extract preamble (between <pre> tags or at the beginning)
  const preambleMatch = content.match(/<pre>([\s\S]*?)<\/pre>/) || 
                       content.match(/^([\s\S]*?)(?=\n==|\n=)/);
  
  if (preambleMatch) {
    const preamble = preambleMatch[1];
    const lines = preamble.split('\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        const cleanKey = key.trim().toLowerCase().replace(/^\s*/, '');
        
        switch (cleanKey) {
          case 'bip':
            metadata.number = parseInt(value, 10);
            break;
          case 'title':
            metadata.title = value;
            break;
          case 'author':
          case 'authors':
            metadata.authors = value.split(',').map(a => a.trim().replace(/<[^>]*>/g, ''));
            break;
          case 'status':
            metadata.status = value;
            break;
          case 'type':
            metadata.type = value;
            break;
          case 'created':
            metadata.created = value;
            break;
          case 'layer':
            metadata.layer = value;
            break;
          case 'comments':
            metadata.comments = value;
            break;
        }
      }
    }
  }
  
  // Extract abstract
  const abstractMatch = content.match(/==\s*Abstract\s*==\s*\n([\s\S]*?)(?=\n==|\n=|$)/i);
  if (abstractMatch) {
    metadata.abstract = abstractMatch[1].trim();
  }
  
  return metadata;
}

export function parseMarkdownContent(content: string): BipMetadata {
  const metadata: BipMetadata = {};
  
  // Extract front matter
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    const lines = frontMatter.split('\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        const cleanKey = key.trim().toLowerCase();
        
        switch (cleanKey) {
          case 'bip':
            metadata.number = parseInt(value, 10);
            break;
          case 'title':
            metadata.title = value;
            break;
          case 'author':
          case 'authors':
            if (Array.isArray(value)) {
              metadata.authors = value;
            } else {
              metadata.authors = value.split(',').map(a => a.trim().replace(/<[^>]*>/g, ''));
            }
            break;
          case 'status':
            metadata.status = value;
            break;
          case 'type':
            metadata.type = value;
            break;
          case 'created':
            metadata.created = value;
            break;
          case 'layer':
            metadata.layer = value;
            break;
          case 'comments':
            metadata.comments = value;
            break;
        }
      }
    }
  }
  
  // Extract abstract
  const abstractMatch = content.match(/##\s*Abstract\s*\n([\s\S]*?)(?=\n##|\n#|$)/i);
  if (abstractMatch) {
    metadata.abstract = abstractMatch[1].trim();
  }
  
  return metadata;
}

export function extractBipNumber(filename: string): number | null {
  const match = filename.match(/bip-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
