let count = 1;
function createTree(arr, parent_id = "") {

    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parent_id) {
            const newItem = item;
            newItem.index = count++;
            const child = createTree(arr, item.id);

            if (child.length > 0) {
                newItem._doc.children = child;
            }
            tree.push(newItem);
        }
    });
    return tree;
}
module.exports.tree = (arr, parent_id = "") => {
    count = 1;
    const tree = createTree(arr, parent_id = "");
    return tree;
};