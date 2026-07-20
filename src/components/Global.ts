export function isValidUrl(value: string): boolean {
    const trimmed = value.trim();

    if(!trimmed) return false;

    const strictHttpsRegex = /^https:\/\/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d{1,5})?(\/[a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]*)?$/;

    return strictHttpsRegex.test(trimmed);
}
