// Features
// noZeroValues: if false, a,b,c,d can be 0 (not recommedended to change this)
let noZeroValues = true;
// Allow cases where (bc + da) = 0 in the cases where m=n
let allowBcPlusDaEqualsZero = true;
// Allow cases where (bc + da) != 0 in the cases where m=n
let allowBcPlusDaNotEqualsZero = false;
// Allow cases where m != n
let allowMNotEqualsN = true;

// MathML
const PREFIX = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>'
const POSTFIX = '</mrow></math>'
const MINUS = '<mo>&#x2212;</mo>'
const PLUS = '<mo>+</mo>'
const LBRACKET = '<mo form="prefix" stretchy="false">(</mo>'
const RBRACKET = '<mo form="prefix" stretchy="false">)</mo>'

// Formula
//(ax^m + b)(cx^n + d) = acx^(n+m) + dax^m + bcx^n + bd

let equationMap = new Map();
for (let a = -5; a <= 5; a++) {
    for (let b = -5; b <= 5; b++) {
        for (let c = -5; c <= 5; c++) {
            for (let d = -5; d <= 5; d++) {
                for (let m = 1; m <= 3; m++) {
                    for (let n = 1; n <= 3; n++) {
                        if (noZeroValues && (a == 0 || b == 0 || c == 0 || d == 0)) continue;

                        let absa = Math.abs(a) == 1 ? '' : `<mn>${Math.abs(a)}</mn>`;
                        let absb = `<mn>${Math.abs(b)}</mn>`;
                        let absc = Math.abs(c) == 1 ? '' : `<mn>${Math.abs(c)}</mn>`;
                        let absd = `<mn>${Math.abs(d)}</mn>`;
                        let ac = Math.abs(a * c) == 1 ? '' : `<mn>${Math.abs(a * c)}</mn>`;
                        let da = Math.abs(d * a) == 1 ? '' : `<mn>${Math.abs(d * a)}</mn>`;
                        let bc = Math.abs(b * c) == 1 ? '' : `<mn>${Math.abs(b * c)}</mn>`;
                        let bd = `<mn>${Math.abs(b * d)}</mn>`;

                        let bcplusda = Math.abs((b * c) + (d * a)) == 1 ? '' : `<mn>${Math.abs((b * c) + (d * a))}</mn>`;

                        // Formatting (MathML)
                        let powerm = (m == 1) ? '<mi>x</mi>' : `<msup><mi>x</mi><mn>${m}</mn></msup>`
                        let powern = (n == 1) ? '<mi>x</mi>' : `<msup><mi>x</mi><mn>${n}</mn></msup>`
                        let powermn = `<msup><mi>x</mi><mn>${1 * m + n}</mn></msup>`
                        let signa = (a > 0) ? '' : MINUS;
                        let signb = (b > 0) ? PLUS : MINUS;
                        let signc = (c > 0) ? '' : MINUS;
                        let signd = (d > 0) ? PLUS : MINUS;
                        let signac = (a * c > 0) ? '' : MINUS;
                        let signda = (d * a > 0) ? PLUS : MINUS;
                        let signbc = (b * c > 0) ? PLUS : MINUS;
                        let signbd = (b * d > 0) ? PLUS : MINUS;
                        let signbcplusda = ((b * c) + (d * a) > 0) ? PLUS : MINUS;

                        let equation;

                        // Generate the equation based on various conditions
                        if (n == m) {
                            if (((b * c) + (d * a)) == 0) {
                                if (allowBcPlusDaEqualsZero) {
                                    equation = `${PREFIX}${signac}${ac}${powermn}${signbd}${bd}${POSTFIX}`
                                }
                            } else if (allowBcPlusDaNotEqualsZero) {
                                equation = `${PREFIX}${signac}${ac}${powermn}${signbcplusda}${bcplusda}${powern}${signbd}${bd}${POSTFIX}`
                            }


                        } else if (allowMNotEqualsN) {
                            if (n > m) { // Place highest powers first
                                equation = `${PREFIX}${signac}${ac}${powermn}${signbc}${bc}${powern}${signda}${da}${powerm}${signbd}${bd}${POSTFIX}`
                            } else {
                                equation = `${PREFIX}${signac}${ac}${powermn}${signda}${da}${powerm}${signbc}${bc}${powern}${signbd}${bd}${POSTFIX}`
                            }
                        }

                        // Insert this equation into the Map if it doesn't already exist
                        if (equation != undefined && !equationMap.has(equation)) {
                            equationMap.set(equation, new Set());
                        }

                        // Add the solution to the value set.
                        if (equation != undefined) {
                            let solution = `${PREFIX}${LBRACKET}${signa}${absa}${powerm}${signb}${absb}${RBRACKET}${LBRACKET}${signc}${absc}${powern}${signd}${absd}${RBRACKET}${POSTFIX}`
                            equationMap.get(equation).add(solution);
                        }
                    }
                }
            }
        }
    }
}
//equationMap.forEach(logMapElements)

console.log(`Generated ${equationMap.size} equations `)

function logMapElements(value, key, map) {
    console.log(`${key}`);
    value.forEach((key) => { console.log(`\t${key}`) });
}

// Function to generate MathML for the Schrödinger equation in AsciiMath
export function getEquations() {
    return equationMap;
}
