const db = {
    users: [],
    exams: [],
    tasks: [],
    submissions: [],
    reviews: []
};

db.users = require("./basicData/dbUsers.json");
db.exams = require("./basicData/dbExams.json");
db.tasks = require("./basicData/dbTasks.json");
db.submissions = require("./basicData/dbSubmissions.json");
db.reviews = require("./basicData/dbReviews.json");

const DAOusers = {
    add(user) {
        user.id = uuid();
        db.users.push(user);
        return user;
    },
    changeUsername(newUsername, userId){
        let user = this.findByIdNoClone(userId);
        if (!user){
            return false;
        }
        user.username = newUsername;
        return true;
    },
    changeName(newName, userId){
        let user = this.findByIdNoClone(userId);
        if (!user){
            return false;
        }
        user.name = newName;
        return true;
    },
    changeSurname(newSurname, userId){
        let user = this.findByIdNoClone(userId);
        if (!user){
            return false;
        }
        user.surname = newSurname;
        return true;
    },
    changeEmail(newEmail, userId){
        let user = this.findByIdNoClone(userId);
        if (!user){
            return false;
        }
        user.email = newEmail;
        return true;
    },
    changePassword(newPassword, userId){
        let user = this.findByIdNoClone(userId);
        if (!user){
            return false;
        }
        user.password = newPassword;
        return true;
    },
    findByToken(token) {        
        return cloneObj(db.users.filter(user => user.accessToken == token)[0]);
    },
    findById(userId) {        
        return cloneObj(db.users.filter(user => user.id == userId)[0]);
    },
    findByIdNoClone(userId) {        
        return (db.users.filter(user => user.id == userId)[0]);
    },
    findByIds(ids) {
        return cloneObj(db.users.filter(user => ids.includes(user.id)));
    },
    findByMailPassword(email,password){
        return cloneObj(db.users.filter(user => user.email == email && user.password == password)[0]);
    },
    updateUser(user){
        let originalUserIndex = db.users.findIndex(us => us.id == user.id); 
        db.users[originalUserIndex] = cloneObj(user);
        return cloneObj(db.users[originalUserIndex]);
    },
    delete(userId){
        let user = this.findById(userId);
        if (!user){
            return false;
        }
        let index = db.users.findIndex(us => us.id == user.id);
        db.users.splice(index, 1);
        user = this.findById(userId);
        if (!user){
            return true;
        }
        return false ;
    },
    all() {
        return cloneObj(db.users);
    },
    findByFilters(email, text){
        let users ;
        if (!email)
        {
            users = db.users;
        } else 
        {
            users = db.users.filter(user => (user.email.indexOf(email)) >= 0 ) ;
        }
        if (text)
        {
            users = users.filter(user => (user.name.indexOf(text)) >= 0 || user.surname.indexOf(text) >= 0) ;
        }
        return cloneObj(users) ;
    }
};

const DAOexams = {    
    add(exam) {
        exam.id = uuid();
        db.exams.push(exam);
        return cloneObj(exam);
    },
    update(exam) {
        let originalExamIndex = db.exams.findIndex(ex => ex.id == exam.id); 
        db.exams[originalExamIndex] = exam;
        return cloneObj(db.exams[originalExamIndex]);
    },
    findById(examId) {        
        return cloneObj(db.exams.filter(exam => exam.id == examId)[0]);
    },
    findByUserId(userId, text) {
        let exams = db.exams.filter(exam => exam.createdBy == userId || exam.teacherassistants.indexOf(userId) >= 0 || exam.members.indexOf(userId));
        if (text) {
            exams = exams.filter(exam => exam.name.indexOf(text) >= 0)
        }
        return cloneObj(exams);
    },
    all() {
        return cloneObj(db.exams);
    },
    delete(exam) {
        let originalExamIndex = db.exams.findIndex(ex => ex.id == exam.id); 
        db.exams.splice(originalExamIndex, 1);
    }
};

const DAOtasks = {
    add(task) {
        task.id = uuid();
        db.tasks.push(task);
        return task;
    },
    findByExamId(examID) {
        let tasks = db.tasks.filter(task => task.examId == examID);
        return tasks;
    }
};

const DAOsubmissions = {
    findById(submissionsId) {        
        return cloneObj(db.submissions.filter(submission => submission.id == submissionsId)[0]);
    },
    findSubmissions(taskId, userId){
        let submissions = db.submissions.filter(submission => submission.taskId == taskId);
        if(userId){
            submissions = submissions.filter(submission=> submission.userId ==userId);
        }
        return cloneObj(submissions);
    },
    add(submission){
        submission.id=uuid();
        db.submissions.push(submission);
        return cloneObj(submission);
    }        
};

const DAOreviews = {
    
};

function cloneObj(obj) {
    if (!obj) return undefined;
    return JSON.parse(JSON.stringify(obj));
}


function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

module.exports = {
    DAOusers,
    DAOexams,
    DAOtasks,
    DAOsubmissions,
    DAOreviews
};