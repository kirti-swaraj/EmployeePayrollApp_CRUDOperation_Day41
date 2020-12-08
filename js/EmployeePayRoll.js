class EmployeePayRoll {
//we are adding this id to use it in the form by which we will update delete and find values
    // getter and setter method
    get id() { return this._id; }
    set id(id) {
        this._id = id;
    }

    get name() { return this._name; }
    set name(name) {
        //validating only name with min 3 letters and first letter caps is allowed 
        let checkName = RegExp('^[A-Z]{1}[a-z]{2,}$');
        if (checkName.test(name)) {
            this._name = name;
        }
        else {
            throw "InCorrect name";
        }
    }

    get profilePic() { return this._profilePic; }
    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }

    get gender() { return this._gender; }
    set gender(gender) {
        this._gender = gender;
    }

    get department() { return this._department; }
    set department(department) {
        this._department = department;
    }

    get salary() { return this._salary; }
    set salary(salary) {
        this._salary = salary;
    }

    get note() { return this._note; }
    set note(note) {
        this._note = note;
    }

    get startDate() { return this._startDate; }
    set startDate(startDate) {
        let now = new Date();
        if (startDate > now) throw 'Start Date is a Future Date!';
        var diff = Math.abs(now.getTime() - startDate.getTime());
        if (diff / (1000 * 60 * 60 * 24) > 30) 
          throw 'Start Date is beyond 30 Days!';
        this._startDate = startDate; 
    }

    // toString() method
    toString() {
         //giving the type of date required
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //if start date is not in the given datatype it will pass the value undefined to empdate
        const empDate = this.startDate === undefined ? "undefined" : this.startDate.toLocaleDateString("en-US", options);
        //here in return for start date we are passing empDate as value 
        return "id="+this.id+"\nname=" + this.name + "\nprofilePic=" + this.profilePic + "\ngender=" + this.gender + "\ndepartment=" + this.department +
            "\nsalary=" + this.salary + "\nstartDate=" + empDate + "\nnote=" + this.note;
    }
}