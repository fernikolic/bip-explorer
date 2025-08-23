interface AdSpaceProps {
  size: 'banner' | 'rectangle' | 'skyscraper' | 'billboard' | 'mobile-banner';
  className?: string;
}

export default function AdSpace({ size, className = '' }: AdSpaceProps) {
  const getAdDimensions = () => {
    switch (size) {
      case 'banner':
        return 'w-full h-[90px]'; // Full width banner on all screens
      case 'rectangle':
        return 'w-full max-w-[300px] h-[250px] lg:w-full lg:max-w-none lg:h-[200px]'; // Responsive rectangle
      case 'skyscraper':
        return 'w-[160px] h-[600px]'; // 160x600 Wide Skyscraper
      case 'billboard':
        return 'w-full h-[200px] lg:h-[250px]'; // Full width billboard
      case 'mobile-banner':
        return 'w-full h-[50px] max-w-[320px] md:max-w-[300px] lg:hidden'; // Mobile only banner
      default:
        return 'w-[300px] h-[250px]';
    }
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div 
        className={`${getAdDimensions()} bg-muted border border-border rounded-xl flex items-center justify-center text-muted-foreground text-sm font-light transition-apple hover:bg-muted/80`}
        data-testid={`ad-space-${size}`}
      >
        <div className="text-center">
          <div className="text-xs uppercase tracking-wide mb-1">Advertisement</div>
          <div className="text-xs opacity-60">
            {size === 'banner' && 'Full Width Banner'}
            {size === 'rectangle' && 'Responsive Ad'}
            {size === 'skyscraper' && '160×600'}
            {size === 'billboard' && 'Full Width Billboard'}
            {size === 'mobile-banner' && 'Mobile Banner'}
          </div>
        </div>
      </div>
    </div>
  );
}