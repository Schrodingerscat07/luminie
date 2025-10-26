const fs = require('fs');
const path = require('path');

// List of controller files to fix
const controllerFiles = [
  'src/controllers/adminController.ts',
  'src/controllers/assignmentController.ts',
  'src/controllers/authController.ts',
  'src/controllers/commentController.ts',
  'src/controllers/courseController.ts',
  'src/controllers/enrollmentController.ts',
  'src/controllers/moduleController.ts',
  'src/controllers/reviewController.ts',
  'src/controllers/userController.ts'
];

function fixReturns(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix res.json() calls that don't have return
    content = content.replace(/(\s+)res\.json\(/g, '$1return res.json(');
    content = content.replace(/(\s+)res\.status\(\d+\)\.json\(/g, '$1return res.status($2).json(');
    
    // Fix res.status() calls that don't have return
    content = content.replace(/(\s+)res\.status\(\d+\)\.json\(/g, '$1return res.status($2).json(');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed returns in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all controller files
controllerFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixReturns(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Done fixing return statements!');

