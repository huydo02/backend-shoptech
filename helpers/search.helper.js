module.exports = (query) => {
    let objectSearch = {
        keywords: ""
    };
    if (query.query) {
        objectSearch.keywords = query.keyword;
        const regex = new RegExp(objectSearch.keywords, "i");
        objectSearch.regex = regex;
    };
    // console.log("objectSearch", objectSearch)
    return objectSearch;
};
