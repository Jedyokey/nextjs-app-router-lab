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
