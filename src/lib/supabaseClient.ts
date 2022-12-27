import { createClient } from '@supabase/auth-helpers-sveltekit';

export const supabase = createClient(
	`https://${import.meta.env?.VITE_SUPABASE_ID ?? ''}.supabase.co`,
	import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '',
	{
		realtime: {
			params: {
				eventsPerSecond: 10
			}
		}
	}
);
