// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types

declare namespace App {
	// interface Locals {}

	interface Supabase {
		Database: import('$types/supabase').Database;
		SchemaName: 'public';
	}

	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}

	// interface Platform {}

	// interface PrivateEnv {}

	// interface PublicEnv {}

	interface Session {
		user: import('@supabase/supabase-js').User | null;
		access_token: string;
	}

	// interface Stuff {}
}
declare type DndEvent = import('svelte-dnd-action').DndEvent;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
	}
}
