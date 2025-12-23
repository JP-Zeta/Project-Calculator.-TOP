const pantalla = document.querySelector('.pantalla span');
const botones = document.querySelectorAll('button');

let mostrandoResultado = false;

botones.forEach((boton) => {
    boton.addEventListener('click', () => {
        const botonPresionado = boton.textContent;

        // 1. Botón AC: Reinicia todo
        if (botonPresionado === "AC") {
            pantalla.textContent = "0";
            mostrandoResultado = false;
            return;
        }

        // 2. Botón DEL: Borra el último caracter
        if (botonPresionado === "DEL") {
            if (pantalla.textContent.length === 1 || pantalla.textContent === "0") {
                pantalla.textContent = "0";
            } else {
                pantalla.textContent = pantalla.textContent.slice(0, -1);
            }
            return;
        }

        // 3. Botón IGUAL: Aquí ocurre la magia
        if (botonPresionado === "=") {
            const expresion = pantalla.textContent;
            const resultado = calcularCadena(expresion);
            
            // Mostramos resultado cambiando punto por coma visualmente
            pantalla.textContent = resultado.toString().replace('.', ',');
            mostrandoResultado = true;
            return;
        }

        // 4. Lógica de escritura en pantalla
        const ultimoCaracter = pantalla.textContent.slice(-1);
        const operadores = ["+", "-", "*", "/", "%", ","];

        if (pantalla.textContent === "0" || mostrandoResultado) {
            // Si es un operador después de un resultado, seguimos la cuenta
            if (mostrandoResultado && operadores.includes(botonPresionado)) {
                pantalla.textContent += botonPresionado;
            } else {
                // Si es un número, empezamos pantalla nueva
                pantalla.textContent = botonPresionado;
            }
            mostrandoResultado = false;
        } else {
            // Evitar dos operadores seguidos
            if (operadores.includes(ultimoCaracter) && operadores.includes(botonPresionado)) {
                return;
            }
            pantalla.textContent += botonPresionado;
        }
    });
});

// FUNCIÓN PRINCIPAL: Sustituye a eval()
function calcularCadena(cadena) {
    // Convertimos comas a puntos para calcular
    let limpia = cadena.replace(/,/g, '.');
    
    // Paso 1: Separar números de operadores
    // Ejemplo: "10+5*2" -> ["10", "+", "5", "*", "2"]
    let partes = limpia.split(/([+\-*/%])/);

    // Convertir los textos numéricos a números reales (float)
    partes = partes.map(p => isNaN(p) ? p : parseFloat(p));

    // Paso 2: Prioridad de Multiplicación, División y Módulo
    for (let i = 0; i < partes.length; i++) {
        if (partes[i] === '*' || partes[i] === '/' || partes[i] === '%') {
            const res = operate(partes[i - 1], partes[i + 1], partes[i]);
            partes.splice(i - 1, 3, res); // Reemplaza los 3 elementos por el resultado
            i--; // Retroceder un paso para no saltar elementos tras el recorte
        }
    }

    // Paso 3: Sumas y Restas (de izquierda a derecha)
    let resultadoFinal = partes[0];
    for (let i = 1; i < partes.length; i += 2) {
        resultadoFinal = operate(resultadoFinal, partes[i + 1], partes[i]);
    }

    return resultadoFinal;
}

// Función auxiliar para operaciones simples
function operate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? "Error" : a / b;
        case '%': return a % b;
        default: return b;
    }
}