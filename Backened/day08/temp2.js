
const val = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(nodes):
    if not nodes or nodes[0] == "null":
        return None
    root = TreeNode(int(nodes[0]))
    queue = [root]
    i = 1
    while i < len(nodes):
        current = queue.pop(0)
        if nodes[i] != "null":
            current.left = TreeNode(int(nodes[i]))
            queue.append(current.left)
        i += 1
        if i < len(nodes) and nodes[i] != "null":
            current.right = TreeNode(int(nodes[i]))
            queue.append(current.right)
        i += 1
    return root

def has_path_sum(root, targetSum):
    if not root:
        return False
    if not root.left and not root.right:
        return root.val == targetSum
    return has_path_sum(root.left, targetSum - root.val) or has_path_sum(root.right, targetSum - root.val)

# Read input
import sys
lines = sys.stdin.read().splitlines()
tree_input = lines[0].split()
target_sum = int(lines[1])
root = build_tree(tree_input)
print("true" if has_path_sum(root, target_sum) else "false")`;


console.log(JSON.stringify(val));