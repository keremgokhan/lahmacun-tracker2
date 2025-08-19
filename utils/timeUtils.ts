export interface TimePart {
  key: string; // e.g., 'y', 'mo', 'd', 'h', 'm', 's', 'just-started'
  text: string; // e.g., '1 year', '5 minutes', 'Just started'
}

export const formatTimeSince = (startDateString: string): TimePart[] => {
  const now = new Date();
  const startDate = new Date(startDateString);
  const diffMs = now.getTime() - startDate.getTime();

  if (diffMs < 1000) {
    return [{ key: 'just-started', text: 'Just started' }];
  }

  let totalSeconds = Math.floor(diffMs / 1000);
  const parts: TimePart[] = [];

  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
  const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
  const APPROX_SECONDS_PER_MONTH = SECONDS_PER_DAY * 30; // Approximation
  const APPROX_SECONDS_PER_YEAR = SECONDS_PER_DAY * 365; // Approximation

  const years = Math.floor(totalSeconds / APPROX_SECONDS_PER_YEAR);
  if (years > 0) {
    parts.push({ key: 'y', text: `${years} year${years !== 1 ? 's' : ''}` });
    totalSeconds %= APPROX_SECONDS_PER_YEAR;
  }

  const months = Math.floor(totalSeconds / APPROX_SECONDS_PER_MONTH);
  if (months > 0) {
    parts.push({ key: 'mo', text: `${months} month${months !== 1 ? 's' : ''}` });
    totalSeconds %= APPROX_SECONDS_PER_MONTH;
  }

  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
  if (days > 0) {
    parts.push({ key: 'd', text: `${days} day${days !== 1 ? 's' : ''}` });
    totalSeconds %= SECONDS_PER_DAY;
  }

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  if (hours > 0) {
    parts.push({ key: 'h', text: `${hours} hour${hours !== 1 ? 's' : ''}` });
    totalSeconds %= SECONDS_PER_HOUR;
  }

  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  if (minutes > 0) {
    parts.push({ key: 'm', text: `${minutes} minute${minutes !== 1 ? 's' : ''}` });
    totalSeconds %= SECONDS_PER_MINUTE;
  }

  const seconds = totalSeconds;
  // Always show the seconds badge if we've passed the "Just started" phase
  // or if it's the only unit (e.g. "0 seconds" if a minute just ticked over and no other units are present)
  if (parts.length === 0 || seconds > 0 || (seconds === 0 && diffMs >= 1000)) {
     parts.push({ key: 's', text: `${seconds} second${seconds !== 1 ? 's' : ''}` });
  }


  return parts;
};