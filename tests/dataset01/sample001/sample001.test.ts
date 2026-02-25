import { test, expect } from "bun:test"
import "bun-match-svg"
import "graphics-debug/matcher"
import { HighDensitySolverA01 } from "../../../lib/HighDensitySolverA01/HighDensitySolverA01"
import sample001 from "./sample001.json"

test("sample001 solve", { timeout: 120_000 }, async () => {
  const borderMargin = 2 // mm
  const { width, height } = sample001
  const solver = new HighDensitySolverA01({
    nodeWithPortPoints: sample001,
    cellSizeMm: 0.5,
    viaDiameter: 0.3,
    initialPenaltyFn: ({ px, py }) => {
      const distToEdge = Math.min(
        px * width,
        (1 - px) * width,
        py * height,
        (1 - py) * height,
      )
      if (distToEdge >= borderMargin) return 0
      const t = 1 - distToEdge / borderMargin
      return t * t * 2
    },
  })

  solver.MAX_ITERATIONS = 200_000
  solver.solve()

  console.log(
    `solved=${solver.solved} failed=${solver.failed} iterations=${solver.iterations} error=${solver.error}`,
  )
  console.log(
    `routes=${solver.solvedConnectionsMap.size} unsolved=${solver.unsolvedConnections.length}`,
  )
  if (solver.activeConnection) {
    console.log(`stuck on: ${solver.activeConnection.connectionName}`, {
      start: solver.activeConnection.start,
      end: solver.activeConnection.end,
      openSetSize: solver.openSet.length,
    })
  }

  const graphics = solver.visualize()

  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
