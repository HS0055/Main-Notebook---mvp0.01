import { db } from '@/db';
import { notebooks } from '@/db/schema';

async function main() {
    const sampleNotebooks = [
        {
            title: 'Advanced Calculus',
            cover: {
                theme: 'blue',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                icons: ['∫', '∂', '∑', '∞', 'dx/dy'],
                pattern: 'mathematical',
                style: 'academic'
            },
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'Organic Chemistry',
            cover: {
                theme: 'green',
                color: '#16a34a',
                backgroundColor: '#f0fdf4',
                icons: ['C₆H₆', 'CH₃', 'OH', 'COOH', 'NH₂'],
                pattern: 'molecular',
                style: 'scientific'
            },
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            title: 'World History',
            cover: {
                theme: 'brown',
                color: '#a16207',
                backgroundColor: '#fffbeb',
                icons: ['🏛️', '⚔️', '👑', '📜', '🗺️'],
                pattern: 'vintage',
                style: 'classical'
            },
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Physics Fundamentals',
            cover: {
                theme: 'purple',
                color: '#7c3aed',
                backgroundColor: '#faf5ff',
                icons: ['F=ma', 'E=mc²', 'v=d/t', 'P=mv', 'W=Fd'],
                pattern: 'formulas',
                style: 'modern'
            },
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Computer Science',
            cover: {
                theme: 'dark',
                color: '#1f2937',
                backgroundColor: '#f9fafb',
                icons: ['{}', '</>', 'if()', 'for()', 'class'],
                pattern: 'code',
                style: 'tech'
            },
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
        {
            title: 'Biology Research',
            cover: {
                theme: 'lightgreen',
                color: '#22c55e',
                backgroundColor: '#f7fee7',
                icons: ['🧬', '🔬', '🦠', '🌱', '🧪'],
                pattern: 'biological',
                style: 'research'
            },
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        }
    ];

    await db.insert(notebooks).values(sampleNotebooks);
    
    console.log('✅ Notebooks seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});