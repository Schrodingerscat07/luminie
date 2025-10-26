const fs = require('fs');
const path = require('path');

// List of route files to fix
const routeFiles = [
  'src/routes/admin.ts',
  'src/routes/assignments.ts',
  'src/routes/comments.ts',
  'src/routes/enrollments.ts',
  'src/routes/modules.ts',
  'src/routes/reviews.ts'
];

function fixRoutes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import for Express types if not present
    if (!content.includes('import { Request, Response, NextFunction }')) {
      content = content.replace(
        /import express from 'express'/,
        "import express from 'express'\nimport { Request, Response, NextFunction } from 'express'"
      );
    }
    
    // Fix middleware usage
    content = content.replace(/router\.use\(authMiddleware\)/g, 'router.use(authMiddleware as any)');
    content = content.replace(/router\.use\(adminMiddleware\)/g, 'router.use(adminMiddleware as any)');
    content = content.replace(/router\.use\(professorMiddleware\)/g, 'router.use(professorMiddleware as any)');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed routes in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all route files
routeFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixRoutes(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Done fixing route files!');

