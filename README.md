# What did you choose to mock the API and why?

I used localStorage with setTimeout to mock API behavior. It was lightweight, required no extra dependencies, and let me simulate delays, errors, and persistent task states without a backend.

## If you used an AI tool, what parts did it help with?

I used AI to brainstorm retry logic, clean up the polling hook, and validate some React and TypeScript patterns — the rest was manually implemented and debugged.

## What tradeoffs or shortcuts did you take?

Used localStorage instead of a mock server

Skipped test coverage due to time

Wrote custom polling logic instead of using libraries

Simplified error handling and file upload UX

## What would you improve with more time?

Add file upload for multiple files

Improve error recovery and retry backoff

Introduce global state management (e.g., Redux)

Add visual enhancements like better progress feedback

Add tests importantly

## What was the trickiest part and how did you debug it?

Polling cleanup was tricky — I used useRef to track intervals, ensured cleanup in useEffect, and added logs to debug task lifecycle and prevent memory leaks.

## How to run app
npm install
npm start
npm test