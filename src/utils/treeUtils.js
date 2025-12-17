// src/utils/treeUtils.js

/**
 * Builds a hierarchical tree from flat node list
 * Ensures every node has a children array
 */
export function buildTree(nodes = []) {
  const map = new Map();
  const tree = [];

  // Clone nodes and ensure children array exists
  nodes.forEach(node => {
    const cloned = { ...node, children: [] };
    map.set(node.id, cloned);
  });

  // Build hierarchy
  nodes.forEach(node => {
    const clonedNode = map.get(node.id);
    if (node.parentId !== null && map.has(node.parentId)) {
      map.get(node.parentId).children.push(clonedNode);
    } else if (node.parentId === null) {
      tree.push(clonedNode);
    }
  });

  return tree;
}

/**
 * Flattens a tree structure back to array (removes children references)
 */
export function flattenTree(tree = []) {
  const flat = [];

  function traverse(node) {
    if (!node) return;

    // Create clean copy without children
    const { children, ...cleanNode } = node;
    flat.push(cleanNode);

    // Recurse safely
    if (children && Array.isArray(children)) {
      children.forEach(traverse);
    }
  }

  tree.forEach(traverse);
  return flat;
}

/**
 * Generates the next unique ID based on existing nodes
 */
export function generateUniqueId(nodes = []) {
  if (nodes.length === 0) return 1;

  const maxId = Math.max(...nodes.map(n => n.id || 0));
  return maxId + 1;
}

/**
 * Adds a 'count' property to each node representing total descendants + self
 * Used for badges showing team size
 */
export function addCounts(tree = []) {
  function traverse(node) {
    if (!node) return 0;

    let total = 1; // Count self

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        total += traverse(child);
      });
    }

    node.count = total;
    return total;
  }

  tree.forEach(traverse);
  return tree;
}

/**
 * Deep search helper - filters tree while preserving structure
 * Used for search functionality
 */
export function deepSearch(tree = [], query = '') {
  if (!query.trim()) return tree;

  const lowerQuery = query.toLowerCase();

  function filterNode(node) {
    const matches = 
      node.name?.toLowerCase().includes(lowerQuery) ||
      node.position?.toLowerCase().includes(lowerQuery) ||
      node.experience?.toLowerCase().includes(lowerQuery) ||
      node.languages?.toLowerCase().includes(lowerQuery);

    if (node.children && node.children.length > 0) {
      const filteredChildren = node.children
        .map(filterNode)
        .filter(child => child !== null);

      if (matches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    }

    return matches ? node : null;
  }

  return tree
    .map(filterNode)
    .filter(node => node !== null);
}

/**
 * Finds a node by ID in the tree
 */
export function findNodeById(tree = [], id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Gets all ancestors of a node (for breadcrumbs or context)
 */
export function getAncestors(tree = [], nodeId) {
  const ancestors = [];

  function search(nodes) {
    for (const node of nodes) {
      if (node.id === nodeId) {
        ancestors.unshift(node);
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (search(node.children)) {
          ancestors.unshift(node);
          return true;
        }
      }
    }
    return false;
  }

  search(tree);
  return ancestors.slice(0, -1); // Exclude self
}