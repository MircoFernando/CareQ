export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) return 'Due now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''}`;
  
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 0: return 'Emergency';
    case 1: return 'Urgent';
    case 2: return 'Normal';
    default: return 'Normal';
  }
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  // Masks all but the country code + first 4 digits and last 2, or standard +94771234*** format
  if (phone.startsWith('+94')) {
    return `+94 77 *** ${phone.slice(-3)}`;
  }
  if (phone.length > 6) {
    return `${phone.slice(0, 4)}***${phone.slice(-2)}`;
  }
  return '*** ***';
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
