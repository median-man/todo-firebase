// database globals
var database = firebase.database();

var task = {
  newTask: function createNewTask(text) {
    var key = database.ref().push(text).key;
    return {
      key: key, // keep things es5 compatible
      text: text
    };
  }
};

// Function to create new htlm element for a task and append it to the task list
function appendNewTask(text) {
  $('.list-group').append(
    '<li class="list-group-item"><div class="row"><div class="col-xs-9">' +
    '<span class="glyphicon glyphicon-unchecked"></span>' +
    $('<span>').text(' ' + text).html() +
    '</div><div class="col-xs-3"><span class="glyphicon glyphicon-edit pull-right">' +
    '</span></div></div></li>');
}

// Function adds user input from add task form and clears the form.
function handleAddTaskFormSubmit(event) {
  event.preventDefault();
  var $newTaskInput = $('#txtNewTask');
  var newTask = $newTaskInput.val().trim();
  $newTaskInput.val('');
  console.log(task.newTask(newTask));
}

// Function to handle click on an edit element for a task
function handleEditTaskClick() {
  // when the user clicks on an edit button
  // get the id for the task that was clicked
  // display a form to edit the task
  // when user clicks ok
  // update the task and close the form
  // when user clicks cancel
  // close the form without updating the task
  console.log(this);
}

// set event listeners
$(document).on('click', '.glyphicon-edit', handleEditTaskClick);
$(function onDocumentReady() {
  $('form').on('submit', handleAddTaskFormSubmit);

  // append task to page when added to database
  database.ref().on('child_added', function handleTaskAdded(childSnap) {
    appendNewTask(childSnap.val());
  });
});
