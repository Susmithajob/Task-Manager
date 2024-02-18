var userModel = require('./users');

function addEntry()
{
    let displayTask = document.querySelector('.task');
    displayTask.innerHTML = displayTask.innerHTML+userModel.tasks[tasks.length-1]+'<button>Edit</button>'+'<button>Done</button>'+'<button>Delete</button>' ;

    //let displayDate = document.querySelector('#date');
}