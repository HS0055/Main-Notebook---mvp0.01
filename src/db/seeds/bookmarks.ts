import { db } from '@/db';
import { bookmarks } from '@/db/schema';

async function main() {
    const sampleBookmarks = [
        {
            notebookId: 1,
            userId: 'student123',
            createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        },
        {
            notebookId: 2,
            userId: 'student123',
            createdAt: new Date('2024-01-18T14:45:00Z').toISOString(),
        },
        {
            notebookId: 3,
            userId: 'researcher456',
            createdAt: new Date('2024-01-20T09:15:00Z').toISOString(),
        },
        {
            notebookId: 4,
            userId: 'researcher456',
            createdAt: new Date('2024-01-22T16:20:00Z').toISOString(),
        },
        {
            notebookId: 5,
            userId: 'learner789',
            createdAt: new Date('2024-01-25T11:10:00Z').toISOString(),
        },
        {
            notebookId: 6,
            userId: 'learner789',
            createdAt: new Date('2024-01-28T13:30:00Z').toISOString(),
        },
        {
            notebookId: 1,
            userId: 'scholar001',
            createdAt: new Date('2024-02-01T08:45:00Z').toISOString(),
        },
        {
            notebookId: 3,
            userId: 'scholar001',
            createdAt: new Date('2024-02-03T15:55:00Z').toISOString(),
        },
    ];

    await db.insert(bookmarks).values(sampleBookmarks);
    
    console.log('✅ Bookmarks seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});