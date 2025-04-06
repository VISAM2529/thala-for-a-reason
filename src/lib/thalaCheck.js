/**
 * Utility functions to check if something is "Thala for a reason"
 * Thala refers to MS Dhoni (jersey number 7), and the check is 
 * to see if the input relates to the number 7 in any way
 */

/**
 * Main function to check if input has any relation to number 7
 * @param {string} input - The input string to check
 * @returns {Object} - Result object with isThala and explanation
 */
export function checkThala(input) {
    // Convert input to string and trim
    const str = String(input).trim();
    
    // Check if input is empty
    if (!str) {
      return {
        input: str,
        isThala: false,
        explanation: "Input is empty"
      };
    }
    
    // Check if input is directly "7" or "seven"
    if (str === "7" || str.toLowerCase() === "seven") {
      return {
        input: str,
        isThala: true,
        explanation: "Directly equals 7"
      };
    }
    
    // Check if input is "MS Dhoni" or variations
    if (
      str.toLowerCase() === "ms dhoni" || 
      str.toLowerCase() === "dhoni" || 
      str.toLowerCase() === "mahi" ||
      str.toLowerCase() === "mahendra singh dhoni"
    ) {
      return {
        input: str,
        isThala: true,
        explanation: "MS Dhoni (Thala) wears jersey number 7"
      };
    }
    
    // Check if input length is 7
    if (str.length === 7) {
      return {
        input: str,
        isThala: true,
        explanation: `"${str}" has 7 characters`
      };
    }
    
    // Check if number equals 7
    const numValue = Number(str);
    if (!isNaN(numValue) && numValue === 7) {
      return {
        input: str,
        isThala: true,
        explanation: `Equals 7`
      };
    }
    
    // Check if sum of digits equals 7
    if (!isNaN(numValue)) {
      const digitSum = sumOfDigits(numValue);
      if (digitSum === 7) {
        return {
          input: str,
          isThala: true,
          explanation: `Sum of digits equals 7 (${splitIntoDigits(numValue).join(' + ')} = 7)`
        };
      }
    }
    
    // Check if sum of characters in word equals 7
    if (isNaN(numValue) && str.split(" ").length === 1) {
      const wordSum = sumOfCharValues(str);
      if (wordSum === 7) {
        return {
          input: str,
          isThala: true,
          explanation: `Sum of character values equals 7`
        };
      }
    }
    
    // Check if number of words equals 7
    const words = str.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 7) {
      return {
        input: str,
        isThala: true,
        explanation: "Contains exactly 7 words"
      };
    }
    
    // Creative checks for common 7 references
    if (
      str.toLowerCase().includes("week") ||
      str.toLowerCase().includes("rainbow") ||
      str.toLowerCase().includes("deadly sins") ||
      str.toLowerCase().includes("wonders of the world")
    ) {
      return {
        input: str,
        isThala: true,
        explanation: "References a concept related to 7 (days of week, colors of rainbow, etc.)"
      };
    }
    
    // If none of the above conditions are met, it's not Thala
    return {
      input: str,
      isThala: false,
      explanation: "No connection to 7 found"
    };
  }
  
  /**
   * Helper function to calculate sum of digits in a number
   */
  function sumOfDigits(num) {
    return Math.abs(num)
      .toString()
      .split('')
      .map(Number)
      .reduce((sum, digit) => sum + digit, 0);
  }
  
  /**
   * Helper function to split a number into its digits
   */
  function splitIntoDigits(num) {
    return Math.abs(num)
      .toString()
      .split('')
      .map(Number);
  }
  
  /**
   * Helper function to calculate sum of character values (a=1, b=2, etc.)
   */
  function sumOfCharValues(str) {
    return str
      .toLowerCase()
      .split('')
      .filter(char => /[a-z]/.test(char))
      .map(char => char.charCodeAt(0) - 96)
      .reduce((sum, val) => sum + val, 0);
  }