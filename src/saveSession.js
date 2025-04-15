const SESSION_KEY = 'knitDesignerSession';

export function getSavedSession() {
    let data = sessionStorage.getItem(SESSION_KEY);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to parse sessionStorage data:', e);
        return null;
    }
}

export function updateSavedSession(changes) {
    const current = getSavedSession() || {};
    const updated = {
        ...current,
        ...changes
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
}