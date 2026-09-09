# Arithma

Arithma is a browser-based mental calculation trainer for practicing arithmetic speed and accuracy. It displays one calculation step at a time, requiring you to maintain the running total mentally before submitting a final answer.

All calculations run locally in the browser. No account or backend is required.

## Features

- Serial addition, subtraction, and mixed addition/subtraction
- One number visible at a time with no running total or replay
- Five preset difficulty levels
- Custom operand count, range, and display interval
- Clear correct or incorrect feedback with the complete calculation
- Answer-time measurement
- Current-session accuracy and timing statistics
- Historical results stored in `localStorage`
- Keyboard controls and responsive mobile layout
- Nonnegative running totals in subtraction and mixed modes

## Arithmetic Modes

### Addition

The first number starts the running total. Every following number is added.

```text
47, + 28, + 63, + 19
```

### Subtraction

Arithma calculates a sufficiently large starting value, then displays values to subtract. Subtracted values stay within the selected range, and the running total never becomes negative.

```text
157, - 28, - 63, - 19
```

### Mixed

Each number after the starting value includes either a plus or minus operator. A subtraction step is only generated when it keeps the running total nonnegative.

```text
47, + 28, - 19, + 36
```

Multiplication and division are represented in the application types for future expansion but are not enabled yet.

## Difficulty Levels

| Level | Numbers | Operand range | Time per number |
| --- | ---: | ---: | ---: |
| Baseline | 8 | 10-99 | 2 seconds |
| Above Average | 10 | 10-99 | 1.5 seconds |
| Strong | 12 | 10-99 | 1 second |
| Advanced | 15 | 10-99 | 0.8 seconds |
| Exceptional | 10 | 10-999 | 1 second |

Custom mode supports 1-100 numbers, positive integer operands up to 999999, and intervals from 100-60000 milliseconds.

## How To Use

1. Select Addition, Subtraction, or Mixed.
2. Choose a preset difficulty or configure Custom mode.
3. Review the settings and select **Start**.
4. Maintain the running total as each calculation step appears.
5. Enter the final total after the sequence ends.
6. Review the feedback and choose **Next challenge** or **Break / Exit**.

## Keyboard Controls

| Screen | Key | Action |
| --- | --- | --- |
| Ready | Enter | Start the challenge |
| Answer | Enter | Submit the answer |
| Result | Enter | Start the next challenge |

## Run Locally

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Quality Commands

```bash
npm test
npm run lint
npm run build
```

`npm test` runs the Vitest suite once. The production build is written to `dist/`.

## Architecture

```text
src/
├── components/     Screen and presentation components
├── config/         Difficulty levels and operation definitions
├── hooks/          Game state machine and timed sequence lifecycle
├── types/          Calculation and history types
├── utils/          Generation, arithmetic, statistics, and storage
├── App.tsx         State-based screen composition
└── index.css       Responsive visual system
```

The `useMentalCalculation` hook owns the explicit application state machine:

```text
SELECT_LEVEL -> READY -> COUNTDOWN -> RUNNING -> ANSWER -> RESULT
```

Countdown and challenge playback use abortable asynchronous delays so only one timer sequence can run. Every challenge is generated before playback, and only the current calculation step is passed to the display.

## Data Storage

Submitted attempts are appended to browser `localStorage` under the key `mental-calculation-history`. Each record includes the level, operation, operands, operators, expected answer, submitted answer, correctness, interval, timestamp, and answer time.

Current-session statistics include:

- Total, correct, and incorrect attempts
- Accuracy and 90% target status
- Average answer time
- Best answer time

Clearing browser storage removes historical results.

## Technology

- React 19
- TypeScript
- Vite
- Vitest and Testing Library
- Browser `localStorage`
