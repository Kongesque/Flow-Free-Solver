# Flow Free Solver

The Flow Free Solver project employs a backtracking approach with Breadth-First Search (BFS) and A* algorithm heuristics to solve Flow-Free puzzles by connecting pairs of colored dots.

## Solver Method: Backtracking with BFS and A* Algorithm

This approach explores paths recursively to connect pairs of dots, with the following components:

- **Path Construction**: For each color, BFS is used to explore possible paths between terminal pairs.
- **Heuristic Optimization**: The A* algorithm applies heuristics to estimate the minimum distance between each color pair. If a path does not satisfy this heuristic, the algorithm backtracks to explore alternative paths.
- **Lookahead Check**: The `lookaheadHeuristics` function assesses whether each color can feasibly connect to its target. If connection is deemed unfeasible, the algorithm skips to the next path, reducing unnecessary computations.

## Available Commands

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- **`npm test`**: Starts the interactive test runner.
- **`npm run build`**: Builds the app for production in the `build` folder.
- **`npm run eject`**: Copies configuration files for advanced customization (irreversible).

## Deployment

The Flow-Free-Solver project is deployed at: [https://kongesque.github.io/Flow-Free-Solver/](https://kongesque.github.io/Flow-Free-Solver/)
