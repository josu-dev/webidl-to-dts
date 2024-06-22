import { browser } from '$app/environment';

type StateLocalReturn<T> = {
    value: T;
};

export function state_local<T>(key: string, initial?: T, prefix: string = ''): StateLocalReturn<T> {
    const state_key = `${prefix}${key}`;

    let stored_value = initial as T;
    if (browser) {
        try {
            stored_value = JSON.parse(localStorage.getItem(state_key) ?? 'null') ?? initial;
        } catch (exc) {
            console.debug(`Failed to load state from localStorage for key: ${state_key}`, exc);
        }
    }

    const state = $state({ value: stored_value });

    $effect(() => {
        try {
            localStorage.setItem(state_key, JSON.stringify(state.value));
        } catch {
            console.debug(`Failed to save state to localStorage for key: ${state_key}`);
        }
    });

    return state;
}
