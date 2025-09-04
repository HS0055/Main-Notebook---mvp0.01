import { db } from '@/db';
import { subjects } from '@/db/schema';

async function main() {
    const sampleSubjects = [
        {
            name: 'Mathematics',
            uuid: 'a1b2c3d4-e5f6-4789-9abc-123456789abc',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Physics',
            uuid: 'b2c3d4e5-f6a7-4890-abcd-234567890bcd',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Chemistry',
            uuid: 'c3d4e5f6-a7b8-4901-bcde-345678901cde',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Biology',
            uuid: 'd4e5f6a7-b8c9-4012-cdef-456789012def',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'History',
            uuid: 'e5f6a7b8-c9d0-4123-defa-567890123efa',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'English Literature',
            uuid: 'f6a7b8c9-d0e1-4234-efab-678901234fab',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(subjects).values(sampleSubjects);
    
    console.log('✅ Subjects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});