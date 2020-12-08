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
// Date validation (within 30 days and not a future date)
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
const save = (event) => {
    //prevents removing of data, if there is error in name or date
    event.preventDefault();
    //if there is error, then form will not be submitted
    event.stopPropagation();
    try {
        setEmployeePayrollObject(); 
        createAndUpdateStorage();
        resetForm();
         //after resetting, moving back to home page.
        window.location.replace(site_properties.home_page);
    }
    catch (e) {
        alert(e);
    }
}
const setEmployeePayrollObject = () => {
     // if(!isUpdate) employeePayrollObj = new EmployeePayRoll();
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+
               getInputValueById('#year') ;
    employeePayrollObj._startDate = date;
}
//we are updating the createandUpdateStorage
//earlier we were only cheacking is employeepayrolldata exists then add it to home page table
//now if we want to update we need to check if it exists and whether we are adding a new id or updating the existing one
const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
   //check if list exists
    if(employeePayrollList){
        let empPayrollData = employeePayrollList.
                             find(empData => empData._id == employeePayrollObj._id);
        //if data does not existfor a particular id directly push the data into list with a new id
        if (!empPayrollData) {
            employeePayrollList.push(createEmployeePayrollData());
        } else {

            //if that id exists find index for that and splice it 
            //first delete data on that index and then add that updated data 
            const index = employeePayrollList
                          .map(empData => empData._id)
                          .indexOf(empPayrollData._id);
            employeePayrollList.splice(index, 1, createEmployeePayrollData(empPayrollData._id));
        }
    }
     //otherwise pass the data in teh form of an array
     else{
        employeePayrollList = [createEmployeePayrollData()]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

const createEmployeePayrollData = (id) => {
    //creating an instance of EmployeePayroll class
    // let employeePayrollData = new EmployeePayRoll();
    //if id does not exist create new emp id
    let employeePayrollData = new EmployeePayRoll();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    //else add in that id only
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
      employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
      setTextValue('.text-error', e);
      throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = 
            new Date(Date.parse(employeePayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}
//not being used after uc2 in day 41
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
