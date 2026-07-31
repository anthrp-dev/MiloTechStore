// Formatea el número de tarjeta.
//
// Ejemplo:
// Entrada:  "1234abcd567890123456"
// Salida:   "1234 5678 9012 3456"

export function formatCardNumber(rawValue) {
    let digits = rawValue.replace(/\D/g, "");       // Elimina cualquier carácter que no sea un número.
    digits = digits.slice(0, 16);       // Limita el número de tarjeta a 16 dígitos.
    
    // Agrupa los dígitos de 4 en 4 separados por espacios.
    //
    // Ejemplo:
    // 1234567890123456
    // ↓
    // 1234 5678 9012 3456
    return digits.match(/.{1,4}/g)?.join(" ") ?? "";
}

// Formatea la fecha de expiración.
//
// Ejemplo:
// Entrada: "1234"
// Salida:  "12/34"

export function formatExpiry(rawValue) {
    // Elimina todo lo que no sea un número
    // y limita la entrada a 4 dígitos.
    let digits = rawValue.replace(/\D/g, "").slice(0, 4);

    // Cuando ya existen al menos 3 dígitos,
    // inserta automáticamente la barra.
    if (digits.length >= 3) {
        digits = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
}

// Formatea el CVV.
//
// Solo permite números y un máximo de 3 dígitos.

export function formatCvv(rawValue) {
    return rawValue.replace(/\D/g, "").slice(0, 3);
}

// --- Validaciones ---

// Valida el nombre del titular.
//
// Regla:
// Debe contener al menos dos palabras.

export function isValidCardholderName(name) {
    return name.trim().split(" ").filter(Boolean).length >= 2;
}

// Valida el número de tarjeta.
//
// Regla:
// Debe contener exactamente 16 dígitos.

export function isValidCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\D/g, "");       // Elimina los espacios.
    return digits.length === 16;
}

// Valida la fecha de expiración.
//
// Regla:
//
// Debe tener el formato:
// MM/YY
//
// Además,
// el mes debe estar entre 01 y 12.

export function isValidExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);       // Comprueba que el formato sea MM/YY
    if (!match) return false;       // Si no cumple el formato, termina inmediatamente.

    const month = Number(match[1]);     // Obtiene el mes.
    return month >= 1 && month <= 12;       // Verifica que el mes sea válido.
}

// Valida el CVV.
//
// Regla:
// Debe contener exactamente 3 dígitos.

export function isValidCvv(cvv) {
    return cvv.length === 3;
}

// Recibe todos los datos del formulario,
// ejecuta cada validación y devuelve
// un objeto indicando cuáles campos son válidos.

export function validateCheckoutData({name, cardNumber, expiry, cvv}) {
    return {
        name: isValidCardholderName(name),
        cardNumber: isValidCardNumber(cardNumber),
        expiry: isValidExpiry(expiry),
        cvv: isValidCvv(cvv)
    };
}