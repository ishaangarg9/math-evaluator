import React, { useState } from "react";

const App = () => {
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const evaluateExpression = (expression: string): number => {
        const operators: Record<string, (a: number, b: number) => number> = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
        };

        const precedence: Record<string, number> = {
            "+": 1,
            "-": 1,
            "*": 2,
            "/": 2,
        };

        const isOperator = (char: string) => Object.keys(operators).includes(char);

        const toPostfix = (expr: string): string[] => {
            const output: string[] = [];
            const stack: string[] = [];
            const tokens = expr.match(/(\d+|\+|\-|\*|\/|\(|\))/g) || [];

            tokens.forEach((token) => {
                if (!isNaN(Number(token))) {
                    output.push(token);
                } else if (token === "(") {
                    stack.push(token);
                } else if (token === ")") {
                    while (stack.length && stack[stack.length - 1] !== "(") {
                        output.push(stack.pop()!);
                    }
                    stack.pop();
                } else if (isOperator(token)) {
                    while (
                        stack.length &&
                        precedence[stack[stack.length - 1]] >= precedence[token]
                    ) {
                        output.push(stack.pop()!);
                    }
                    stack.push(token);
                }
            });

            while (stack.length) {
                output.push(stack.pop()!);
            }

            return output;
        };

        const evaluatePostfix = (postfix: string[]): number => {
            const stack: number[] = [];
            postfix.forEach((token) => {
                if (!isNaN(Number(token))) {
                    stack.push(Number(token));
                } else if (isOperator(token)) {
                    const b = stack.pop()!;
                    const a = stack.pop()!;
                    stack.push(operators[token](a, b));
                }
            });
            return stack[0];
        };

        return evaluatePostfix(toPostfix(expression));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const result = evaluateExpression(expression);
            setResult(result.toString());
        } catch {
            setError("Invalid expression");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Math Expression Evaluator</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="Enter a mathematical expression"
                    style={{ padding: "10px", width: "300px", fontSize: "16px" }}
                />
                <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
                    Evaluate
                </button>
            </form>
            {result && <h2>Result: {result}</h2>}
            {error && <h2 style={{ color: "red" }}>Error: {error}</h2>}
        </div>
    );
};

export default App;
