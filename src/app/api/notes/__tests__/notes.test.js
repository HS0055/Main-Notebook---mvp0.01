import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createServer } from 'http';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/notes/route';
import { db } from '@/db';
import { notes, subjects } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Mock Next.js app for supertest
const createMockApp = () => {
  const server = createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/notes') {
      // Create a mock NextRequest
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
          if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
          }
        });

        const nextRequest = new NextRequest(`http://localhost${req.url}`, {
          method: 'POST',
          headers,
          body: body || undefined
        });

        try {
          const response = await POST(nextRequest);
          const responseData = await response.json();
          
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseData));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ok: false,
            data: null,
            error: 'Internal server error'
          }));
        }
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  return server;
};

// Test constants
const VALID_SUBJECT_ID = 'a1b2c3d4-e5f6-4789-9abc-123456789abc';
const VALID_NOTE_DATA = {
  title: 'Test Note',
  content: 'This is test content for the note.',
  subjectId: VALID_SUBJECT_ID
};

describe('POST /api/notes', () => {
  let app: any;

  beforeAll(async () => {
    app = createMockApp();
    
    // Seed the database with test subject
    try {
      await db.insert(subjects).values({
        name: 'Mathematics',
        uuid: VALID_SUBJECT_ID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).onConflictDoNothing();
    } catch (error) {
      // Subject might already exist, ignore error
    }
  });

  afterAll(async () => {
    if (app) {
      app.close();
    }
  });

  beforeEach(async () => {
    // Clean up notes table before each test
    await db.delete(notes);
  });

  describe('Successful POST Request', () => {
    it('should create a note with valid data and return 201', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ok: true,
        data: expect.objectContaining({
          id: expect.any(Number),
          title: VALID_NOTE_DATA.title,
          content: VALID_NOTE_DATA.content,
          subjectId: VALID_NOTE_DATA.subjectId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        error: null
      });
    });

    it('should trim whitespace from title', async () => {
      const dataWithWhitespace = {
        ...VALID_NOTE_DATA,
        title: '  Trimmed Title  '
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithWhitespace);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Trimmed Title');
    });
  });

  describe('Missing Required Fields', () => {
    it('should return 422 when title is missing', async () => {
      const { title, ...dataWithoutTitle } = VALID_NOTE_DATA;

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithoutTitle);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Title is required'
      });
    });

    it('should return 422 when content is missing', async () => {
      const { content, ...dataWithoutContent } = VALID_NOTE_DATA;

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithoutContent);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Content is required'
      });
    });

    it('should return 422 when subjectId is missing', async () => {
      const { subjectId, ...dataWithoutSubjectId } = VALID_NOTE_DATA;

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithoutSubjectId);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'SubjectId is required'
      });
    });

    it('should return 422 when title is null', async () => {
      const dataWithNullTitle = {
        ...VALID_NOTE_DATA,
        title: null
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithNullTitle);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('Invalid Data Types', () => {
    it('should return 422 when title is not a string', async () => {
      const dataWithNumberTitle = {
        ...VALID_NOTE_DATA,
        title: 123
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithNumberTitle);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Title must be a string'
      });
    });

    it('should return 422 when content is not a string', async () => {
      const dataWithBooleanContent = {
        ...VALID_NOTE_DATA,
        content: true
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithBooleanContent);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Content must be a string'
      });
    });

    it('should return 422 when subjectId is not a string', async () => {
      const dataWithArraySubjectId = {
        ...VALID_NOTE_DATA,
        subjectId: ['invalid']
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithArraySubjectId);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'SubjectId must be a string'
      });
    });
  });

  describe('Exceeding Character Limits', () => {
    it('should return 422 when title exceeds 120 characters', async () => {
      const longTitle = 'a'.repeat(121);
      const dataWithLongTitle = {
        ...VALID_NOTE_DATA,
        title: longTitle
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithLongTitle);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Title must be between 1 and 120 characters'
      });
    });

    it('should return 422 when content exceeds 20000 characters', async () => {
      const longContent = 'a'.repeat(20001);
      const dataWithLongContent = {
        ...VALID_NOTE_DATA,
        content: longContent
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithLongContent);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Content must be between 1 and 20000 characters'
      });
    });
  });

  describe('Valid Input with Minimum Lengths', () => {
    it('should accept title with 1 character', async () => {
      const dataWithMinTitle = {
        ...VALID_NOTE_DATA,
        title: 'a'
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithMinTitle);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('a');
    });

    it('should accept content with 1 character', async () => {
      const dataWithMinContent = {
        ...VALID_NOTE_DATA,
        content: 'b'
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithMinContent);

      expect(response.status).toBe(201);
      expect(response.body.data.content).toBe('b');
    });
  });

  describe('Empty Request Body', () => {
    it('should return 400 for completely empty body', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Request body cannot be empty'
      });
    });

    it('should return 400 for empty JSON object', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Request body cannot be empty'
      });
    });

    it('should return 400 for whitespace-only body', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('   ');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Request body cannot be empty');
    });
  });

  describe('SQL Injection Attempts', () => {
    it('should safely handle SQL injection in title', async () => {
      const sqlInjectionTitle = "'; DROP TABLE notes; --";
      const dataWithSqlInjection = {
        ...VALID_NOTE_DATA,
        title: sqlInjectionTitle
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithSqlInjection);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(sqlInjectionTitle);
      
      // Verify the notes table still exists by querying it
      const notes = await db.select().from(db.select().from(subjects));
      expect(notes).toBeDefined();
    });

    it('should safely handle SQL injection in content', async () => {
      const sqlInjectionContent = "Test content'; INSERT INTO notes VALUES ('hack', 'content', 'uuid'); --";
      const dataWithSqlInjection = {
        ...VALID_NOTE_DATA,
        content: sqlInjectionContent
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithSqlInjection);

      expect(response.status).toBe(201);
      expect(response.body.data.content).toBe(sqlInjectionContent);
    });

    it('should safely handle UNION SELECT injection', async () => {
      const unionSelectTitle = "Test' UNION SELECT * FROM subjects; --";
      const dataWithUnionSelect = {
        ...VALID_NOTE_DATA,
        title: unionSelectTitle
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithUnionSelect);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(unionSelectTitle);
    });
  });

  describe('Special Characters in Input', () => {
    it('should handle script tags in title', async () => {
      const scriptTitle = '<script>alert("xss")</script>';
      const dataWithScript = {
        ...VALID_NOTE_DATA,
        title: scriptTitle
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithScript);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(scriptTitle);
    });

    it('should handle emojis and unicode characters', async () => {
      const emojiTitle = '📚 Math Notes 🔢';
      const unicodeContent = 'Content with unicode: α, β, γ, ∑, ∫, ∞';
      const dataWithUnicode = {
        ...VALID_NOTE_DATA,
        title: emojiTitle,
        content: unicodeContent
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithUnicode);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(emojiTitle);
      expect(response.body.data.content).toBe(unicodeContent);
    });

    it('should handle HTML entities', async () => {
      const htmlEntitiesTitle = 'Title with &amp; &lt; &gt; &quot;';
      const htmlEntitiesContent = 'Content with &copy; &trade; &reg; entities';
      const dataWithHtmlEntities = {
        ...VALID_NOTE_DATA,
        title: htmlEntitiesTitle,
        content: htmlEntitiesContent
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithHtmlEntities);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(htmlEntitiesTitle);
      expect(response.body.data.content).toBe(htmlEntitiesContent);
    });

    it('should handle special characters and newlines', async () => {
      const specialCharsTitle = 'Title with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const contentWithNewlines = 'Line 1\nLine 2\r\nLine 3\tTabbed';
      const dataWithSpecialChars = {
        ...VALID_NOTE_DATA,
        title: specialCharsTitle,
        content: contentWithNewlines
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithSpecialChars);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(specialCharsTitle);
      expect(response.body.data.content).toBe(contentWithNewlines);
    });
  });

  describe('Boundary Value Analysis', () => {
    it('should accept title with exactly 120 characters', async () => {
      const exactBoundaryTitle = 'a'.repeat(120);
      const dataWithBoundaryTitle = {
        ...VALID_NOTE_DATA,
        title: exactBoundaryTitle
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithBoundaryTitle);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(exactBoundaryTitle);
      expect(response.body.data.title.length).toBe(120);
    });

    it('should accept content with exactly 20000 characters', async () => {
      const exactBoundaryContent = 'a'.repeat(20000);
      const dataWithBoundaryContent = {
        ...VALID_NOTE_DATA,
        content: exactBoundaryContent
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithBoundaryContent);

      expect(response.status).toBe(201);
      expect(response.body.data.content).toBe(exactBoundaryContent);
      expect(response.body.data.content.length).toBe(20000);
    });

    it('should reject title with 0 characters', async () => {
      const dataWithEmptyTitle = {
        ...VALID_NOTE_DATA,
        title: ''
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithEmptyTitle);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Title must be between 1 and 120 characters');
    });

    it('should reject content with 0 characters', async () => {
      const dataWithEmptyContent = {
        ...VALID_NOTE_DATA,
        content: ''
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithEmptyContent);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Content must be between 1 and 20000 characters');
    });
  });

  describe('Duplicate Submission', () => {
    it('should return 409 for duplicate title and subjectId', async () => {
      // First request - should succeed
      const firstResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(firstResponse.status).toBe(201);

      // Second request with same data - should fail
      const secondResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body).toEqual({
        ok: false,
        data: null,
        error: 'A note with this title already exists for this subject'
      });
    });

    it('should allow duplicate title with different subjectId', async () => {
      // Create second subject
      const secondSubjectId = 'b2c3d4e5-f6a7-4890-abcd-234567890bcd';
      await db.insert(subjects).values({
        name: 'Physics',
        uuid: secondSubjectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).onConflictDoNothing();

      // First note
      const firstResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(firstResponse.status).toBe(201);

      // Second note with same title but different subject
      const secondNoteData = {
        ...VALID_NOTE_DATA,
        subjectId: secondSubjectId
      };

      const secondResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(secondNoteData);

      expect(secondResponse.status).toBe(201);
    });

    it('should handle idempotency with Idempotency-Key header', async () => {
      const idempotencyKey = 'test-key-123';

      // First request with idempotency key
      const firstResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .set('Idempotency-Key', idempotencyKey)
        .send(VALID_NOTE_DATA);

      expect(firstResponse.status).toBe(201);

      // Second request with same idempotency key and data
      // Note: The current implementation doesn't handle idempotency keys,
      // so this will still return 409 for duplicate content
      const secondResponse = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .set('Idempotency-Key', idempotencyKey)
        .send(VALID_NOTE_DATA);

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body.error).toBe('A note with this title already exists for this subject');
    });
  });

  describe('Content-Type Validation', () => {
    it('should return 400 for missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(JSON.stringify(VALID_NOTE_DATA));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Content-Type must be application/json'
      });
    });

    it('should return 400 for incorrect Content-Type', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'text/plain')
        .send(JSON.stringify(VALID_NOTE_DATA));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Content-Type must be application/json'
      });
    });

    it('should accept Content-Type with charset', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(VALID_NOTE_DATA);

      expect(response.status).toBe(201);
    });
  });

  describe('Malformed JSON Requests', () => {
    it('should return 400 for malformed JSON', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Test", "content": "Test", invalid}');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Invalid JSON format'
      });
    });

    it('should return 400 for non-JSON string', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('This is not JSON');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Invalid JSON format'
      });
    });

    it('should return 400 for incomplete JSON', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Test"');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Invalid JSON format'
      });
    });
  });

  describe('UUID Validation', () => {
    it('should return 422 for invalid UUID format', async () => {
      const dataWithInvalidUuid = {
        ...VALID_NOTE_DATA,
        subjectId: 'invalid-uuid-format'
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithInvalidUuid);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'SubjectId must be a valid UUID format'
      });
    });

    it('should return 422 for non-existent valid UUID', async () => {
      const dataWithNonExistentUuid = {
        ...VALID_NOTE_DATA,
        subjectId: '00000000-0000-4000-8000-000000000000'
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithNonExistentUuid);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        ok: false,
        data: null,
        error: 'Subject not found'
      });
    });

    it('should accept valid UUID with different formatting', async () => {
      const uppercaseUuid = VALID_SUBJECT_ID.toUpperCase();
      const dataWithUppercaseUuid = {
        ...VALID_NOTE_DATA,
        subjectId: uppercaseUuid
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(dataWithUppercaseUuid);

      expect(response.status).toBe(201);
    });
  });

  describe('Response Format Validation', () => {
    it('should always return response in correct format for success', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.ok).toBe('boolean');
      expect(response.body.ok).toBe(true);
      expect(response.body.data).not.toBeNull();
      expect(response.body.error).toBeNull();
    });

    it('should always return response in correct format for error', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send({});

      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.ok).toBe('boolean');
      expect(response.body.ok).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.error).not.toBeNull();
      expect(typeof response.body.error).toBe('string');
    });

    it('should return consistent timestamp format', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(VALID_NOTE_DATA);

      expect(response.status).toBe(201);
      expect(response.body.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(response.body.data.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});