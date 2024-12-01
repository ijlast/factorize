# Factorize This!
A simple NodeJS based server that generates example equations for students to practise factorization.

The equations follow the format:

$acx^{(n+m)} + dax^m + bcx^n + bd = (ax^m + b)(cx^n + d) $

by default:
* $-5 \leq a,b,c,d \leq 5$
* $a,b,c,d \neq 0$
* $1 \leq m,n \leq 3$

# Running the application
* Install NodeJS: https://nodejs.org/ (tested with 22.11.0)
* Download the source code
* Navigate to the directory containing *package.json* and type **npm start**
* Open a browser (that supports MathML) at the http link displayed in the output (default: http://localhost:8080/?index=0)

# How it Works
The program creates for loops for the variables a,b,c,d,m,n and generates the equation (in MathML) and places it in a map as the key
As several combinations of the variables produce the same equation the Map stores the possible solutions as the *value* of the map entry in a Set.

* The file *math-utils.js* generates the equation map and exports a single function to retrieve the map
* The file *app.js* creates a http server, renders the page and generates a random number to choose the next equation to attempt.

# Customization
The following modifications can be made to *math-utils.js*

* To allow values of a,b,c,d to be zero, set this to **true** (Note that this will generate equation with 0x etc.and has not been tested)
 ```
// noZeroValues: if false, a,b,c,d can be 0
let noZeroValues = false;
```
* Set this to **true** to allow the case where $m=n$ and $bc+da = 0$ giving quations similar to $acx^{(2m)} + bd$
 ```
// Allow cases where (bc + da) = 0 in the cases where m=n
let allowBcPlusDaEqualsZero = true;
```
* Set this to **true** to allow the case where $m=n$ and $bc*da\neq 0$ giving quations similar to $acx^{(2m)} + (da+bc)x^m + bd$
 ```
// Allow cases where (bc + da)  0 in the cases where m=n
let allowBcPlusDaNotEqualsZero = true;
```

* Set this to **true** to allow the case where $m\neq n$ giving equations similar to $acx^{(n+m)} + dax^m + bcx^n + bd $
 ```
// Allow cases where m != n
let allowMNotEqualsN = true;
```

* To change the ranges of the variables a,b,c,d,m,n modify the following code block.
 ```
for (let a = -5; a <= 5; a++) {
    for (let b = -5; b <= 5; b++) {
        for (let c = -5; c <= 5; c++) {
            for (let d = -5; d <= 5; d++) {
                for (let m = 1; m <= 3; m++) {
                    for (let n = 1; n <= 3; n++) {
                        ...
                    }
                }
            }
        }
    }
}
 ```