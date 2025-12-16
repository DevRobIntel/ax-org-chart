// src/utils/treeUtils.js

export function buildTree(nodes) {
  const map = {};
  const tree = [];

  // Initialize all nodes with children array
  nodes.forEach(node => {
    map[node.id] = { ...node, children: [] };
  });

  // Build hierarchy
  nodes.forEach(node => {
    if (node.parentId !== null && map[node.parentId]) {
      map[node.parentId].children.push(map[node.id]);
    } else if (node.parentId === null) {
      tree.push(map[node.id]);
    }
  });

  return tree;
}

export function flattenTree(tree) {
  const flat = [];

  function traverse(node) {
    if (!node) return;

    // Create a clean copy without children (to match flat structure)
    const { children, ...cleanNode } = node;
    flat.push(cleanNode);

    // Safely iterate over children (default to empty array if undefined)
    (children || []).forEach(child => traverse(child));
  }

  (tree || []).forEach(traverse);
  return flat;
}

export function generateUniqueId(nodes) {
  if (!nodes || nodes.length === 0) return 1;
  const ids = nodes.map(n => n.id);
  return Math.max(...ids) + 1;
}

export function addCounts(tree) {
  function traverse(node) {
    node.count = 1 + (node.children || []).reduce((sum, child) => sum + traverse(child), 0);
    return node.count;
  }
  tree.forEach(traverse);
  return tree;
}