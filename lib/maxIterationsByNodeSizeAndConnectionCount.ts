export interface MaxIterationsByNodeSizeAndConnectionCountInput {
  planeSize: number
  layers: number
  traceCount: number
  maxIterations: number
}

export interface MaxIterationsByNodeSizeAndConnectionCountResult {
  states: number
  traceCount: number
  adaptiveMaxIterations: number
  effectiveMaxIterations: number
  baseSearchBudget: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function computeMaxIterationsByNodeSizeAndConnectionCount(
  input: MaxIterationsByNodeSizeAndConnectionCountInput,
): MaxIterationsByNodeSizeAndConnectionCountResult {
  const states = Math.max(1, input.planeSize * input.layers)
  const traceCount = Math.max(0, input.traceCount)
  const traceFactor = Math.sqrt(traceCount)

  const adaptiveMaxIterations = clamp(
    Math.round(states * (8 + 1.2 * traceFactor)),
    150_000,
    12_000_000,
  )
  const effectiveMaxIterations = Math.max(
    1,
    Math.min(Math.max(1, input.maxIterations), adaptiveMaxIterations),
  )
  const baseSearchBudget = clamp(
    Math.round(states * (10 + 0.8 * traceFactor)),
    50_000,
    4_000_000,
  )

  return {
    states,
    traceCount,
    adaptiveMaxIterations,
    effectiveMaxIterations,
    baseSearchBudget,
  }
}
