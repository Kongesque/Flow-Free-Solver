# Flow Free Solver

Flow Free, also know as Number Link, is a widely popular puzzle game that challenges players to connect pairs of colored dots on a grid. The goal is to draw paths between each pair of dots such that the paths do not overlap, and the entire grid is occupied. Players must connect dots of the same color while ensuring paths do not cross.

The Flow Free Solver project employs a backtracking approach with Breadth-First Search (BFS) and A* algorithm heuristics to solve Flow-Free puzzles by connecting pairs of colored dots. I also includes an alternative SAT Solver approach for additional solving flexibility.

## Solver Method 1: Backtracking with BFS and A* Algorithm

This approach explores paths recursively to connect pairs of dots, with the following components:

- **Path Construction**: For each color, BFS is used to explore possible paths between terminal pairs.
- **Heuristic Optimization**: The A* algorithm applies heuristics to estimate the minimum distance between each color pair. If a path does not satisfy this heuristic, the algorithm backtracks to explore alternative paths.
- **Lookahead Check**: The `lookaheadHeuristics` function assesses whether each color can feasibly connect to its target. If connection is deemed unfeasible, the algorithm skips to the next path, reducing unnecessary computations.

## Solver Method 2: SAT Solver Approach

This approach frames Flow Free as a Constraint Satisfaction Problem (CSP) and translates game requirements into logical formulas suitable for SAT solvers, such as the Z3 solver in Python. The SAT solver leverages constraints to ensure all puzzle requirements are met. Here’s how the constraints are structured:

- **Single-Color Cell Requirement**: Each cell on the grid must contain only one color, ensuring there are no overlaps. This is expressed as:

$$
  Cell_{ij} = \begin{cases}
   Cell_{ij} &\text{if } Cell_{ij}>0 \\
   Cell_{ij}>0 &\text{if } Cell_{ij}=0
  \end{cases}
$$

- **Terminal Cell Connection**: Terminal cells must have exactly one connecting path to another cell of the same color, maintaining a link between pairs. This constraint is represented as:

$$
Cell_{ij} = N_{ij} = 1, \text{ if } Cell_{ij} > 0
$$

- **Continuous Path for Connecting Cells**: Cells between terminals must connect with exactly two adjacent cells of the same color, or zero if unoccupied. This is expressed as:

$$
Cell_{ij} = N_{ij} = 2 \text{ or } N_{ij} = 0, \text{ if } Cell_{ij} = 0
$$

  where $N_{ij}$ represents the cell's neighbors, determined by Manhattan distance. This constraint ensures that paths are continuous without overlapping.
  
## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Kongesque/Flow-Free-Solver.git
cd Flow-Free-Solver
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Available Commands
- **Start Development Mode:** Run the app locally at http://localhost:3000
     ```bash
     npm start
     ```
- **Build for Production:** Create a production-ready build in the `build` folder
     ```bash
     npm run build
     ```

## Deployment

The Flow-Free-Solver project is deployed at: [https://kongesque.github.io/Flow-Free-Solver/](https://kongesque.github.io/Flow-Free-Solver/)
