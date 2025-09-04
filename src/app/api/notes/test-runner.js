const assert = require('assert');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/notes`;
const VALID_SUBJECT_ID = 'a1b2c3d4-e5f6-4789-9abc-123456789abc'; // Mathematics from seeded data

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

// Test statistics
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;
const createdNoteIds = [];

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, message = '') {
  testsRun++;
  if (status === 'PASS') {
    testsPassed++;
    log(`✅ PASS: ${testName}`, 'green');
    if (message) log(`   ${message}`, 'green');
  } else {
    testsFailed++;
    log(`❌ FAIL: ${testName}`, 'red');
    if (message) log(`   ${message}`, 'red');
  }
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'yellow');
}

// Cleanup function to delete created notes
async function cleanupNote(noteId) {
  if (!noteId) return;
  try {
    // Since we don't have DELETE endpoint, we'll just track for manual cleanup
    // In a real scenario, you'd implement DELETE endpoint or use database cleanup
    logInfo(`Note ${noteId} created - would need manual cleanup`);
  } catch (error) {
    // Ignore cleanup errors
  }
}

// Main test functions
async function testSuccessfulPost() {
  const testName = 'Successful POST Request';
  try {
    const payload = {
      title: 'Test Note Success',
      content: 'This is a test note content for successful post.',
      subjectId: VALID_SUBJECT_ID
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.ok, true);
    assert(data.data);
    assert.strictEqual(data.data.title, payload.title);
    assert.strictEqual(data.data.content, payload.content);
    assert.strictEqual(data.data.subjectId, payload.subjectId);

    createdNoteIds.push(data.data.id);
    logTest(testName, 'PASS', `Created note with ID: ${data.data.id}`);
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testMissingRequiredFields() {
  const testName = 'Missing Required Fields';
  try {
    // Test missing title
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Content without title',
        subjectId: VALID_SUBJECT_ID
      })
    });

    let data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Title is required'));

    // Test missing content
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Title without content',
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Content is required'));

    // Test missing subjectId
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Title without subject',
        content: 'Content without subject'
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('SubjectId is required'));

    logTest(testName, 'PASS', 'All missing field validations work correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testInvalidDataTypes() {
  const testName = 'Invalid Data Types';
  try {
    // Test non-string title
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 123,
        content: 'Valid content',
        subjectId: VALID_SUBJECT_ID
      })
    });

    let data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Title must be a string'));

    // Test non-string content
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Valid title',
        content: 123,
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Content must be a string'));

    // Test non-string subjectId
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Valid title',
        content: 'Valid content',
        subjectId: 123
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('SubjectId must be a string'));

    logTest(testName, 'PASS', 'All data type validations work correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testExceedingCharacterLimits() {
  const testName = 'Exceeding Character Limits';
  try {
    // Test title too long (> 120 chars)
    const longTitle = 'A'.repeat(121);
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: longTitle,
        content: 'Valid content',
        subjectId: VALID_SUBJECT_ID
      })
    });

    let data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Title must be between 1 and 120 characters'));

    // Test content too long (> 20000 chars)
    const longContent = 'A'.repeat(20001);
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Valid title',
        content: longContent,
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Content must be between 1 and 20000 characters'));

    // Test empty title
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '',
        content: 'Valid content',
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Title must be between 1 and 120 characters'));

    logTest(testName, 'PASS', 'All character limit validations work correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testValidInput() {
  const testName = 'Valid Input Edge Cases';
  try {
    // Test minimum length title (1 char)
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'A',
        content: 'Minimum title test',
        subjectId: VALID_SUBJECT_ID
      })
    });

    let data = await response.json();
    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.ok, true);
    createdNoteIds.push(data.data.id);

    // Test maximum length title (120 chars)
    const maxTitle = 'B'.repeat(120);
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: maxTitle,
        content: 'Maximum title test',
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.ok, true);
    createdNoteIds.push(data.data.id);

    logTest(testName, 'PASS', 'Valid edge case inputs accepted');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testEmptyRequestBody() {
  const testName = 'Empty Request Body';
  try {
    // Test completely empty body
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    });

    let data = await response.json();
    assert.strictEqual(response.status, 400);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Request body cannot be empty'));

    // Test empty object
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    data = await response.json();
    assert.strictEqual(response.status, 400);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Request body cannot be empty'));

    // Test missing Content-Type header
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        content: 'Test',
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 400);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('Content-Type must be application/json'));

    logTest(testName, 'PASS', 'Empty body validations work correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testSqlInjectionAttempt() {
  const testName = 'SQL Injection Attempt';
  try {
    const maliciousInputs = [
      "'; DROP TABLE notes; --",
      "1' OR '1'='1",
      "admin'; UPDATE notes SET title='hacked' WHERE '1'='1'; --",
      "<script>alert('XSS')</script>",
      "../../etc/passwd"
    ];

    for (const maliciousInput of maliciousInputs) {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: maliciousInput,
          content: 'Testing SQL injection in title',
          subjectId: VALID_SUBJECT_ID
        })
      });

      const data = await response.json();
      
      // Should either create the note (treating as normal string) or reject for length
      if (response.status === 201) {
        assert.strictEqual(data.ok, true);
        createdNoteIds.push(data.data.id);
      } else if (response.status === 422) {
        // Acceptable if rejected for length reasons
        assert.strictEqual(data.ok, false);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    }

    logTest(testName, 'PASS', 'SQL injection attempts handled safely');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testSpecialCharactersInput() {
  const testName = 'Special Characters in Input';
  try {
    const specialInputs = [
      {
        title: 'Unicode Test: 你好世界 🌍 ñáéíóú',
        content: 'Testing unicode characters and emojis 🎉📚✨'
      },
      {
        title: 'HTML Tags: <h1>Title</h1>',
        content: 'Testing HTML: <script>alert("test")</script> & <div>content</div>'
      },
      {
        title: 'Special Chars: !@#$%^&*()[]{}|;:,.<>?',
        content: 'Testing special characters and symbols'
      },
      {
        title: 'Quotes Test: "Double" \'Single\' `Backtick`',
        content: 'Testing various quote types in content'
      }
    ];

    for (const input of specialInputs) {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...input,
          subjectId: VALID_SUBJECT_ID
        })
      });

      const data = await response.json();
      assert.strictEqual(response.status, 201);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.data.title, input.title);
      assert.strictEqual(data.data.content, input.content);
      createdNoteIds.push(data.data.id);
    }

    logTest(testName, 'PASS', 'Special characters handled correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testBoundaryValueAnalysis() {
  const testName = 'Boundary Value Analysis';
  try {
    // Test boundary values for title length
    const boundaryTests = [
      { title: 'A', length: 1, shouldPass: true },
      { title: 'B'.repeat(120), length: 120, shouldPass: true },
      { title: '', length: 0, shouldPass: false },
      { title: 'C'.repeat(121), length: 121, shouldPass: false }
    ];

    for (const test of boundaryTests) {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: test.title,
          content: `Testing boundary length ${test.length}`,
          subjectId: VALID_SUBJECT_ID
        })
      });

      const data = await response.json();

      if (test.shouldPass) {
        assert.strictEqual(response.status, 201);
        assert.strictEqual(data.ok, true);
        createdNoteIds.push(data.data.id);
      } else {
        assert.strictEqual(data.ok, false);
        assert(response.status === 422 || response.status === 400);
      }
    }

    // Test content boundary (just test the limits, not the full 20000 chars)
    const minContent = 'X';
    const maxContent = 'Y'.repeat(19999); // Close to limit

    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Min Content Test',
        content: minContent,
        subjectId: VALID_SUBJECT_ID
      })
    });

    let data = await response.json();
    assert.strictEqual(response.status, 201);
    createdNoteIds.push(data.data.id);

    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Max Content Test',
        content: maxContent,
        subjectId: VALID_SUBJECT_ID
      })
    });

    data = await response.json();
    assert.strictEqual(response.status, 201);
    createdNoteIds.push(data.data.id);

    logTest(testName, 'PASS', 'Boundary value tests passed');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testDuplicateSubmission() {
  const testName = 'Duplicate Submission';
  try {
    const payload = {
      title: 'Duplicate Test Note',
      content: 'This is a test for duplicate detection',
      subjectId: VALID_SUBJECT_ID
    };

    // First submission should succeed
    let response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let data = await response.json();
    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.ok, true);
    createdNoteIds.push(data.data.id);

    // Second submission with same title and subject should fail
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    data = await response.json();
    assert.strictEqual(response.status, 409);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('A note with this title already exists for this subject'));

    logTest(testName, 'PASS', 'Duplicate detection works correctly');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

async function testInvalidUuidFormats() {
  const testName = 'Invalid UUID Formats';
  try {
    const invalidUuids = [
      'invalid-uuid',
      '123',
      'a1b2c3d4-e5f6-4789-9abc-12345678',
      'a1b2c3d4-e5f6-4789-9abc-123456789abcdef',
      'g1b2c3d4-e5f6-4789-9abc-123456789abc',
      'a1b2c3d4e5f647899abc123456789abc',
      '',
      null
    ];

    for (const invalidUuid of invalidUuids) {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Invalid UUID',
          content: 'Testing invalid UUID format',
          subjectId: invalidUuid
        })
      });

      const data = await response.json();
      assert.strictEqual(data.ok, false);
      assert(response.status === 422 || response.status === 400);
    }

    logTest(testName, 'PASS', 'Invalid UUID format validation works');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

// Main test runner
async function runTests() {
  log('\n📝 Starting POST /api/notes API Tests\n', 'blue');
  
  const startTime = Date.now();

  // Run all tests
  await testSuccessfulPost();
  await testMissingRequiredFields();
  await testInvalidDataTypes();
  await testExceedingCharacterLimits();
  await testValidInput();
  await testEmptyRequestBody();
  await testSqlInjectionAttempt();
  await testSpecialCharactersInput();
  await testBoundaryValueAnalysis();
  await testDuplicateSubmission();
  await testInvalidUuidFormats();

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  // Cleanup notification
  if (createdNoteIds.length > 0) {
    logInfo(`Created ${createdNoteIds.length} test notes with IDs: ${createdNoteIds.join(', ')}`);
    logInfo('Note: No DELETE endpoint available - manual cleanup may be needed');
  }

  // Final summary
  log('\n📊 Test Summary', 'blue');
  log('='.repeat(50), 'blue');
  log(`Total Tests: ${testsRun}`, 'blue');
  log(`Passed: ${testsPassed}`, 'green');
  log(`Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((testsPassed / testsRun) * 100).toFixed(1)}%`, testsFailed > 0 ? 'yellow' : 'green');
  log(`Duration: ${duration.toFixed(2)}s`, 'blue');
  
  if (testsFailed === 0) {
    log('\n🎉 All tests passed!', 'green');
  } else {
    log(`\n⚠️  ${testsFailed} test(s) failed`, 'red');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/notes`);
    if (!response.ok && response.status !== 404) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    log('✅ Server is running', 'green');
    return true;
  } catch (error) {
    log(`❌ Server is not accessible: ${error.message}`, 'red');
    log('Please ensure the server is running on http://localhost:3000', 'yellow');
    return false;
  }
}

// Entry point
async function main() {
  log('🚀 Node.js API Test Runner', 'bright');
  log('Testing POST /api/notes endpoint', 'blue');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }

  await runTests();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`\n💥 Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`\n💥 Unhandled Rejection: ${reason}`, 'red');
  process.exit(1);
});

// Run the tests
main().catch((error) => {
  log(`\n💥 Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});