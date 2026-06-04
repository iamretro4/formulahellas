import { redirect } from 'next/navigation';

// The inaugural edition is the only competition — send /events to /events/2026.
export default function EventsPage() {
  redirect('/events/2026');
}
