interface AdSpaceProps {
  size: 'banner' | 'rectangle' | 'skyscraper' | 'billboard' | 'mobile-banner' | 'leaderboard' | 'large-rectangle' | 'wide-skyscraper';
  className?: string;
}

export default function AdSpace({ size, className = '' }: AdSpaceProps) {
  const getAdDimensions = () => {
    switch (size) {
      case 'banner':
        return 'w-full h-[160px]'; // Much larger full width banner
      case 'rectangle':
        return 'w-full h-[400px]'; // Full width large rectangle
      case 'skyscraper':
        return 'w-[300px] h-[600px]'; // Wider skyscraper 
      case 'billboard':
        return 'w-full h-[300px] lg:h-[400px]'; // Much larger billboard
      case 'mobile-banner':
        return 'w-full h-[120px] lg:hidden'; // Larger mobile banner
      case 'leaderboard':
        return 'w-full h-[120px]'; // Full width leaderboard
      case 'large-rectangle':
        return 'w-full h-[400px]'; // Full width large rectangle
      case 'wide-skyscraper':
        return 'w-full max-w-[400px] h-[600px]'; // Even wider skyscraper
      default:
        return 'w-full h-[400px]';
    }
  };

  return (
    <div className={`${className} w-full flex items-center justify-center`}>
      <div 
        className={`${getAdDimensions()} bg-muted/50 border border-border rounded-2xl flex items-center justify-center text-muted-foreground shadow-sm transition-all duration-200 hover:bg-muted/70 hover:shadow-md`}
        data-testid={`ad-space-${size}`}
      >
        <div className="text-center px-4">
          <div className="text-sm uppercase tracking-wide mb-2 font-medium">Advertisement</div>
          <div className="text-sm opacity-60 mb-2">
            {size === 'banner' && 'Full Width Banner • 160px'}
            {size === 'rectangle' && 'Full Width Rectangle • 400px'}
            {size === 'skyscraper' && 'Skyscraper • 300×600'}
            {size === 'billboard' && 'Billboard • 300-400px'}
            {size === 'mobile-banner' && 'Mobile Banner • 120px'}
            {size === 'leaderboard' && 'Leaderboard • Full Width'}
            {size === 'large-rectangle' && 'Large Rectangle • 400px'}
            {size === 'wide-skyscraper' && 'Wide Skyscraper • 400×600'}
          </div>
          <div className="text-xs opacity-75">
            Want to buy ad space? Send a DM to{' '}
            <a 
              href="https://x.com/BIPExplorer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:opacity-100 transition-opacity"
            >
              @BIPExplorer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}