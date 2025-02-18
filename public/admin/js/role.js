// console.log("okay")


//permissions
const permissions = document.querySelector("[table-permissions]");
if (permissions) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener('click', () => {
        let permissions = [];

        const rows = document.querySelectorAll("[data-name]");

        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: [],
                    });
                    // console.log(permissions)
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;

                    // console.log(name);
                    // console.log(index);
                    // console.log(checked);
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }

        });
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector('#form-change-permissions');
            const inputForm = formChangePermissions.querySelector("input[name='permissions']");
            inputForm.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
    });
}

const dataPermissions = document.querySelector('[data-permissions]');
if (dataPermissions) {
    const data = JSON.parse(dataPermissions.getAttribute('data-permissions'));

    const tablePermissions = document.querySelector('[table-permissions]');

    data.forEach((item, index) => {
        const permissions = item.permissions;

        permissions.forEach((permission) => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true
        })
    })
}