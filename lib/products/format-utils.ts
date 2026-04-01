export function formatUsername(email: string | null) {
    if (!email) return "Community";

    // Remove numbers and take the local-part of the email
    let username = email.split('@')[0].replace(/[0-9]/g, '');

    let formatted = username
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();

    if (formatted.includes(' ')) {
        return formatted;
    }

    // heuristic: try to split a concatenated name using a small list of common name parts
    const commonParts = [
        'joseph', 'john', 'mary', 'anna', 'alex', 'sam', 'chris', 'david',
        'michael', 'linda', 'kevin', 'james', 'robert', 'william', 'emma',
        'olivia', 'sophia', 'isaac', 'felix', 'frederick', 'thomas', 'andrew',
        'laura', 'sarah', 'james', 'jennifer', 'ashley', 'nicholas', 'joshua',
        'ethan', 'benjamin', 'daniel', 'anthony', 'charles', 'steven', 'patrick',
        'brian', 'ryan', 'matthew'
    ];

    const lower = username.toLowerCase();
    for (const part of commonParts) {
        if (lower.endsWith(part) && lower !== part) {
            const idx = lower.lastIndexOf(part);
            const first = username.slice(0, idx);
            const second = username.slice(idx);
            formatted = `${capitalize(first)} ${capitalize(second)}`;
            break;
        }
    }

    return formatted;
}

// helper to uppercase first letter only
function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export interface MentionData {
    id: string;
    name: string;
    handle: string;
}

// Replaces @[Name](id) from DB into @Name for the textarea
export function decodeMentions(text: string): { text: string; mentions: MentionData[] } {
    const mentions: MentionData[] = [];
    const decodedText = text.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, (match, name, id) => {
        const handle = name;
        // Only add if not already in the array
        if (!mentions.some(m => m.id === id)) {
            mentions.push({ handle, name, id });
        }
        return `@${handle}`;
    });
    return { text: decodedText, mentions };
}

// Replaces @Name in textarea back into @[Name](id) for the DB
export function encodeMentions(text: string, mentions: MentionData[]): string {
    let result = text;
    // Sort mentions by handle length descending to replace longer handles first to avoid partial matches
    const sortedMentions = [...mentions].sort((a, b) => b.handle.length - a.handle.length);
    
    sortedMentions.forEach(m => {
        // Escaping handle to ensure it works correctly in RegExp
        const escapedHandle = m.handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`@${escapedHandle}\\b`, "g");
        result = result.replace(regex, `@[${m.name}](${m.id})`);
    });
    return result;
}
