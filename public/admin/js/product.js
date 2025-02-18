const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
const formChangeStatus = document.querySelector('#form-change-status');
if (buttonChangeStatus.length > 0) {
    buttonChangeStatus.forEach(item => {
        item.addEventListener('click', () => {
            const statusCurrent = item.getAttribute('data-status');
            const id = item.getAttribute('data-id');

            let statusChange = statusCurrent == 'active' ? 'inactive' : 'active';
            let pathForm = formChangeStatus.getAttribute('data-path');

            const action = pathForm + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    })
}
const checkBoxMultiple = document.querySelector('[checkbox-multiple]');
if (checkBoxMultiple) {
    const inputCheckAll = checkBoxMultiple.querySelector("input[name='checkall']");
    const inputId = checkBoxMultiple.querySelectorAll("input[name='ids']");
    // event of input check all
    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            inputId.forEach(item => {
                item.checked = true;
            });
        } else {
            inputId.forEach(item => {
                item.checked = false;
            });
        };
    });
    //END event of input check all
    // event of input only check
    inputId.forEach(item => {
        item.addEventListener('click', () => {
            const countChecked = checkBoxMultiple.querySelectorAll(
                "input[name='ids']:checked"
            ).length;
            if (countChecked == inputId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;

            }
        });
    });
    //END event of input only check
}
const formChangeMultiStatus = document.querySelector('[form-change-multi]');
if (formChangeMultiStatus) {
    formChangeMultiStatus.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxMultiple = document.querySelector('[checkbox-multiple]');
        const inputsChecked = checkBoxMultiple.querySelectorAll(
            "input[name='ids']:checked"
        );
        //code delete all selected
        const typeChange = e.target.elements.type.value;
        // console.log(typeChange);
        if (typeChange === "delete-all") {
            const isConfirm = confirm("ban co chac muon xoa nhung san pham nay");
            if (!isConfirm) {
                return;
            }
        }
        //check if user checked
        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMultiStatus.querySelector("input[name='idsProduct']");
            inputsChecked.forEach(item => {
                const id = item.value;
                if (typeChange === "change-position") {
                    const position = item.closest("tr").querySelector("input[name='position']").value;

                    // console.log(position, id);
                    ids.push(`${position}-${id}`);

                }
                else {
                    ids.push(id);
                }
            });
            // console.log(ids.join(", "));
            inputIds.value = ids.join(", ");
            formChangeMultiStatus.submit();

        } else {
            alert("Please select");
        }
    });
}
const deleteProductButton = document.querySelectorAll("[button-delete]");
if (deleteProductButton.length > 0) {
    const formDelete = document.querySelector('#form-delete-product');
    const path = formDelete.getAttribute('data-path')

    deleteProductButton.forEach(item => {
        item.addEventListener("click", () => {
            const isConfirm = confirm("Ban co muon xoa san pham nay khong?");

            if (isConfirm) {
                const id = item.getAttribute('button-data');
                const action = `${path}/${id}?_method=DELETE`;
                console.log(action);

                formDelete.action = action;
                formDelete.submit();
            }
        });
    })
    // console.log('123');
}
