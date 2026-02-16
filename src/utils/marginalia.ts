/** Reversed sequence number. Oldest = :001, newest = :total. */
export function getSeqNum(index: number, total: number): string {
  const num = total - index;
  return `:${String(num).padStart(3, "0")}`;
}

/** First 4 hex chars of a simple content hash. */
export function getContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash |= 0;
  }
  return `#${Math.abs(hash).toString(16).slice(0, 4)}`;
}

/** 2847 -> "2.8k words", 532 -> "532 words" */
export function formatWordCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k words`;
  return `${count} words`;
}

/** "5 min read" -> "5 min" */
export function formatReadingTime(readingTime: string): string {
  return readingTime.replace(" read", "");
}

/** Date -> "YYYY.MM.DD" */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** startDate -> "2y4m" age string */
export function formatProjectAge(startDate: Date): string {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years > 0) return `${years}y${months}m`;
  return `${months}m`;
}
