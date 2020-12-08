let isUpdate = false;
let employeePayrollObj = {};
//event listener basically waits for an event to occour
window.addEventListener('DOMContentLoaded', (event) => {
    //UC2-Validating name
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayRoll()).name = name.value;
            textError.textContent = "";
        }
        catch (e) {
            textError.textContent = e;
        }
    });
// validating salary
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });

    const date = document.querySelector('#date');
    date.addEventListener('input', function () {
        let startDate = document.querySelector('#day').value + " " + document.querySelector('#month').value + " " +
            document.querySelector('#year').value;
        try {
            (new EmployeePayRoll()).startDate = new Date(Date.parse(startDate));
            setTextValue('.date-error', "");
        }
        catch (e) {
            setTextValue('.date-error', e);
        }
    });
    checkForUpdate();
});
const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

// uc3 - defining the save method for saving all emp details
//this save method was already declared in the form onsubmit="save()";
const save = () => {
    try {
        //storing the value returned by the function
        let employeePayrollData = createEmployeePayroll();
        //calling function to store the employee data in it if is extracted in the above line properly
        createAndUpdateStorage(employeePayrollData);
    }
    catch (e) {
        alert(e);
    }
}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayRoll();
    try {
         //we have created an employeePayrollData object at top 
        //getting the name value from user and storing it in name attribute of class and validating also
        employeePayrollData.name = getInputValueById('#name');
    }
    catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
//employeePayrollData.id=getInputValueById('#id');
    //getSelectedValue is a function created at bottom to  get properties which have multiple values
    employeePayrollData.id = createNewEmployeeId();
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    //getinputvaluesbyid is a function created at bottom to get info by id
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let date = getInputValueById('#day') + "," + getInputValueById('#month') + "," + getInputValueById('#year');
    employeePayrollData.startDate = new Date(date);
    alert(employeePayrollData.toString());
    return employeePayrollData;
}
//function called by createemployeepayroll to get multiple values
const getSelectedValues = (propertyValue) => {
    //an array to store all the values like of gender male and female
    let allItems = document.querySelectorAll(propertyValue);
    //empty array to get value selected by user can also be multiple like for department
    let sellItems = [];
     //iterating through each item
    allItems.forEach(item => {
         //item is choosen by user it is pushes into sellitems
        if (item.checked)
            sellItems.push(item.value);
    });
    return sellItems;
}
// this method id not used anywhere just could be a replacement for above method   
const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

//uc4 storing in local storage    
function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = [];
    //we have an inbuilt function of local storage
    //localstorage.getitem() is getting all item from list
    //json will convert this json string into an object
    employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    //if this list is not undefined then it will push the data into it 
    //otherwise it make a new list and put the first entry in this list 
    //next time when this list is used it will go  with the if statement 
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    }
    else {
        employeePayrollList = [employeePayrollData];
    }
    //alert is used for poping up
    alert(employeePayrollList.toString());
    //converting object back to json string format
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

//uc5 reset button which is being called by the form 
//we are either setting or unsetting the values to empty or some specific value
const resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', ' ');
    setValue('#notes', ' ');
    setValue('#day', '1');
    setValue('#month', 'Jan');
    setValue('#year', '2020');
}
const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => { item.checked = false; }
    );
}
const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

// Creating id for each employee
const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}
// Checking if update is called or not
const checkForUpdate = () => {
    //json object is created at the top of the page
    //we are getting the values stored in the local storage using editEmp which is the key
    //it will give us the data of that contact which we user wants to edit using editEmp key
    const employeePayrollJson = localStorage.getItem('editEmp');
     //if there is something in jsonobj then true else false
    isUpdate = employeePayrollJson ? true : false;
    //if is update is false return
    if (!isUpdate) return;
    //now we are converting this employeepayrolljson into jsonobj to store into a global variable
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}
//setting the function in the form
/*const setForm = () => {
    //using the details in the json object we are setting the form fields
    //calling the set value func
    setValue('#name', employeePayrollObj._name);
    //calling the selected value sfunction to set values
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    // we are converting date to 12 Nov 2018 format then splitting and storing in the form of an array
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}
//set selected values is called when we have multiple options and want to tick one or more
//like for gender, department,profilepic
//here property is suppose profilepic and value is the option ticked for that
const setSelectedValues = (propertyValue, value) => {
    //getting all the items in allitems
    let allItems = document.querySelectorAll(propertyValue);
    //iterating through allitems
    allItems.forEach(item => {
        //then checking if values is an array or not 
        //for example for deparment it will be an array and gender it will be a single value
        if(Array.isArray(value)) {
            //if it is an array
            //checking if value includes item.value then it is ticked
            //it will check all the options
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        //if it is not an array 
        //when item value matches with value
        //it is checked true or ticked
        else if (item.value === value)
            item.checked = true;
    }); 
}*/
// Populate the form with previous details if isUpdate is true
const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value === value)
            item.checked = true;
    });    
}
