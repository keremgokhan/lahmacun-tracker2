interface Tracker {
  id: string; // Unique identifier (e.g., UUID)
  name: string; // Name of the tracker (e.g., "No Sugar")
  startDate: string; // ISO string format for date and time (e.g., "2023-10-27T10:00:00.000Z")
  type: 'addiction' | 'habit'; // To distinguish the tracker's purpose
}

interface Quote {
  id: string;
  text: string;
  author?: string; // Optional author
}
