import { AniListDate } from '../types'; // Added AniListDate

// Helper to parse date strings (YYYY-MM-DD or DD/MM/YYYY)
export const parseDateString = (dateStr: string | undefined | null): Date | null => {
  if (!dateStr) return null;
  
  // Try YYYY-MM-DD first (more standard for input type="date")
  let match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match.map(Number);
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() === year && d.getMonth() === month -1 && d.getDate() === day) {
        return d;
    }
  }

  // Try DD/MM/YYYY
  match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [_, day, month, year] = match.map(Number);
    const d = new Date(year, month - 1, day);
     if (d.getFullYear() === year && d.getMonth() === month -1 && d.getDate() === day) {
        return d;
    }
  }
  
  // Fallback for dates that might be directly parsable by Date constructor (less reliable for specific formats)
  const genericDate = new Date(dateStr);
  if (!isNaN(genericDate.getTime())) {
      // Check if it's a valid date object and not just epoch 0 for invalid strings
      // This is a loose check; prefer specific format parsing above.
      if (dateStr.includes(String(genericDate.getFullYear())) && 
          (dateStr.includes(String(genericDate.getMonth()+1)) || dateStr.includes(String(genericDate.getDate())))) {
        return genericDate;
      }
  }
  return null;
};

// Returns date as YYYY-MM-DD
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Formats a Date object to 'YYYY-MM-DD' string
export const formatToYYYYMMDD = (date: Date | null | undefined): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parses a 'YYYY-MM-DD' string to a Date object
export const parseFromYYYYMMDD = (dateStr: string | null | undefined): Date | null => {
    if (!dateStr) return null;
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        const [_, year, month, day] = match.map(Number);
        const d = new Date(year, month - 1, day);
        if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
            return d;
        }
    }
    return null;
};

// Parses a DD/MM/YYYY or YYYY-MM-DD string into a Date object and then reformats it to 'YYYY-MM-DD'
// Useful for ensuring date inputs are correctly formatted for `type="date"`
export const parseAndFormatToYYYYMMDD = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    const parsedDate = parseDateString(dateStr);
    return parsedDate ? formatToYYYYMMDD(parsedDate) : '';
};

// Formats an AniListDate object to 'YYYY-MM-DD' string for date input fields
export const formatAniListDateForInput = (date: AniListDate | undefined): string => {
  if (!date || !date.year || !date.month || !date.day) return '';
  const day = String(date.day).padStart(2, '0');
  const month = String(date.month).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
};

// Formats a Date object to 'DD/MM/YYYY' string
export const formatToDDMMYYYY = (date: Date | null | undefined): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Parses a date string (various formats) and then reformats it to 'DD/MM/YYYY'
export const parseAndFormatToDDMMYYYY = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    const parsedDate = parseDateString(dateStr); // Uses the existing robust parser
    return parsedDate ? formatToDDMMYYYY(parsedDate) : '';
};
