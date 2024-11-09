import React from 'react';
import { useState, useEffect } from 'react';


type Cell = [number, number]
type Board = number[][]

const directions: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

const findPairs = (board: Board, number: number): [Cell | null, Cell | null] => {
  let startCell: Cell | null = null
  let endCell: Cell | null = null
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === number) {
        if (startCell === null) {
          startCell = [i, j]
        } else {
          endCell = [i, j]
          return [startCell, endCell]
        }
      }
    }
  }
  return [startCell, endCell]
}

const aStar = (board: Board, start: Cell, end: Cell): number => {
  const n = board.length
  const visited: boolean[][] = Array(n).fill(null).map(() => Array(n).fill(false))
  const priorityQueue: [number, number, Cell, Cell[]][] = [[0, 0, start, [start]]]
  visited[start[0]][start[1]] = true

  while (priorityQueue.length > 0) {
    const [f, g, currentPosition, path] = priorityQueue.shift()!
    const [x, y] = currentPosition

    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy

      if (nx >= 0 && nx < n && ny >= 0 && ny < n && !visited[nx][ny]) {
        if (nx === end[0] && ny === end[1]) {
          return g + 1
        }
        if (board[nx][ny] === 0) {
          visited[nx][ny] = true
          const gNew = g + 1
          const hNew = Math.abs(nx - end[0]) + Math.abs(ny - end[1])
          const fNew = gNew + hNew
          priorityQueue.push([fNew, gNew, [nx, ny], [...path, [nx, ny]]])
          priorityQueue.sort((a, b) => a[0] - b[0])
        }
      }
    }
  }

  return Infinity
}

const applyPath = (board: Board, path: Cell[], number: number): Board => {
  const newBoard = board.map(row => [...row])
  for (const [x, y] of path) {
    newBoard[x][y] = number
  }
  return newBoard
}

const lookaheadHeuristics = (board: Board, pairs: Record<number, [Cell | null, Cell | null]>, currentNumber: number): number | null => {
  for (let number = currentNumber; number <= Object.keys(pairs).length; number++) {
    const [startCell, endCell] = pairs[number]
    if (startCell && endCell) {
      const minDist = aStar(board, startCell, endCell)
      if (minDist === Infinity) {
        return Infinity
      }
    }
  }
  return null
}

const explorePathsForNumber = (
    board: Board,
    sumPath: number,
    number: number,
    pairs: Record<number, [Cell | null, Cell | null]>,
    nodeCount: number,
    startTime: number,
    timeout: number
): [Board | null, number] => {
    if (!pairs[number]) 
        throw new Error(`No Solution Exists`)

    const [startCell, endCell] = pairs[number]
    if (!startCell || !endCell) return [null, nodeCount]

    const minDist = aStar(board, startCell, endCell)
    if (minDist === Infinity) return [null, nodeCount]

    const lookAhead = lookaheadHeuristics(board, pairs, number + 1)
    if (lookAhead === Infinity) return [null, nodeCount]

    const queue: [Cell, Cell[]][] = [[startCell, [startCell]]]
    const visitedPaths = new Set<string>()

    while (queue.length > 0) {
        if (performance.now() - startTime > timeout) {
            throw new Error('Timeout Exceeded')
        }

        const [curPos, path] = queue.shift()!

        if (curPos[0] === endCell[0] && curPos[1] === endCell[1]) {
            if (minDist <= path.length) {
                const pathTuple = JSON.stringify(path)
                if (!visitedPaths.has(pathTuple)) {
                    visitedPaths.add(pathTuple)
                    const boardCopy = board.map(row => [...row])
                    const newBoard = applyPath(boardCopy, path, number)

                    nodeCount++

                    const nextNum = number + 1
                    if (nextNum) {
                        const newSumPath = sumPath + path.length
                        if (newSumPath === board.length ** 2) {
                            return [newBoard, nodeCount]
                        }

                        const [result, newNodeCount] = explorePathsForNumber(newBoard, newSumPath, nextNum, pairs, nodeCount, startTime, timeout)
                        nodeCount = newNodeCount

                        if (result) {
                            return [result, nodeCount]
                        }
                    }
                }
            }
        }

        for (const [dx, dy] of directions) {
            const nx = curPos[0] + dx
            const ny = curPos[1] + dy
            if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length && !path.some(([x, y]) => x === nx && y === ny)) {
                if (board[nx][ny] === 0 || (nx === endCell[0] && ny === endCell[1])) {
                    if (path.length === 1 || path.length === path.length - 1 || directions.filter(([dx, dy]) => path.some(([x, y]) => x === nx + dx && y === ny + dy)).length <= 1) {
                        queue.push([[nx, ny], [...path, [nx, ny]]])
                    }
                }
            }
        }
    }
    
    return [null, nodeCount]
}

const solveBoard = (board: Board): [Board | null, number, number] => {
    const startTime = performance.now()
    const pairs: Record<number, [Cell | null, Cell | null]> = {}
    let sumPath = 0
    let nodeCount = 0
  
    const maxNum = Math.max(...board.flat())
    for (let number = 1; number <= maxNum; number++) {
      pairs[number] = findPairs(board, number)
      if (!pairs[number][0] || !pairs[number][1]) {
        throw new Error(`Number ${number} does not have a pair`)
      } 
    }
  
    const firstNum = 1
    const [finalBoard, finalNodeCount] = explorePathsForNumber(board, sumPath, firstNum, pairs, nodeCount, startTime, 15000)
    const endTime = performance.now()
    
    return [finalBoard, finalNodeCount, endTime - startTime]
}

export const solve = (board: any) => {
    try {
        const [solvedBoard, finalNodeCount, timeTaken] = solveBoard(board)
        // setNodeCount(finalNodeCount)
        // setTime(timeTaken)
        console.log(solvedBoard)
        return solvedBoard; 
    } catch (error) {
        alert(error.message )
        return null;
    }
};

const Solver = () => {
    return (
        <div>Solver</div>
    );
};

export default Solver;