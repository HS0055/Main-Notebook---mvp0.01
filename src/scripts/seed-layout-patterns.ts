import { db } from '../db';
import { layoutPatterns } from '../db/schema';

// Seed the database with layout patterns for the unified AI system
async function seedLayoutPatterns() {
  console.log('🌱 Seeding layout patterns...');

  const patterns = [
    // Productivity Patterns
    {
      name: "Bullet Journal Weekly Spread",
      category: "productivity",
      description: "Classic bullet journal weekly layout with task tracking and notes",
      keywords: ["bullet", "journal", "weekly", "tasks", "productivity", "planning"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FAF7F0'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Weekly Spread</text>
        <rect x='50' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='125' y='90' font-size='16' fill='#666' text-anchor='middle'>Monday</text>
        <rect x='220' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='295' y='90' font-size='16' fill='#666' text-anchor='middle'>Tuesday</text>
        <rect x='390' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='465' y='90' font-size='16' fill='#666' text-anchor='middle'>Wednesday</text>
        <rect x='560' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='635' y='90' font-size='16' fill='#666' text-anchor='middle'>Thursday</text>
        <rect x='730' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='805' y='90' font-size='16' fill='#666' text-anchor='middle'>Friday</text>
        <rect x='900' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='975' y='90' font-size='16' fill='#666' text-anchor='middle'>Saturday</text>
        <rect x='1070' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='1145' y='90' font-size='16' fill='#666' text-anchor='middle'>Sunday</text>
        <rect x='50' y='290' width='1170' height='150' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='310' font-size='14' fill='#666'>Weekly Notes</text>
        <rect x='50' y='460' width='1170' height='100' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='480' font-size='14' fill='#666'>Weekly Goals</text>
      </svg>`,
      editableElements: [
        { id: "week-title", type: "text", x: 50, y: 30, width: 200, height: 30, placeholder: "Week of..." },
        { id: "monday-tasks", type: "textarea", x: 50, y: 80, width: 150, height: 180, placeholder: "Monday tasks..." },
        { id: "tuesday-tasks", type: "textarea", x: 220, y: 80, width: 150, height: 180, placeholder: "Tuesday tasks..." },
        { id: "wednesday-tasks", type: "textarea", x: 390, y: 80, width: 150, height: 180, placeholder: "Wednesday tasks..." },
        { id: "thursday-tasks", type: "textarea", x: 560, y: 80, width: 150, height: 180, placeholder: "Thursday tasks..." },
        { id: "friday-tasks", type: "textarea", x: 730, y: 80, width: 150, height: 180, placeholder: "Friday tasks..." },
        { id: "saturday-tasks", type: "textarea", x: 900, y: 80, width: 150, height: 180, placeholder: "Saturday tasks..." },
        { id: "sunday-tasks", type: "textarea", x: 1070, y: 80, width: 150, height: 180, placeholder: "Sunday tasks..." },
        { id: "notes", type: "textarea", x: 50, y: 300, width: 1170, height: 140, placeholder: "Weekly notes..." },
        { id: "goals", type: "textarea", x: 50, y: 460, width: 1170, height: 80, placeholder: "Weekly goals..." }
      ],
      popularity: 95,
      tags: ["productivity", "weekly", "tasks", "bullet journal", "planning"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Habit Tracker Grid",
      category: "productivity",
      description: "Monthly habit tracking grid with progress visualization",
      keywords: ["habit", "tracker", "monthly", "grid", "progress", "goals"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Habit Tracker - January 2024</text>
        <rect x='50' y='50' width='1100' height='500' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='70' font-size='14' fill='#666'>Habits</text>
        <text x='200' y='70' font-size='12' fill='#666'>1</text>
        <text x='220' y='70' font-size='12' fill='#666'>2</text>
        <text x='240' y='70' font-size='12' fill='#666'>3</text>
        <text x='260' y='70' font-size='12' fill='#666'>4</text>
        <text x='280' y='70' font-size='12' fill='#666'>5</text>
        <text x='300' y='70' font-size='12' fill='#666'>6</text>
        <text x='320' y='70' font-size='12' fill='#666'>7</text>
        <text x='340' y='70' font-size='12' fill='#666'>8</text>
        <text x='360' y='70' font-size='12' fill='#666'>9</text>
        <text x='380' y='70' font-size='12' fill='#666'>10</text>
        <text x='60' y='100' font-size='12' fill='#333'>Exercise</text>
        <text x='60' y='130' font-size='12' fill='#333'>Read</text>
        <text x='60' y='160' font-size='12' fill='#333'>Meditate</text>
        <text x='60' y='190' font-size='12' fill='#333'>Water</text>
        <text x='60' y='220' font-size='12' fill='#333'>Sleep</text>
      </svg>`,
      editableElements: [
        { id: "month-title", type: "text", x: 50, y: 30, width: 200, height: 20, placeholder: "January 2024" },
        { id: "habit-1", type: "text", x: 60, y: 90, width: 100, height: 20, placeholder: "Exercise" },
        { id: "habit-2", type: "text", x: 60, y: 120, width: 100, height: 20, placeholder: "Read" },
        { id: "habit-3", type: "text", x: 60, y: 150, width: 100, height: 20, placeholder: "Meditate" },
        { id: "habit-4", type: "text", x: 60, y: 180, width: 100, height: 20, placeholder: "Water" },
        { id: "habit-5", type: "text", x: 60, y: 210, width: 100, height: 20, placeholder: "Sleep" }
      ],
      popularity: 88,
      tags: ["habit", "tracker", "monthly", "grid", "progress"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Creative Patterns
    {
      name: "Mood Tracker & Journal",
      category: "creative",
      description: "Daily mood tracking with journaling space and wellness metrics",
      keywords: ["mood", "journal", "wellness", "daily", "tracker", "mental health"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFF9F0'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Daily Mood & Journal</text>
        <rect x='50' y='70' width='800' height='300' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='90' font-size='14' fill='#666'>How are you feeling today?</text>
        <rect x='50' y='390' width='400' height='150' fill='#E8F5E8' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='410' font-size='14' fill='#666'>Three things I'm grateful for...</text>
        <rect x='470' y='390' width='380' height='150' fill='#E8F0FF' stroke='#E5E5E5' stroke-width='2'/>
        <text x='480' y='410' font-size='14' fill='#666'>Today's goals...</text>
        <rect x='50' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
        <text x='60' y='580' font-size='12' fill='#666'>Sleep (hrs)</text>
        <rect x='200' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
        <text x='210' y='580' font-size='12' fill='#666'>Water (glasses)</text>
        <rect x='350' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
        <text x='360' y='580' font-size='12' fill='#666'>Exercise</text>
      </svg>`,
      editableElements: [
        { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
        { id: "mood-rating", type: "select", x: 250, y: 30, width: 200, height: 30, options: ["😢", "😔", "😐", "😊", "😄"] },
        { id: "journal", type: "textarea", x: 50, y: 80, width: 800, height: 280, placeholder: "How are you feeling today?" },
        { id: "gratitude", type: "textarea", x: 50, y: 380, width: 400, height: 140, placeholder: "Three things I'm grateful for..." },
        { id: "goals", type: "textarea", x: 470, y: 380, width: 380, height: 140, placeholder: "Today's goals..." },
        { id: "sleep-hours", type: "number", x: 50, y: 540, width: 100, height: 30, placeholder: "8" },
        { id: "water-glasses", type: "number", x: 200, y: 540, width: 100, height: 30, placeholder: "8" },
        { id: "exercise", type: "checkbox", x: 350, y: 540, width: 20, height: 20 }
      ],
      popularity: 92,
      tags: ["mood", "journal", "wellness", "daily", "mental health"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Creative Sketch & Notes",
      category: "creative",
      description: "Combined drawing space with note-taking areas",
      keywords: ["creative", "sketch", "drawing", "notes", "art", "ideas"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Creative Space</text>
        <rect x='50' y='70' width='600' height='400' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='90' font-size='14' fill='#666'>Drawing Area</text>
        <rect x='670' y='70' width='480' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='680' y='90' font-size='14' fill='#666'>Ideas & Notes</text>
        <rect x='670' y='290' width='480' height='180' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='680' y='310' font-size='14' fill='#666'>Color Palette</text>
      </svg>`,
      editableElements: [
        { id: "title", type: "text", x: 50, y: 30, width: 200, height: 30, placeholder: "Project Title" },
        { id: "ideas", type: "textarea", x: 670, y: 80, width: 480, height: 180, placeholder: "Ideas and notes..." },
        { id: "colors", type: "textarea", x: 670, y: 300, width: 480, height: 160, placeholder: "Color notes..." }
      ],
      popularity: 75,
      tags: ["creative", "sketch", "drawing", "art", "ideas"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Study Patterns
    {
      name: "Cornell Note-Taking System",
      category: "study",
      description: "Classic Cornell method for effective note-taking and review",
      keywords: ["cornell", "notes", "study", "academic", "learning", "review"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='18' fill='#2C2C2C' font-weight='bold'>Cornell Note-Taking System</text>
        <rect x='50' y='70' width='800' height='400' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='90' font-size='14' fill='#666'>Main Notes</text>
        <rect x='870' y='70' width='200' height='400' fill='#F8F9FA' stroke='#E5E5E5' stroke-width='2'/>
        <text x='880' y='90' font-size='14' fill='#666'>Cues & Questions</text>
        <rect x='50' y='490' width='1020' height='100' fill='#F8F9FA' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='510' font-size='14' fill='#666'>Summary</text>
      </svg>`,
      editableElements: [
        { id: "topic", type: "text", x: 50, y: 30, width: 300, height: 30, placeholder: "Topic: " },
        { id: "date", type: "date", x: 400, y: 30, width: 150, height: 30 },
        { id: "notes", type: "textarea", x: 50, y: 80, width: 800, height: 380, placeholder: "Main notes..." },
        { id: "cues", type: "textarea", x: 870, y: 80, width: 200, height: 380, placeholder: "Cues & Questions..." },
        { id: "summary", type: "textarea", x: 50, y: 490, width: 1020, height: 100, placeholder: "Summary..." }
      ],
      popularity: 90,
      tags: ["cornell", "notes", "study", "academic", "learning"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Mind Map Template",
      category: "study",
      description: "Central topic with branching ideas for brainstorming",
      keywords: ["mind", "map", "brainstorm", "ideas", "concept", "visual"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Mind Map</text>
        <circle cx='600' cy='300' r='60' fill='#E8F0FF' stroke='#3B82F6' stroke-width='3'/>
        <text x='600' y='305' font-size='16' fill='#1E40AF' text-anchor='middle' font-weight='bold'>Central Topic</text>
        <rect x='400' y='200' width='120' height='60' fill='#F0F9FF' stroke='#0EA5E9' stroke-width='2'/>
        <text x='460' y='235' font-size='12' fill='#0369A1' text-anchor='middle'>Branch 1</text>
        <rect x='680' y='200' width='120' height='60' fill='#F0F9FF' stroke='#0EA5E9' stroke-width='2'/>
        <text x='740' y='235' font-size='12' fill='#0369A1' text-anchor='middle'>Branch 2</text>
        <rect x='400' y='340' width='120' height='60' fill='#F0F9FF' stroke='#0EA5E9' stroke-width='2'/>
        <text x='460' y='375' font-size='12' fill='#0369A1' text-anchor='middle'>Branch 3</text>
        <rect x='680' y='340' width='120' height='60' fill='#F0F9FF' stroke='#0EA5E9' stroke-width='2'/>
        <text x='740' y='375' font-size='12' fill='#0369A1' text-anchor='middle'>Branch 4</text>
      </svg>`,
      editableElements: [
        { id: "central-topic", type: "text", x: 540, y: 290, width: 120, height: 20, placeholder: "Central Topic" },
        { id: "branch-1", type: "text", x: 400, y: 220, width: 120, height: 20, placeholder: "Branch 1" },
        { id: "branch-2", type: "text", x: 680, y: 220, width: 120, height: 20, placeholder: "Branch 2" },
        { id: "branch-3", type: "text", x: 400, y: 360, width: 120, height: 20, placeholder: "Branch 3" },
        { id: "branch-4", type: "text", x: 680, y: 360, width: 120, height: 20, placeholder: "Branch 4" }
      ],
      popularity: 82,
      tags: ["mind map", "brainstorm", "ideas", "visual", "concept"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Business Patterns
    {
      name: "Meeting Notes Template",
      category: "business",
      description: "Structured meeting notes with agenda and action items",
      keywords: ["meeting", "notes", "agenda", "action", "items", "business"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Meeting Notes</text>
        <rect x='50' y='70' width='1100' height='50' fill='#F8F9FA' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='90' font-size='14' fill='#666'>Meeting: </text>
        <text x='200' y='90' font-size='14' fill='#666'>Date: </text>
        <text x='350' y='90' font-size='14' fill='#666'>Attendees: </text>
        <rect x='50' y='140' width='1100' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='160' font-size='14' fill='#666'>Agenda</text>
        <rect x='50' y='360' width='1100' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='380' font-size='14' fill='#666'>Notes & Discussion</text>
        <rect x='50' y='580' width='1100' height='100' fill='#FFF3CD' stroke='#FFEAA7' stroke-width='2'/>
        <text x='60' y='600' font-size='14' fill='#856404'>Action Items</text>
      </svg>`,
      editableElements: [
        { id: "meeting-title", type: "text", x: 120, y: 80, width: 200, height: 20, placeholder: "Meeting Title" },
        { id: "meeting-date", type: "date", x: 240, y: 80, width: 100, height: 20 },
        { id: "attendees", type: "text", x: 420, y: 80, width: 300, height: 20, placeholder: "Attendees" },
        { id: "agenda", type: "textarea", x: 50, y: 150, width: 1100, height: 180, placeholder: "Meeting agenda..." },
        { id: "notes", type: "textarea", x: 50, y: 370, width: 1100, height: 180, placeholder: "Notes and discussion..." },
        { id: "action-items", type: "textarea", x: 50, y: 590, width: 1100, height: 80, placeholder: "Action items..." }
      ],
      popularity: 87,
      tags: ["meeting", "notes", "agenda", "business", "action items"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Fitness Patterns
    {
      name: "Workout & Nutrition Tracker",
      category: "fitness",
      description: "Daily workout log with nutrition tracking",
      keywords: ["workout", "fitness", "nutrition", "exercise", "health", "tracker"],
      svgTemplate: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <rect width='100%' height='100%' fill='#FFFFFF'/>
        <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Daily Fitness Tracker</text>
        <rect x='50' y='70' width='500' height='300' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='90' font-size='14' fill='#666'>Workout</text>
        <rect x='570' y='70' width='580' height='150' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='580' y='90' font-size='14' fill='#666'>Meals</text>
        <rect x='570' y='240' width='580' height='130' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='580' y='260' font-size='14' fill='#666'>Hydration & Supplements</text>
        <rect x='50' y='390' width='1100' height='100' fill='none' stroke='#E5E5E5' stroke-width='2'/>
        <text x='60' y='410' font-size='14' fill='#666'>Notes & Observations</text>
        <rect x='50' y='510' width='1100' height='80' fill='#E8F5E8' stroke='#4CAF50' stroke-width='2'/>
        <text x='60' y='530' font-size='14' fill='#2E7D32'>Goals for Tomorrow</text>
      </svg>`,
      editableElements: [
        { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
        { id: "workout", type: "textarea", x: 50, y: 80, width: 500, height: 280, placeholder: "Workout details..." },
        { id: "meals", type: "textarea", x: 570, y: 80, width: 580, height: 140, placeholder: "Meals and snacks..." },
        { id: "hydration", type: "textarea", x: 570, y: 250, width: 580, height: 110, placeholder: "Water intake and supplements..." },
        { id: "notes", type: "textarea", x: 50, y: 400, width: 1100, height: 90, placeholder: "Notes and observations..." },
        { id: "goals", type: "textarea", x: 50, y: 520, width: 1100, height: 60, placeholder: "Goals for tomorrow..." }
      ],
      popularity: 79,
      tags: ["workout", "fitness", "nutrition", "health", "tracker"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    // Clear existing patterns
    await db.delete(layoutPatterns);
    console.log('🗑️  Cleared existing patterns');

    // Insert new patterns
    for (const pattern of patterns) {
      await db.insert(layoutPatterns).values(pattern);
    }

    console.log(`✅ Successfully seeded ${patterns.length} layout patterns`);
    console.log('📊 Categories:', [...new Set(patterns.map(p => p.category))]);
    console.log('🏷️  Total tags:', [...new Set(patterns.flatMap(p => p.tags))].length);
    
  } catch (error) {
    console.error('❌ Error seeding layout patterns:', error);
    throw error;
  }
}

// Run the seeder
if (require.main === module) {
  seedLayoutPatterns()
    .then(() => {
      console.log('🎉 Layout patterns seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedLayoutPatterns };
