module.exports = (object, query, countProducts) => {
    if (query.page) {
        if (isNaN(query.page))
            object.currentPage = 1;
        else {
            object.currentPage = parseInt(query.page);
        }
    }
    object.skip = (object.currentPage - 1) * object.limit;
    const totalPages = Math.ceil(countProducts / object.limit);

    object.totalPages = totalPages;

    return object;
}