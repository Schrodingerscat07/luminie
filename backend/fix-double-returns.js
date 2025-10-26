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

function fixDoubleReturns(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix double return statements
    content = content.replace(/return return /g, 'return ');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed double returns in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all controller files
controllerFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixDoubleReturns(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Done fixing double returns!');

