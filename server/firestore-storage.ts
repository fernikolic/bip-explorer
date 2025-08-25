import admin from 'firebase-admin';
import { Bip, Author } from '@shared/schema';
import { IStorage } from './storage';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | null = null;

function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if we have Firebase credentials
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || 'bip-explorer-default';

  if (serviceAccount) {
    try {
      const credentials = JSON.parse(serviceAccount);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(credentials),
        projectId: credentials.project_id || projectId,
      });
    } catch (error) {
      console.error('Failed to parse Firebase service account key:', error);
      throw new Error('Invalid Firebase service account key format');
    }
  } else {
    // For local development, try to use default credentials
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set, attempting to use default credentials');
    try {
      firebaseApp = admin.initializeApp({
        projectId: projectId,
      });
    } catch (error) {
      console.error('Failed to initialize Firebase with default credentials:', error);
      throw new Error('Firebase credentials not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
    }
  }

  console.log(`✅ Firebase initialized for project: ${projectId}`);
  return firebaseApp;
}

export class FirestoreStorage implements IStorage {
  private db: admin.firestore.Firestore;
  private bipsCollection: admin.firestore.CollectionReference;
  private metadataCollection: admin.firestore.CollectionReference;

  constructor() {
    const app = initializeFirebase();
    this.db = app.firestore();
    this.bipsCollection = this.db.collection('bips');
    this.metadataCollection = this.db.collection('metadata');
  }

