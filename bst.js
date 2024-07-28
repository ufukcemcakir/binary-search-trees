class Node {
    constructor(data) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  }
  
  class Tree {
    constructor(array) {
      this.root = this.buildTree(array);
    }
  
    buildTree(array) {
      const sortedArray = [...new Set(array)].sort((a, b) => a - b);
      
      const buildBalancedTree = (start, end) => {
        if (start > end) return null;
        
        const mid = Math.floor((start + end) / 2);
        const node = new Node(sortedArray[mid]);
        
        node.left = buildBalancedTree(start, mid - 1);
        node.right = buildBalancedTree(mid + 1, end);
        
        return node;
      };
  
      return buildBalancedTree(0, sortedArray.length - 1);
    }
  
    insert(value) {
      this.root = this._insertRec(this.root, value);
    }
  
    _insertRec(root, value) {
      if (root === null) return new Node(value);
      
      if (value < root.data) {
        root.left = this._insertRec(root.left, value);
      } else if (value > root.data) {
        root.right = this._insertRec(root.right, value);
      }
      
      return root;
    }
  
    deleteItem(value) {
      this.root = this._deleteRec(this.root, value);
    }
  
    _deleteRec(root, value) {
      if (root === null) return root;
      
      if (value < root.data) {
        root.left = this._deleteRec(root.left, value);
      } else if (value > root.data) {
        root.right = this._deleteRec(root.right, value);
      } else {
        if (root.left === null) return root.right;
        if (root.right === null) return root.left;
        
        root.data = this._minValue(root.right);
        root.right = this._deleteRec(root.right, root.data);
      }
      
      return root;
    }
  
    _minValue(root) {
      let minv = root.data;
      while (root.left !== null) {
        minv = root.left.data;
        root = root.left;
      }
      return minv;
    }
  
    find(value) {
      return this._findRec(this.root, value);
    }
  
    _findRec(root, value) {
      if (root === null || root.data === value) return root;
      
      if (value < root.data) return this._findRec(root.left, value);
      return this._findRec(root.right, value);
    }
  
    levelOrder(callback) {
      if (!callback) throw new Error("Callback is required");
      
      const queue = [this.root];
      while (queue.length > 0) {
        const node = queue.shift();
        callback(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }
  
    inOrder(callback) {
      if (!callback) throw new Error("Callback is required");
      this._inOrderRec(this.root, callback);
    }
  
    _inOrderRec(node, callback) {
      if (node === null) return;
      this._inOrderRec(node.left, callback);
      callback(node);
      this._inOrderRec(node.right, callback);
    }
  
    preOrder(callback) {
      if (!callback) throw new Error("Callback is required");
      this._preOrderRec(this.root, callback);
    }
  
    _preOrderRec(node, callback) {
      if (node === null) return;
      callback(node);
      this._preOrderRec(node.left, callback);
      this._preOrderRec(node.right, callback);
    }
  
    postOrder(callback) {
      if (!callback) throw new Error("Callback is required");
      this._postOrderRec(this.root, callback);
    }
  
    _postOrderRec(node, callback) {
      if (node === null) return;
      this._postOrderRec(node.left, callback);
      this._postOrderRec(node.right, callback);
      callback(node);
    }
  
    height(node) {
      if (node === null) return -1;
      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }
  
    depth(node) {
      return this._depthRec(this.root, node);
    }
  
    _depthRec(root, node, depth = 0) {
      if (root === null) return -1;
      if (root === node) return depth;
      
      const leftDepth = this._depthRec(root.left, node, depth + 1);
      if (leftDepth !== -1) return leftDepth;
      
      return this._depthRec(root.right, node, depth + 1);
    }
  
    isBalanced() {
      return this._isBalancedRec(this.root);
    }
  
    _isBalancedRec(node) {
      if (node === null) return true;
      
      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);
      
      if (Math.abs(leftHeight - rightHeight) <= 1 &&
          this._isBalancedRec(node.left) &&
          this._isBalancedRec(node.right)) {
        return true;
      }
      
      return false;
    }
  
    rebalance() {
      const values = [];
      this.inOrder(node => values.push(node.data));
      this.root = this.buildTree(values);
    }
  }
  
  const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

//Testing
function generateRandomArray(size, max) {
    return Array.from({length: size}, () => Math.floor(Math.random() * max));
  }
 
  const randomArray = generateRandomArray(10, 100);
  const tree = new Tree(randomArray);
  
  console.log("Initial tree:");
  prettyPrint(tree.root);
  
  console.log("Is the tree balanced?", tree.isBalanced());
  
  console.log("Level order:");
  tree.levelOrder(node => process.stdout.write(node.data + " "));
  console.log("\nPre-order:");
  tree.preOrder(node => process.stdout.write(node.data + " "));
  console.log("\nPost-order:");
  tree.postOrder(node => process.stdout.write(node.data + " "));
  console.log("\nIn-order:");
  tree.inOrder(node => process.stdout.write(node.data + " "));
  
  console.log("\n\nUnbalancing the tree...");
  tree.insert(101);
  tree.insert(102);
  tree.insert(103);
  tree.insert(104);
  tree.insert(105);
  
  prettyPrint(tree.root);
  
  console.log("Is the tree balanced?", tree.isBalanced());
  
  console.log("Rebalancing the tree...");
  tree.rebalance();
  
  prettyPrint(tree.root);
  
  console.log("Is the tree balanced?", tree.isBalanced());
  
  console.log("Level order:");
  tree.levelOrder(node => process.stdout.write(node.data + " "));
  console.log("\nPre-order:");
  tree.preOrder(node => process.stdout.write(node.data + " "));
  console.log("\nPost-order:");
  tree.postOrder(node => process.stdout.write(node.data + " "));
  console.log("\nIn-order:");
  tree.inOrder(node => process.stdout.write(node.data + " "));