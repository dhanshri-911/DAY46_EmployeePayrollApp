let isUpdate = false;
let employeePayrollObject = {};
window.addEventListener('DOMContentLoaded', () => {
    validName();
    salaryRange();
    checkForUpdate();
});

function validName() {
    const name = document.querySelector("#name");
    const textError = document.querySelector(".text-error");
    name.addEventListener('input', function () {
        try {
            let empData = new EmployeePayrollData();
            empData.name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
        }
    });
}

/** set event listener on salary range*/
function salaryRange() {
    const salary = document.querySelector("#salary");
    const output = document.querySelector('.salary-output');
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });
}

/** On form submit populate employee payroll data object */
const save = () => {
    let employeePayrollData = createEmployeePayroll();
    createAndUpdateLocalStorage(employeePayrollData);

}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
        setTextValue('.text-error', "");
    } catch (e) {
        setTextValue('.text-error', e);
    }

    try {
        let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
        employeePayrollData.startDate = new Date(Date.parse(date));
        setTextValue('.date-error', "");
    } catch (e) {
        setTextValue('.date-error', e);
    }

    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    employeePayrollData.id = new Date().getTime() + 1;
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const setTextValue = (id, message) => {
    const textError = document.querySelector(id);
    textError.textContent = message;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if (item.checked == true)
            setItems.push(item.value);
    });
    return setItems;
}

/** save employee object into local storage */
const createAndUpdateLocalStorage = (empData) => {
    let dataList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (dataList != undefined) {
        dataList.push(empData)
    } else {
        dataList = [empData];
    }
    localStorage.setItem('EmployeePayrollList', JSON.stringify(dataList));
    alert("data stored with name " + empData.name);
}

/** Reset employee payroll form */

const resetForm = () => {
    setTextValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

/** check for Update and set the valuees of the form elements  */
const checkForUpdate = () => {
    let jsonData = localStorage.getItem('edit-emp');
    isUpdate = jsonData ? true : false;
    if (!isUpdate)
        return;
    employeePayrollObject = JSON.parse(jsonData);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObject._name);
    setSelectValue('[name=profile]', employeePayrollObject._profilePic);
    setSelectValue('[name=gender]', employeePayrollObject._gender);
    setSelectValue('[name=department]', employeePayrollObject._department);
    setValue('#salary', employeePayrollObject._salary);
    setTextValue('.salary-output', employeePayrollObject._salary)
    setValue('#notes', employeePayrollObject._note);

    let date = stringify(employeePayrollObject._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectValue = (propertyValue, value) => {
    let allitem = document.querySelectorAll(propertyValue);
    allitem.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value == value) {
            item.checked = true;
        }
    });
}
const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}
