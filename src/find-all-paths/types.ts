export type GraphNode = string | number

export type AdjacencyList = {[key in GraphNode]: GraphNode[]}

export type VisitedNodes = Map<GraphNode, boolean>

export type PathTracker = GraphNode[]