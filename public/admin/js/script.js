const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            // console.log(status);
            if (status) {
                url.searchParams.set("status", status);
                // console.log(url.href)
            } else {
                url.searchParams.delete("status");
                console.log(url.href)

            }
            window.location.href = url.href;
        })

    })
}
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        let url = new URL(window.location.href);

        let keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
            console.log(url.href)
        }
        window.location.href = url.href;

    });
}
const buttonPaginations = document.querySelectorAll("[button-pagination]");
if (buttonPaginations) {
    let url = new URL(window.location.href);
    buttonPaginations.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('button-pagination');

            url.searchParams.set("page", page);

            window.location.href = url.href;
        })
    })
}

//preview image
const uploadImage = document.querySelector('[upload-img]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-img-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-img-preview]');
    // console.log(uploadImagePreview.getAttribute('src'));

    uploadImageInput.onchange = evt => {
        const file = evt.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    }
}
//end preview
//sort
const sort = document.querySelector('[sort]');
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = document.querySelector('[sort-select]');
    const sortClear = document.querySelector('[sort-clear]')
    console.log(sortClear)
    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        // console.log(sortKey, sortValue)
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });
    sortClear.addEventListener('click', () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;

    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
};
//show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time'));
    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

}
//end sort