  async getBips(): Promise<Bip[]> {
    try {
      console.log('📖 Loading BIPs from Firestore...');
      const snapshot = await this.bipsCollection.orderBy('number').get();
      const bips: Bip[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data() as Bip;
        bips.push(data);
      });
      
      console.log(`✅ Loaded ${bips.length} BIPs from Firestore`);
      return bips;
    } catch (error) {
      console.error('Error loading BIPs from Firestore:', error);
      return [];
    }
  }

  async getBip(number: number): Promise<Bip | undefined> {
    try {
      const doc = await this.bipsCollection.doc(`bip-${number}`).get();
      if (!doc.exists) {
        return undefined;
      }
      return doc.data() as Bip;
    } catch (error) {
      console.error(`Error loading BIP ${number} from Firestore:`, error);
      return undefined;
    }
  }

  async cacheBips(bips: Bip[]): Promise<void> {
    try {
      console.log(`💾 Caching ${bips.length} BIPs to Firestore...`);
      
      // Use batch writes for better performance
      const batch = this.db.batch();
      
      for (const bip of bips) {
        const docRef = this.bipsCollection.doc(`bip-${bip.number}`);
        batch.set(docRef, bip, { merge: true });
      }
      
      await batch.commit();
      console.log(`✅ Successfully cached ${bips.length} BIPs to Firestore`);
    } catch (error) {
      console.error('Error caching BIPs to Firestore:', error);
      throw error;
    }
  }

  async updateBip(bip: Bip): Promise<void> {
    try {
      const docRef = this.bipsCollection.doc(`bip-${bip.number}`);
      await docRef.set(bip, { merge: true });
      console.log(`✅ Updated BIP ${bip.number} in Firestore`);
    } catch (error) {
      console.error(`Error updating BIP ${bip.number} in Firestore:`, error);
      throw error;
    }
  }

  async getBipsByAuthor(authorName: string): Promise<Bip[]> {
    try {
      const snapshot = await this.bipsCollection
        .where('authors', 'array-contains', authorName)
        .orderBy('number')
        .get();
      
      const bips: Bip[] = [];
      snapshot.forEach(doc => {
        bips.push(doc.data() as Bip);
      });
      
      return bips;
    } catch (error) {
      console.error(`Error loading BIPs by author ${authorName} from Firestore:`, error);
      return [];
    }
  }

  async getAuthors(): Promise<Author[]> {
    try {
      const bips = await this.getBips();
      const authorMap = new Map<string, Author>();
      
      for (const bip of bips) {
        for (const authorName of bip.authors) {
          if (!authorMap.has(authorName)) {
            authorMap.set(authorName, {
              name: authorName,
              bipCount: 0,
              bips: []
            });
          }
          
          const author = authorMap.get(authorName)!;
          author.bipCount++;
          author.bips.push({
            number: bip.number,
            title: bip.title,
            status: bip.status
          });
        }
      }
      
      return Array.from(authorMap.values())
        .sort((a, b) => b.bipCount - a.bipCount);
    } catch (error) {
      console.error('Error loading authors from Firestore:', error);
      return [];
    }
  }

  async getStats(): Promise<any> {
    try {
      const bips = await this.getBips();
      
      const stats = {
        totalBips: bips.length,
        statusCounts: {} as Record<string, number>,
        typeCounts: {} as Record<string, number>,
        layerCounts: {} as Record<string, number>,
        yearCounts: {} as Record<string, number>,
        eli5Coverage: 0
      };
      
      let eli5Count = 0;
      
      for (const bip of bips) {
        // Count by status
        stats.statusCounts[bip.status] = (stats.statusCounts[bip.status] || 0) + 1;
        
        // Count by type
        stats.typeCounts[bip.type] = (stats.typeCounts[bip.type] || 0) + 1;
        
        // Count by layer
        if (bip.layer) {
          stats.layerCounts[bip.layer] = (stats.layerCounts[bip.layer] || 0) + 1;
        }
        
        // Count by year
        if (bip.created) {
          const year = bip.created.split('-')[0];
          if (year && year.length === 4) {
            stats.yearCounts[year] = (stats.yearCounts[year] || 0) + 1;
          }
        }
        
        // Count ELI5 coverage
        if (bip.eli5 && bip.eli5.trim().length > 0) {
          eli5Count++;
        }
      }
      
      stats.eli5Coverage = Math.round((eli5Count / bips.length) * 100);
      
      return stats;
    } catch (error) {
      console.error('Error calculating stats from Firestore:', error);
      return {
        totalBips: 0,
        statusCounts: {},
        typeCounts: {},
        layerCounts: {},
        yearCounts: {},
        eli5Coverage: 0
      };
    }
  }

  async getCacheTimestamp(): Promise<number | undefined> {
    try {
      const doc = await this.metadataCollection.doc('cache-info').get();
      if (!doc.exists) {
        return undefined;
      }
      const data = doc.data();
      return data?.timestamp || undefined;
    } catch (error) {
      console.error('Error getting cache timestamp from Firestore:', error);
      return undefined;
    }
  }

  async setCacheTimestamp(timestamp: number): Promise<void> {
    try {
      await this.metadataCollection.doc('cache-info').set({
        timestamp,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error setting cache timestamp in Firestore:', error);
      throw error;
    }
  }

  // Firestore-specific methods for better management
  
  async getBipsWithoutELI5(): Promise<Bip[]> {
    try {
      console.log('🔍 Finding BIPs without ELI5 explanations...');
      const snapshot = await this.bipsCollection
        .where('eli5', '==', null)
        .orderBy('number')
        .get();
      
      const bipsWithoutEli5: Bip[] = [];
      snapshot.forEach(doc => {
        bipsWithoutEli5.push(doc.data() as Bip);
      });
      
      // Also check for BIPs with empty string ELI5
      const snapshot2 = await this.bipsCollection
        .where('eli5', '==', '')
        .orderBy('number')
        .get();
      
      snapshot2.forEach(doc => {
        const bip = doc.data() as Bip;
        if (!bipsWithoutEli5.some(b => b.number === bip.number)) {
          bipsWithoutEli5.push(bip);
        }
      });
      
      console.log(`Found ${bipsWithoutEli5.length} BIPs without ELI5 explanations`);
      return bipsWithoutEli5.sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error('Error finding BIPs without ELI5:', error);
      return [];
    }
  }

  async updateBipELI5(bipNumber: number, eli5: string): Promise<void> {
    try {
      const docRef = this.bipsCollection.doc(`bip-${bipNumber}`);
      await docRef.update({ eli5 });
      console.log(`✅ Updated ELI5 for BIP ${bipNumber}`);
    } catch (error) {
      console.error(`Error updating ELI5 for BIP ${bipNumber}:`, error);
      throw error;
    }
  }

  async getELI5Coverage(): Promise<{ total: number; withELI5: number; percentage: number }> {
    try {
      const allBips = await this.getBips();
      const withELI5 = allBips.filter(bip => bip.eli5 && bip.eli5.trim().length > 0);
      
      return {
        total: allBips.length,
        withELI5: withELI5.length,
        percentage: Math.round((withELI5.length / allBips.length) * 100)
      };
    } catch (error) {
      console.error('Error calculating ELI5 coverage:', error);
      return { total: 0, withELI5: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const firestoreStorage = new FirestoreStorage();