module.exports = (query) => {
    let fillters = [{
        name: "tat ca",
        status: "",
        class: ""
    },
    {
        name: "hoat dong",
        status: "active",
        class: ""
    },
    {
        name: "ko hoat dong",
        status: "inactive",
        class: ""
    }
    ];
    if (query.status) {
        const index = fillters.findIndex(item => item.status === query.status);
        fillters[index].class = "active";
    } else {
        const index = fillters.findIndex(item => item.status === "");
        fillters[index].class = "active";
    }
    return fillters;
};
