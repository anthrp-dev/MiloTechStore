export function formatCardNumber(rawValue) {
    let digits = rawValue.replace(/\D/g, "");
    digits = digits.slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") ?? "";
}

