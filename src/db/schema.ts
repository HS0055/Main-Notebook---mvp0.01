import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  uuid: text('uuid').notNull().unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title', { length: 120 }).notNull(),
  content: text('content', { length: 20000 }).notNull(),
  subjectId: text('subject_id').notNull().references(() => subjects.uuid),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  uniqueTitleSubject: unique().on(table.title, table.subjectId),
}));

export const notebooks = sqliteTable('notebooks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  cover: text('cover', { mode: 'json' }),
  studyMode: text('study_mode').default('write'), // Add study mode field
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  notebookId: integer('notebook_id').references(() => notebooks.id),
  title: text('title').notNull(),
  leftContent: text('left_content'),
  rightContent: text('right_content'),
  // Store per-page paper style as JSON (lineType, spacing, colors, margin)
  paperStyle: text('paper_style', { mode: 'json' }),
  // Store AI-generated template overlay SVG data URL
  templateOverlay: text('template_overlay'),
  pageOrder: integer('page_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  notebookId: integer('notebook_id').references(() => notebooks.id),
  userId: text('user_id').notNull(),
  createdAt: text('created_at').notNull(),
});

// RAG System: Layout Patterns Database
export const layoutPatterns = sqliteTable('layout_patterns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(), // productivity, study, creative, business, fitness
  description: text('description').notNull(),
  keywords: text('keywords', { mode: 'json' }).notNull(), // Array of keywords
  svgTemplate: text('svg_template').notNull(),
  editableElements: text('editable_elements', { mode: 'json' }).notNull(), // Array of editable elements
  popularity: integer('popularity').default(0),
  tags: text('tags', { mode: 'json' }).notNull(), // Array of tags
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// RAG System: User Layout Preferences
export const userLayoutPreferences = sqliteTable('user_layout_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  preferredCategories: text('preferred_categories', { mode: 'json' }), // Array of preferred categories
  customLayouts: text('custom_layouts', { mode: 'json' }), // Array of custom layouts
  usageStats: text('usage_stats', { mode: 'json' }), // Usage statistics
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});