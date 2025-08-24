import { storage } from "./storage";
import { warmCache } from "./routes";

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
const REFRESH_INTERVAL = 1000 * 60 * 14; // 14 minutes (slightly before cache expires)

export function startCacheRefresher() {
  // Set up periodic refresh
  const refreshCache = async () => {
    try {
      const lastCache = await storage.getCacheTimestamp();
      const now = Date.now();
      
      // Only refresh if cache is about to expire
      if (!lastCache || (now - lastCache) >= CACHE_DURATION - 60000) {
        console.log('[Cache Refresher] Refreshing cache...');
        await warmCache();
        console.log(`[Cache Refresher] Cache refresh complete`);
      }
    } catch (error) {
      console.error('[Cache Refresher] Failed to refresh cache:', error);
    }
  };

  // Initial refresh after 1 minute
  setTimeout(refreshCache, 60000);
  
  // Then refresh periodically
  setInterval(refreshCache, REFRESH_INTERVAL);
  
  console.log('[Cache Refresher] Started - will refresh cache every 14 minutes');
}