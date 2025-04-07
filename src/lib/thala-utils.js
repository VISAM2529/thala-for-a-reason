/**
 * Utility functions for the Thala meme generator
 */

/**
 * Check if a string has Thala significance (7 letters or sum of digits equals 7)
 * @param {string} input - The input string to check
 * @returns {boolean} True if input has Thala significance
 */
export function isThalaWorthy(input) {
    if (!input) return false;
    
    // Remove spaces for letter counting
    const cleanInput = input.replace(/\s/g, '');
    
    // Check if length is 7
    if (cleanInput.length === 7) return true;
    
    // Check if sum of digits is 7
    if (/^\d+$/.test(cleanInput)) {
      const sum = cleanInput.split('').reduce((a, b) => a + parseInt(b), 0);
      return sum === 7;
    }
    
    // Check if input is "Dhoni" or "MSDhoni" or other variants
    const lowerInput = cleanInput.toLowerCase();
    if (
      lowerInput === 'dhoni' || 
      lowerInput === 'msdhoni' ||
      lowerInput === 'thala'
    ) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Generate a funny Thala reason for the input
   * @param {string} input - The input string
   * @returns {string} A humorous Thala reason
   */
  export function generateThalaReason(input) {
    if (!input) return '';
    
    const cleanInput = input.replace(/\s/g, '');
    
    // If it's a number with digits summing to 7
    if (/^\d+$/.test(cleanInput)) {
      const digits = cleanInput.split('');
      return `${digits.join(' + ')} = 7, Thala for a reason! 🏆`;
    }
    
    // If it has 7 letters
    if (cleanInput.length === 7) {
      return `${cleanInput} has 7 letters, Thala for a reason! 🏆`;
    }
    
    // Special cases
    if (cleanInput.toLowerCase() === 'dhoni' || cleanInput.toLowerCase() === 'msdhoni') {
      return 'MS Dhoni is THE original Thala! 🏆';
    }
    
    return 'Thala for a reason! 🏆';
  }
  
  /**
   * Get a random Thala meme template
   * @returns {string} Path to a random meme template
   */
  export function getRandomThalaTemplate() {
    const templates = [
      '/images/thala-templates/template-1.jpg',
      '/images/thala-templates/template-2.jpg',
      '/images/thala-templates/template-3.jpg',
    ];
    
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }